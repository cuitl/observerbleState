import { expect, test } from 'vitest'

import { isDeepEqual } from '../utils'

test('should object deep equal', () => {
  const a = 1
  const b = 2

  expect(isDeepEqual(a, b)).toBe(false)

  const a2 = { a: 1, b: { id: 1 } }
  const b2 = { a: 1, b: { id: 1 } }

  expect(isDeepEqual(a2, b2)).toBe(true)

  const a3 = { a: 1, b: { id: 1 } }
  const b3 = { a: 1, b: { id: 1 }, c: 10 }

  expect(isDeepEqual(a3, b3)).toBe(false)

  const a4 = { a: 1, b: { id: 1 }, c: 10, d: { o: { id: 20 } } }
  const b4 = { a: 1, b: { id: 1 }, c: 10, d: { o: { id: 20 } } }

  expect(isDeepEqual(a4, b4)).toBe(true)
})
