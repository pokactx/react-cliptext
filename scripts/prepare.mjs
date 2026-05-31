import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

// Skip when consumers install from npm (lefthook is a devDependency).
if (!existsSync("node_modules/lefthook")) {
  process.exit(0);
}

const result = spawnSync("lefthook", ["install"], {
  shell: true,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
