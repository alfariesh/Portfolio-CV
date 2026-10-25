// One-time setup for deploying from GitHub: fills in what CI's deploy job
// needs (.github/workflows/ci.yml) on the repo, then deploys main.
//
//   vp run setup:deploy
//
// Needs `gh auth login` and `vp exec wrangler login` first. It reads the
// account id from wrangler and the site URL from src/seo.ts, and asks only for
// the API token, which you paste here (hidden) and which goes straight to
// `gh secret set`. Safe to run again: it keeps a token that is already set
// unless you pass --new-token.
import { execFileSync, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";

const tokenPage = "https://dash.cloudflare.com/profile/api-tokens";

function run(command: string, args: string[], input?: string) {
  return execFileSync(command, args, {
    encoding: "utf8",
    input,
    stdio: [input === undefined ? "inherit" : "pipe", "pipe", "pipe"],
  }).trim();
}

function fail(message: string): never {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

// Reads a line without echoing it, for the token.
function askHidden(question: string) {
  return new Promise<string>((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const write = (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput;
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s) => {
      if (s.startsWith(question)) write.call(rl, s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

// 1. GitHub: logged in, and which repo.
try {
  run("gh", ["auth", "status"]);
} catch {
  fail("Not logged in to GitHub. Run `gh auth login`, then try again.");
}
const repo = run("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
console.log(`repo         ${repo}`);

// 2. Cloudflare: the account wrangler is logged in to.
let accounts: { id: string; name: string }[];
try {
  accounts = JSON.parse(run("vp", ["exec", "wrangler", "whoami", "--json"])).accounts ?? [];
} catch {
  fail("Not logged in to Cloudflare. Run `vp exec wrangler login`, then try again.");
}
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? accounts[0]?.id;
if (!accountId) fail("No Cloudflare account found for this login.");
if (accounts.length > 1 && !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.log(`(several accounts; using the first. Set CLOUDFLARE_ACCOUNT_ID to pick another.)`);
}
console.log(`account      ${accountId}`);

// 3. The site URL, for the production environment's link on GitHub.
const seo = await readFile(new URL("../src/seo.ts", import.meta.url), "utf8");
const siteUrl = seo.match(/^\s*url:\s*"([^"]+)"/m)?.[1];
if (!siteUrl) fail("Couldn't find site.url in src/seo.ts.");
console.log(`site         ${siteUrl}`);

run("gh", ["variable", "set", "CLOUDFLARE_ACCOUNT_ID", "--repo", repo, "--body", accountId]);
run("gh", ["variable", "set", "SITE_URL", "--repo", repo, "--body", siteUrl]);
console.log("✓ variables  CLOUDFLARE_ACCOUNT_ID, SITE_URL");

// 4. The API token: the one thing wrangler's login can't hand to CI.
const secrets = run("gh", ["secret", "list", "--repo", repo, "--json", "name", "--jq", ".[].name"]);
if (secrets.split("\n").includes("CLOUDFLARE_API_TOKEN") && !process.argv.includes("--new-token")) {
  console.log("✓ secret     CLOUDFLARE_API_TOKEN (already set; --new-token to replace it)");
} else {
  console.log(`
Create a Cloudflare API token:
  1. ${tokenPage} → Create Token
  2. Template "Edit Cloudflare Workers" → Use template
  3. Account Resources: your account; Zone Resources: All zones → Continue → Create Token
`);
  spawnSync("open", [tokenPage], { stdio: "ignore" });
  const token = await askHidden("Paste the token (hidden): ");
  if (!token) fail("No token given.");

  // Check it before storing it, so a bad paste fails here, not in CI. A token
  // from the profile page is a user token; an account-owned one verifies
  // under the account.
  const verified = async (path: string) => {
    const response = await fetch(`https://api.cloudflare.com/client/v4/${path}/tokens/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return ((await response.json()) as { success: boolean }).success;
  };
  if (!(await verified("user")) && !(await verified(`accounts/${accountId}`))) {
    fail("Cloudflare didn't accept that token. Nothing was saved.");
  }

  run("gh", ["secret", "set", "CLOUDFLARE_API_TOKEN", "--repo", repo], token);
  console.log("✓ secret     CLOUDFLARE_API_TOKEN");
}

// 5. Deploy main now rather than waiting for the next push.
type LatestRun = { databaseId: number; event: string } | undefined;
const latestRun = (): LatestRun => {
  const out = run("gh", [
    "run",
    "list",
    "--workflow",
    "ci.yml",
    "--repo",
    repo,
    "--limit",
    "1",
    "--json",
    "databaseId,event",
    "--jq",
    ".[0] // empty",
  ]);
  return out ? (JSON.parse(out) as LatestRun) : undefined;
};
const before = latestRun();
run("gh", ["workflow", "run", "ci.yml", "--repo", repo, "--ref", "main"]);
// The dispatch lands asynchronously. Wait for its run to appear so a trigger
// that quietly failed can't end the setup on a success note.
const deadline = Date.now() + 30_000;
let runId: number | undefined;
while (!runId && Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const current = latestRun();
  if (current?.event === "workflow_dispatch" && current.databaseId !== before?.databaseId) {
    runId = current.databaseId;
  }
}
if (!runId) {
  fail(
    "No CI run appeared within 30s of triggering it. Start one by hand: gh workflow run ci.yml --ref main",
  );
}
console.log(`
✓ CI run ${runId} started; it deploys once check, test and build pass.
  watch it:  gh run watch ${runId} --repo ${repo}
  from now on every push to main deploys ${siteUrl}`);
