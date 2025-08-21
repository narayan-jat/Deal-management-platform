export const getPlural = (length: number) => {
  if (length === 1) {
    return "Deal";
  }
  return "Deals";
}