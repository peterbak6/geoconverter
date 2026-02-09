const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", "packages", "geoconverter", "dist", "index.d.cts");
try {
  fs.rmSync(target, { force: true });
} catch (e) {
  // ignore
}
