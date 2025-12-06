import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

/**
 * 递归复制目录 - 跨平台实现
 */
function copyDirectory(
  src: string,
  dest: string,
  excludePatterns: string[] = []
): void {
  // 创建目标目录
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const items = readdirSync(src);

  for (const item of items) {
    // 检查是否应该排除此项
    if (excludePatterns.some((pattern) => item.includes(pattern))) {
      continue;
    }

    const srcPath = join(src, item);
    const destPath = join(dest, item);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, excludePatterns);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig([
  {
    entry: ["apps/backend/cli.ts", "apps/backend/mcpServerProxy.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist",
    clean: true,
    sourcemap: true,
    dts: true,
    minify: process.env.NODE_ENV === "production",
    splitting: false,
    bundle: true,
    keepNames: true,
    platform: "node",
    esbuildOptions: (options) => {
      // 在生产环境移除 console 和 debugger
      if (process.env.NODE_ENV === "production") {
        options.drop = ["console", "debugger"];
      }

      // 添加路径别名支持
      options.resolveExtensions = ['.ts', '.js', '.json'];
      
      // 设置别名映射 - 使用相对于当前工作目录的路径
      if (!options.tsconfig) {
        options.tsconfig = 'tsconfig.json';
      }
    },
    outExtension() {
      return {
        js: ".js",
      };
    },
    external: [
      "ws",
      "child_process",
      "fs",
      "path",
      "url",
      "process",
      "dotenv",
      "commander",
      "chalk",
      "ora",
      "express",
    ],
  },
  {
    entry: ["apps/backend/WebServerStandalone.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist",
    sourcemap: true,
    dts: true,
    minify: process.env.NODE_ENV === "production",
    splitting: false,
    bundle: true,
    keepNames: true,
    platform: "node",
    esbuildOptions: (options) => {
      // 在生产环境移除 console 和 debugger
      if (process.env.NODE_ENV === "production") {
        options.drop = ["console", "debugger"];
      }

      // 添加路径别名支持
      options.resolveExtensions = ['.ts', '.js', '.json'];
      
      // 设置别名映射 - 使用相对于当前工作目录的路径
      if (!options.tsconfig) {
        options.tsconfig = 'tsconfig.json';
      }
    },
    outExtension() {
      return {
        js: ".js",
      };
    },
    external: [
      "ws",
      "child_process",
      "fs",
      "path",
      "url",
      "process",
      "dotenv",
      "commander",
      "chalk",
      "ora",
      "express",
    ],
  }
]);