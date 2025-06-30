
export function groupArrayByKey<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((acc, obj) => {
    const keyValue = obj[key];
    const keyString = String(keyValue);
    
    if (!acc[keyString]) {
      acc[keyString] = [];
    }
    acc[keyString].push(obj);
    
    return acc;
  }, {} as Record<string, T[]>);
}