export const extractFirstNumber = (str: string) => {
  const match = str.match(/\d+/);

  if (match) {
    return parseInt(match[0], 10);
  }

  return 0;
};
