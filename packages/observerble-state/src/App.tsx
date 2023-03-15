import './App.css'

import { memo, useEffect, useMemo, useRef, useState } from 'react'

import reactLogo from './assets/react.svg'
import createGlobalState from './lib/createGlobalState'

const useCount = createGlobalState(
  {
    num: 0,
    time: 0,
  },
  ({ logObservers, onChange, onTrap, onUnTrap, setState, onTrack }) => {
    console.log('State Setup: 数据创建完成')

    onChange((state, prev) => {
      console.log('onChange： state change from ', prev, ' to ', state)
    })

    let t: Parameters<typeof clearInterval>[0]

    onTrap(() => {
      console.log('onTrap: state is using....')
      logObservers('Log Ob: ')
      t = setInterval(() => {
        setState(prev => ({ ...prev, time: prev.time + 1 }))
      }, 3000)
    })

    onUnTrap(() => {
      console.log('onUnTrap....')
      clearInterval(t)
    })

    onTrack(() => {
      console.log('add a new Observer')
    })
  },
)

const Counter = memo(function Counter() {
  // const [{ num, time }, setState] = useCount()

  // when num change to rerender 1
  // const [{ num, time }, setState] = useCount(state => [state.num])
  // when num change to rerender 2
  const [{ num, time }, setState] = useCount(
    (state, prev) => state.num !== prev.num,
  )

  const onIncrease = () => {
    setState(prev => ({ ...prev, num: prev.num + 1 }))
  }

  return (
    <button onClick={onIncrease}>
      num: {num}, time: {time}
    </button>
  )
})

function App() {
  const [count, setCount] = useState(0)
  const [toggle, setToggle] = useState(true)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <h2>
        <span>Global State: </span>
        {toggle && <Counter />}
        <button onClick={() => setToggle(p => !p)}>组件显示/销毁</button>
      </h2>

      <button
        onClick={() => useCount.setState(p => ({ ...p, num: p.num + 1 }))}
        style={{ fontSize: 12 }}
      >
        Increase count outof Counter Component
      </button>

      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          Local State: count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
