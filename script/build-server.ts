/**
 * Server-only build for Railway deployment.
 * Skips the Vite client build — Vercel handles that.
 */
import { build as esbuild } from "esbuild";
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

async function buildServer() {
  await rm("dist", { recursive: true, force: true });

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

  // Copy runtime data files
  await mkdir("dist/data", { recursive: true });
  await cp("server/data", "dist/data", { recursive: true });
  await cp("data", "dist/brand-data", { recursive: true });
  await cp("content", "dist/content", { recursive: true });

  // Copy brand-assets so the API can serve them
  await mkdir("dist/brand-assets", { recursive: true });
  await cp("client/public/brand-assets", "dist/brand-assets", { recursive: true });
}

buildServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
