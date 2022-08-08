export const isObject = (o: unknown) => o !== null && typeof o === 'object'

export const isDeepEqual = (obj1: any, obj2: any) => {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }

  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  for (const key of obj1Keys) {
    const value1 = obj1[key]
    const value2 = obj2[key]
    const isObjects = isObject(value1) && isObject(value2)

    if (
      (isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false
    }
  }

  return true
}
