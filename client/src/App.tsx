import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
    
        <div>
          <h1>GymRat</h1>
          <p>
            Track workouts, build routines, and monitor progress.
          </p>
        </div>
      </section>

      <div className="ticks"></div>

  

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
