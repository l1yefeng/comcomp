import * as fs from "node:fs/promises";
import { make } from "./comcomp.ts";

async function testOk(inp: string, outp: string): Promise<boolean> {
  const src = await fs.readFile(inp);
  const actual = await make(src.toString());
  const expected = (await fs.readFile(outp)).toString();
  const pass = expected.toString() == actual;
  if (!pass) {
    console.error(`Failed: ${inp} doesn't make ${outp}`);
  }
  return pass;
}

async function testErr(inp: string): Promise<boolean> {
  const src = await fs.readFile(inp);
  try {
    await make(src.toString());
  } catch {
    return true;
  }
  console.error(`Failed: ${inp} doesn't err`);
  return false;
}

const files = await fs.readdir("tests");
const items = files
  .flatMap((filename) =>
    filename.endsWith(".html") && !filename.endsWith("-out.html")
      ? [filename.substring(0, filename.length - 5)]
      : []
  );
const results = await Promise.all(items.map((item) => {
  const inp = `${item}.html`;
  const outp = `${item}-out.html`;
  return files.includes(outp)
    ? testOk(`tests/${inp}`, `tests/${outp}`)
    : testErr(`tests/${inp}`);
}));
console.info(`${results.filter((ok) => ok).length}/${results.length} passed`);
