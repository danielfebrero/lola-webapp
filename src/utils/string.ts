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

export const objectSnakeToCamelDeep = (
  obj: Record<string, any>
): Record<string, any> => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return obj;
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[snakeCaseToCamelCase(key)] = objectSnakeToCamelDeep(obj[key]);
    } else {
      newObj[snakeCaseToCamelCase(key)] = obj[key];
    }
  }
  return newObj;
};

export const arrayOfObjectsSnakeToCamelDeep = (
  arr: Record<string, any>[]
): Record<string, any>[] => {
  return arr.map((obj) => objectSnakeToCamelDeep(obj));
};
