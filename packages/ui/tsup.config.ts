import { readFile, writeFile } from "fs/promises";
import { defineConfig } from "tsup";
import type { Options } from "tsup";

const client = [
  "./src/avatar.tsx",
  "./src/calendar.tsx",
  "./src/checkbox.tsx",
  "./src/command.tsx",
  "./src/data-table.tsx",
  "./src/dialog.tsx",
  "./src/dropdown-menu.tsx",
  "./src/hover-card.tsx",
  "./src/form.tsx",
  "./src/input.tsx",
  "./src/label.tsx",
  "./src/password-input.tsx",
  "./src/popover.tsx",
  "./src/scroll-area.tsx",
  "./src/select.tsx",
  "./src/sheet.tsx",
  "./src/tabs.tsx",
  "./src/toaster.tsx",
  "./src/tooltip.tsx",
  "./src/use-toast.tsx",
  "./src/radio-group.tsx",
];

const server = [
  "./src/button.tsx",
  "./src/textarea.tsx",
  "./src/icons.tsx",
  "./src/card.tsx",
  "./src/table.tsx",
  "./src/toast.tsx",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    target: "es6",
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      // separate not to inject the banner
      ...common,
      entry: ["./src/index.ts", ...server],
    },
    {
      ...common,
      entry: client,
      esbuildOptions: (opts) => {
        opts.banner = {
          js: '"use client";',
        };
      },
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", {
            encoding: "utf-8",
          }),
        ) as PackageJson;
        pkgJson.exports = {
          "./package.json": "./package.json",
          ".": {
            import: "./dist/index.mjs",
            types: "./dist/index.d.ts",
          },
        };
        [...client, ...server]
          .filter((e) => e.endsWith(".tsx"))
          .forEach((entry) => {
            const file = entry.replace("./src/", "").replace(".tsx", "");
            pkgJson.exports["./" + file] = {
              import: "./dist/" + file + ".mjs",
              types: "./dist/" + file + ".d.ts",
            };
            pkgJson.typesVersions["*"][file] = ["dist/" + file + ".d.ts"];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ];
});

type PackageJson = {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
};
