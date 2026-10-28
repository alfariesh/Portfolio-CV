import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { dispatchDeploy } from "./deploy-ci.ts";

const repo = "example/portfolio";
const oldRun = { databaseId: 10, url: "https://github.com/example/portfolio/actions/runs/10" };
const newRun = { databaseId: 11, url: "https://github.com/example/portfolio/actions/runs/11" };

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("waits for a new run and restricts polling to manual CI runs on main", async () => {
  const runGh = vi
    .fn<(args: string[]) => string>()
    .mockReturnValueOnce(JSON.stringify([oldRun]))
    .mockReturnValueOnce("")
    .mockReturnValueOnce(JSON.stringify([oldRun]))
    .mockReturnValueOnce(JSON.stringify([newRun, oldRun]));
  const result = dispatchDeploy(repo, runGh);
  await vi.runAllTimersAsync();
  expect(await result).toEqual(newRun);
  expect(runGh.mock.calls[0]?.[0]).toEqual([
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
  ]);
  expect(runGh.mock.calls[1]?.[0]).toEqual([
    "workflow",
    "run",
    "ci.yml",
    "--repo",
    repo,
    "--ref",
    "main",
  ]);
});

it("finds the new run even when an existing run is listed first", async () => {
  const runGh = vi
    .fn<(args: string[]) => string>()
    .mockReturnValueOnce(JSON.stringify([oldRun]))
    .mockReturnValueOnce("")
    .mockReturnValueOnce(JSON.stringify([oldRun, newRun]));
  expect(await dispatchDeploy(repo, runGh)).toEqual(newRun);
});

it("handles the first manual run in a repository", async () => {
  const runGh = vi
    .fn<(args: string[]) => string>()
    .mockReturnValueOnce("[]")
    .mockReturnValueOnce("")
    .mockReturnValueOnce(JSON.stringify([newRun]));
  expect(await dispatchDeploy(repo, runGh)).toEqual(newRun);
});

it("fails after 30 seconds instead of reporting an old run as a success", async () => {
  const runGh = vi.fn<(args: string[]) => string>().mockReturnValue(JSON.stringify([oldRun]));
  const result = expect(dispatchDeploy(repo, runGh)).rejects.toThrow(
    `gh workflow run ci.yml --repo ${repo} --ref main`,
  );
  await vi.runAllTimersAsync();
  await result;
});

it("propagates a failed dispatch without claiming CI started", async () => {
  const runGh = vi
    .fn<(args: string[]) => string>()
    .mockReturnValueOnce("[]")
    .mockImplementationOnce(() => {
      throw new Error("dispatch denied");
    });
  await expect(dispatchDeploy(repo, runGh)).rejects.toThrow("dispatch denied");
});
