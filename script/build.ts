import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp, mkdir } from "fs/promises";

const allowlist = [
  "@anthropic-ai/sdk",
  "connect-pg-simple",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-session",
  "googleapis",
  "memorystore",
  "mime-types",
  "nanoid",
  "node-cron",
  "p-limit",
  "p-retry",
  "passport",
  "passport-local",
  "pdf-parse",
  "pg",
  "pptxgenjs",
  "rss-parser",
  "ws",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  // Copy static data files the server reads at runtime
  await mkdir("dist/data", { recursive: true });
  await cp("server/data", "dist/data", { recursive: true });
  await cp("data", "dist/brand-data", { recursive: true });
  await cp("content", "dist/content", { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
