cat > check-imports.mjs <<'SCRIPT'
import fs from "fs";
import path from "path";

const root = process.cwd();
const exts = [".ts", ".tsx"];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(p);
    } else if (exts.includes(path.extname(p))) {
      files.push(p);
    }
  }
}
walk(root);

function resolves(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(root, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return true; // 外部パッケージは対象外
  for (const suf of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (fs.existsSync(base + suf)) return true;
  }
  return fs.existsSync(base) && fs.statSync(base).isFile();
}

let missing = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const re = /from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    if ((spec.startsWith("@/") || spec.startsWith(".")) && !resolves(f, spec)) {
      console.log("MISSING:", spec, "  (imported by", path.relative(root, f) + ")");
      missing++;
    }
  }
}
console.log(missing ? `\n=> ${missing} missing files` : "\n=> ALL IMPORTS RESOLVE (0 missing)");
SCRIPT