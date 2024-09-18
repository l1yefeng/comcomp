export async function make(src: string): Promise<string> {
  const result = /<script +id="comcomp">([^]*)<\/script>/.exec(src);
  if (result == null) {
    return src;
  }

  const script = result[1];
  const template = src.slice(0, result.index) +
    src.slice(result.index + result[0].length);

  const scriptAddon = "; export const _html = `" + template + "`;";
  const ctx = await import(
    "data:application/javascript," + encodeURIComponent(script + scriptAddon)
  );
  return ctx._html;
}
