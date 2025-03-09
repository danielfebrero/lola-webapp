export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str; // handles empty strings
  return str[0].toUpperCase() + str.slice(1);
};

export const snakeCaseToCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

export const camelCaseToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (group) => `_${group.toLowerCase()}`);
};

export const objectSnakeToCamel = (
  obj: Record<string, any>
): Record<string, any> => {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    newObj[snakeCaseToCamelCase(key)] = obj[key];
  }
  return newObj;
};
