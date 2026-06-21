/* eslint-disable jest/require-hook */

const readJson = (path) => Bun.file(path).json();

const writeJson = async (path, data) => {
  await Bun.write(path, `${JSON.stringify(data, null, 2)}\n`);
};

const semverPattern =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;

const packageJson = await readJson("package.json");
const { version } = packageJson;

if (typeof version !== "string" || !semverPattern.test(version)) {
  throw new Error(`Invalid package.json version: ${String(version)}`);
}

const files = ["deno.json", "jsr.json"];
let changed = 0;

for (const file of files) {
  const data = await readJson(file);

  if (data.version === version) {
    console.log(`unchanged ${file} (${version})`);
    continue;
  }

  data.version = version;
  await writeJson(file, data);
  changed += 1;
  console.log(`updated ${file} -> ${version}`);
}

if (changed === 0) {
  console.log("all versions already in sync");
}
