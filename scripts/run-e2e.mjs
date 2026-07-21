import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";

const localOrigin = "http://127.0.0.1:3100";
const targetOrigin = process.env.PLAYWRIGHT_TEST_BASE_URL ?? localOrigin;
const nextCli = resolve("node_modules", "next", "dist", "bin", "next");
const playwrightCli = resolve("node_modules", "@playwright", "test", "cli.js");
const testArguments = process.argv.slice(2);
const startupTimeoutMs = 30_000;
const shutdownTimeoutMs = 5_000;

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function isAvailable(origin) {
  try {
    const response = await fetch(origin, { redirect: "manual", signal: AbortSignal.timeout(2_000) });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(origin, child) {
  const deadline = Date.now() + startupTimeoutMs;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error("The local production server stopped before it became ready.");
    }
    if (await isAvailable(origin)) {
      return;
    }
    await delay(150);
  }

  throw new Error(`The local production server was not ready within ${startupTimeoutMs}ms.`);
}

function hasExited(child) {
  return child.exitCode !== null || child.signalCode !== null;
}

async function waitForChildExit(child, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (!hasExited(child) && Date.now() < deadline) {
    await delay(50);
  }
  return hasExited(child);
}

async function stopServer(child) {
  if (hasExited(child)) {
    return;
  }

  child.kill();
  if (!await waitForChildExit(child, shutdownTimeoutMs)) {
    child.kill("SIGKILL");
    await waitForChildExit(child, shutdownTimeoutMs);
  }
}

async function runPlaywright() {
  const child = spawn(process.execPath, [playwrightCli, "test", ...testArguments], {
    env: {
      ...process.env,
      PLAYWRIGHT_TEST_BASE_URL: targetOrigin,
    },
    stdio: "inherit",
  });
  const [exitCode] = await once(child, "exit");
  return typeof exitCode === "number" ? exitCode : 1;
}

let server;

try {
  const available = await isAvailable(targetOrigin);
  if (!available && targetOrigin !== localOrigin) {
    throw new Error(`The configured Playwright target is unavailable: ${targetOrigin}`);
  }

  if (!available) {
    server = spawn(process.execPath, [
      nextCli,
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3100",
    ], {
      env: {
        ...process.env,
        CONTACT_DELIVERY_MODE: "development",
        DESIGN_SYSTEM_SHOWCASE: "false",
      },
      stdio: ["ignore", "inherit", "inherit"],
    });
    await waitForServer(localOrigin, server);
  }

  process.exitCode = await runPlaywright();
} catch (error) {
  const message = error instanceof Error ? error.message : "End-to-end verification failed.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
} finally {
  if (server) {
    await stopServer(server);
  }
}
