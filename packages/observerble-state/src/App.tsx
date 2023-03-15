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
    console.log('state created')

    onChange((state, prev) => {
      console.log('state change from ', prev, ' to ', state)
    })

    onTrap(() => {
      console.log('onTrap: state is using....')
      logObservers('Log Ob: ')
      const t = setInterval(() => {
        setState(prev => ({ ...prev, time: prev.time + 1 }))
      }, 3000)
      onUnTrap(() => {
        console.log('onUnTrap....')
        clearInterval(t)
      })
    })

    onTrack(() => {
      console.log('add a new Observer')
    })
  },
)

const Counter = memo(function Counter() {
  // const [{ num, time }, setState] = useCount()
  // const [{ num, time }, setState] = useCount(state => [state.num])
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
        <Counter />
      </h2>

      <button
        onClick={() => useCount.setState(p => ({ ...p, num: p.num + 1 }))}
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
