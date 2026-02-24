import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..", "..", "backend");

async function globalSetup() {
  execSync("npm run db:seed", {
    cwd: backendDir,
    stdio: "inherit",
  });
}

export default globalSetup;
