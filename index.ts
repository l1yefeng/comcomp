import { parseArgs } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { argv, exit, stdin, stdout } from "node:process";
import { make } from "./comcomp.ts";

const { values } = parseArgs({
  args: argv.slice(2),
  options: {
    input: {
      type: "string",
      short: "i",
    },
    output: {
      type: "string",
      short: "o",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
});

if (values.help) {
  console.log(`comcomp
a simple single-HTML-file writer

usage: comcomp [-i INPUT_PATH] [-o OUTPUT_PATH]
         input/output uses stdin/stdout if unset
       comcomp -h
         print this help
`);
  exit(0);
}

let bytes;
if (values.input) {
  bytes = await readFile(values.input);
} else {
  bytes = stdin.read();
  if (bytes == null) {
    console.error("failed to read from stdin");
    exit(1);
  }
}

const made = await make(bytes.toString());

if (values.output) {
  await writeFile(values.output, made);
} else {
  stdout.write(made);
}
