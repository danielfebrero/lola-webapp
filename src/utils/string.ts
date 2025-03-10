export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str; // handles empty strings
  return str[0].toUpperCase() + str.slice(1);
};
