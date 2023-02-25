export const cut = (val: string, max: number) => {
  if (val.length < max) return val;
  return val.substring(0, max) + "..."
}