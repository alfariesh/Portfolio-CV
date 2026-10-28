type CiRun = { databaseId: number; url: string };

// Scope polling to manual main runs, so a concurrent PR or push cannot hide
// the deployment. Keep all prior IDs rather than assuming the first row is new.
export async function dispatchDeploy(repo: string, runGh: (args: string[]) => string) {
  const runs = (): CiRun[] =>
    JSON.parse(
      runGh([
        "run",
        "list",
        "--workflow",
        "ci.yml",
        "--repo",
        repo,
        "--branch",
        "main",
        "--event",
        "workflow_dispatch",
        "--limit",
        "20",
        "--json",
        "databaseId,url",
      ]),
    );
  const before = new Set(runs().map((run) => run.databaseId));
  runGh(["workflow", "run", "ci.yml", "--repo", repo, "--ref", "main"]);

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const current = runs().find((run) => !before.has(run.databaseId));
    if (current) return current;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(
    `No manual CI run on main appeared within 30s. Retry: gh workflow run ci.yml --repo ${repo} --ref main`,
  );
}
