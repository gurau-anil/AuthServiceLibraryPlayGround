import { useState } from 'react'
import './App.css'
import { useLoaderData, useNavigate } from 'react-router'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();
  var pokeData = useLoaderData();

  return (
    <>
    This is a Home page
      
    </>
  )
}

export default App
