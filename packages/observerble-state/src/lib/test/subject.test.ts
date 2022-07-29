import { expect, test } from 'vitest'

import Observer from '../Observer'
import Subject from '../Subject'

class TestObserver extends Observer {
  constructor(private fn: () => void, name = '') {
    super(name)
  }

  update() {
    this.fn()
  }
}

const subject = new Subject()

test('subject is defined', () => {
  expect(subject).toBeDefined()
})

const data1 = {
  num: 15,
}

const data2 = {
  num: 25,
}

const ob1 = new TestObserver(() => {
  data1.num++
})

test('observer 1 is defined', () => {
  expect(ob1).toBeDefined()
})

const ob2 = new TestObserver(() => {
  data2.num++
})

test('observer 2 is defined', () => {
  expect(ob2).toBeDefined()
})

subject.addObserver(ob1)
subject.addObserver(ob2)

test.concurrent('notify observer', async ({ expect }) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  subject.emit()
  expect(data1.num).toBe(16)
  expect(data2.num).toBe(26)
})
