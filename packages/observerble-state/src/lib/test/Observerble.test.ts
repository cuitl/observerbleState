import { expect, test } from 'vitest'

import Observerble from '../Observerble'

const observerble = new Observerble(0)

test('observerble is created', () => {
  expect(observerble).toBeDefined()
  expect(observerble.get()).toBe(0)
})

test('observerble set State', () => {
  observerble.set(1)
  expect(observerble.get()).toBe(1)

  observerble.set(prev => prev + 1)
  expect(observerble.get()).toBe(2)
})

test('observerble onChange basic', () => {
  let onChangeTimes = 0

  observerble.on('onChange', (state, prev) => {
    console.log('onChange: state change from ', prev, ' to ', state)
    onChangeTimes += 1
  })

  observerble.set(1)
  expect(observerble.get()).toBe(1)
  expect(onChangeTimes).toBe(1)
})

test('observerble onChange object', () => {
  const observerble = new Observerble({ count: 0 })

  let onChangeTimes = 0

  observerble.on('onChange', (state, prev) => {
    console.log('onChange: state change from ', prev, ' to ', state)
    onChangeTimes += 1
  })

  expect(observerble.get().count).toBe(0)

  console.log('set state bad & will not trigger on change')
  observerble.set(prev => {
    prev.count = 1
    return prev
  })

  expect(observerble.get().count).toBe(1)
  expect(onChangeTimes).toBe(0)

  console.log('set state good')
  observerble.set(prev => ({ ...prev, count: prev.count + 1 }))
  expect(observerble.get().count).toBe(2)

  expect(onChangeTimes).toBe(1)
})

test('observerble on Trap/Track', () => {
  let onTrackTimes = 0
  let onTrapTimes = 0

  observerble.on('onTrack', () => {
    console.log('onTrack: add new observer')
    onTrackTimes += 1
  })

  observerble.on('onUnTrack', () => {
    console.log('onUnTrack: remove an observer')
    onTrackTimes -= 1
  })

  observerble.on('onTrap', () => {
    console.log('onTrap: state are observed')
    onTrapTimes += 1
  })

  observerble.on('onUnTrap', () => {
    console.log('onUnTrap: state watting to be observed')
    onTrapTimes -= 1
  })

  const unSubscribe1 = observerble.subscribe(() => {
    console.log('add ob 1')
  })

  expect(onTrackTimes).toBe(1)
  expect(onTrapTimes).toBe(1)

  const unSubscribe2 = observerble.subscribe(() => {
    console.log('add ob 2')
  })

  expect(onTrackTimes).toBe(2)
  expect(onTrapTimes).toBe(1)

  unSubscribe1()

  expect(onTrackTimes).toBe(1)
  expect(onTrapTimes).toBe(1)

  unSubscribe2()

  expect(onTrackTimes).toBe(0)
  expect(onTrapTimes).toBe(0)
})
