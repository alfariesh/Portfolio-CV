// Draws the social cards (public/og/*.png, one per page in src/seo.ts) and the
// PNG favicons Google needs (it doesn't read SVG), by screenshotting the dev
// server in headless Chrome over the DevTools protocol. Real time, not
// --virtual-time-budget, so the figures' demos run and leave them lit.
//
//   vp run og      (after changing a page's title, card or figure)
//
// Needs Google Chrome; set CHROME_PATH if it lives somewhere else.
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const site = "http://localhost:5199";
const debugPort = 9339;
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const concurrency = 4;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url: string, timeout = 30_000) {
  for (const start = Date.now(); Date.now() - start < timeout; await sleep(250)) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // not up yet
    }
  }
  throw new Error(`${url} did not come up`);
}

// A minimal DevTools protocol client: one socket, sessions for each tab.
async function connect(url: string) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    const call = pending.get(message.id);
    if (!call) return;
    pending.delete(message.id);
    if (message.error) call.reject(new Error(message.error.message));
    else call.resolve(message.result);
  });
  const send = (method: string, params: object = {}, sessionId?: string): Promise<any> =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  return { send, close: () => socket.close() };
}

type Cdp = Awaited<ReturnType<typeof connect>>;

async function openTab(cdp: Cdp, width: number, height: number) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const send = (method: string, params: object = {}) => cdp.send(method, params, sessionId);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  return { send, close: () => cdp.send("Target.closeTarget", { targetId }) };
}

type Tab = Awaited<ReturnType<typeof openTab>>;

async function shoot(tab: Tab, url: string, file: string, ready = "true") {
  await tab.send("Page.navigate", { url });
  for (let tries = 0; ; tries++) {
    const { result } = await tab.send("Runtime.evaluate", {
      expression: ready === "true" ? "document.documentElement.dataset.ready" : ready,
      returnByValue: true,
    });
    if (result.value) break;
    if (tries > 120) throw new Error(`${url} never became ready`);
    await sleep(250);
  }
  const { data } = await tab.send("Page.captureScreenshot", { format: "png" });
  const target = join(publicDir, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(data, "base64"));
  console.log(`  ${file}`);
}

// Own process groups, so stopping them also stops whatever they spawned.
const vite = spawn("vp", ["dev", "--port", "5199", "--strictPort"], {
  stdio: "ignore",
  detached: true,
});
const profile = await mkdtemp(join(tmpdir(), "og-chrome-"));
const chrome = spawn(
  chromePath,
  [
    "--headless",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore", detached: true },
);

try {
  await waitForUrl(`${site}/social-cards/`);
  const browser = await waitForUrl(`http://127.0.0.1:${debugPort}/json/version`);
  const version = (await browser.json()) as { webSocketDebuggerUrl: string };
  const cdp = await connect(version.webSocketDebuggerUrl);

  // The card page knows the pages; ask it.
  const probe = await openTab(cdp, 1200, 630);
  await probe.send("Page.navigate", { url: `${site}/social-cards/` });
  let paths: string[] = [];
  while (!paths.length) {
    await sleep(250);
    const { result } = await probe.send("Runtime.evaluate", {
      expression: "window.ogPaths ?? []",
      returnByValue: true,
    });
    paths = result.value;
  }
  await probe.close();

  console.log(`social cards (${paths.length})`);
  const queue = [...paths];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      const tab = await openTab(cdp, 1200, 630);
      for (let path = queue.shift(); path; path = queue.shift()) {
        const file = path === "/" ? "og/home.png" : `og${path}.png`;
        await shoot(tab, `${site}/social-cards/?path=${encodeURIComponent(path)}`, file);
      }
      await tab.close();
    }),
  );

  // Google Search wants a raster favicon, ideally a multiple of 48px. The
  // touch icon is filled to the corners: iOS rounds it and would show black.
  console.log("favicons");
  const loaded = "document.readyState === 'complete'";
  const icon = await openTab(cdp, 96, 96);
  await icon.send("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 0, g: 0, b: 0, a: 0 },
  });
  await shoot(icon, `${site}/favicon.svg`, "favicon-96.png", loaded);
  await icon.close();
  const touch = await openTab(cdp, 180, 180);
  await touch.send("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 0x23, g: 0x25, b: 0x1d, a: 1 },
  });
  await shoot(touch, `${site}/favicon.svg`, "apple-touch-icon.png", loaded);
  await touch.close();

  cdp.close();
} finally {
  for (const child of [chrome, vite]) if (child.pid) process.kill(-child.pid);
  // Chrome may still be flushing its profile as it exits.
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
