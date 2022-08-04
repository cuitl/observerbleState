import { act, renderHook } from '@testing-library/react-hooks'
import { expect, test } from 'vitest'

import Observerble from '../Observerble'
import useObserverble from '../useObserverble'

test('should state share basic', () => {
  const observerble = new Observerble(0)

  const { result: one } = renderHook(() => useObserverble(observerble))
  const { result: two } = renderHook(() => useObserverble(observerble))

  console.log('state init', observerble.get())

  expect(one.current[0]).toBe(0)
  expect(two.current[0]).toBe(0)

  act(() => {
    one.current[1](prev => prev + 1)
  })

  console.log('component:one set state', observerble.get())

  expect(one.current[0]).toBe(1)
  expect(two.current[0]).toBe(1)
  expect(observerble.get()).toBe(1)

  act(() => {
    two.current[1](prev => prev + 1)
  })

  console.log('component:two set state', observerble.get())

  expect(one.current[0]).toBe(2)
  expect(two.current[0]).toBe(2)
  expect(observerble.get()).toBe(2)

  observerble.set(10)

  console.log('global: observerble set state', observerble.get())

  expect(one.current[0]).toBe(10)
  expect(two.current[0]).toBe(10)
  expect(observerble.get()).toBe(10)
})

test('should comp refresh only state in DepsFn', () => {
  const observerble = new Observerble({ count: 0, times: 10 })
  const { result } = renderHook(() =>
    useObserverble(observerble, state => [state.count]),
  )

  console.log('state init', observerble.get())

  expect(result.current[0].count).toBe(0)
  expect(result.current[0].times).toBe(10)

  observerble.set(prev => ({ ...prev, times: 20 }))
  console.log('global: observerble modify state.times to 20', observerble.get())

  expect(result.current[0].count).toBe(0)
  expect(result.current[0].times).toBe(10)

  console.log('the comp now state is: ', result.current[0])

  observerble.set(prev => ({ ...prev, count: 2 }))
  console.log('global: observerble modify state.count to 2', observerble.get())

  expect(result.current[0].count).toBe(2)
  expect(result.current[0].times).toBe(20)

  console.log('the comp now state is: ', result.current[0])
})
