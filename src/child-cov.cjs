const fs = require("fs");
const path = require("path");
const processOnSpawn = require("process-on-spawn");

const tmpDir = process.env["LIGHT_JEST_COV_TMP"];
if (tmpDir) {
  process.env["LIGHT_JEST_COV_TMP"] = undefined;

  setCovHook(() => {
    return { LIGHT_JEST_COV_TMP: tmpDir };
  });

  process.addListener("exit", () => {
    if (globalThis.__coverage__) {
      fs.writeFileSync(
        path.join(
          tmpDir,
          `cov_${process.pid}_${process.hrtime
            .bigint()
            .toString()
            .substring(10)}.json`
        ),
        JSON.stringify(globalThis.__coverage__)
      );
    }
  });
}

function setCovHook(fn) {
  processOnSpawn.addListener(({ execPath, env }) => {
    Object.assign(env, fn());
  });
}
module.exports = { setHook: setCovHook };
