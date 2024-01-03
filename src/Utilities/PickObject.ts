export function pickObject<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>
): Pick<T, U> {
  const result = Object.create(null);
  for (const k of paths) {
    result[k] = obj[k];
  }
  return result;
}

export function omitObject<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>
): Omit<T, U> {
  const result = { ...obj };
  paths.forEach((key) => {
    delete result[key];
  });

  return result;
}
// function omit(obj:object, key: ) {
//   const { [key]: omitted, ...rest } = obj;
//   return rest;
// }
