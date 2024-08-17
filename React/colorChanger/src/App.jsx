import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState('white')

  return (
    <>
     <div className='w-full h-screen duration-200' style={{backgroundColor: color}}>
      <div className="flex fixed flex-wrap justify-center bottom-12 inset-x-0 px-2">
        <div className='flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl'>
          <button className='bg-red-500 rounded-lg px-2 py-1' onClick={()=> setColor('red')}>red</button>
          <button className='bg-green-500 rounded-lg px-2 py-1' onClick={()=> setColor('green')}>green</button>
          <button className='bg-blue-500 rounded-lg px-2 py-1' onClick={()=> setColor('blue')}>blue</button>
          <button className='bg-orange-500 rounded-lg px-2 py-1' onClick={()=> setColor('orange')}>orange</button>
          <button className='bg-yellow-500 rounded-lg px-2 py-1' onClick={()=> setColor('yellow')}>yelloe</button>
          <button className='bg-pink-500 rounded-lg px-2 py-1' onClick={()=> setColor('pink')}>pink</button>
          <button className='bg-purple-500 rounded-lg px-2 py-1' onClick={()=> setColor('purple')}>purple</button>
          <button className='bg-slate-500 rounded-lg px-2 py-1' onClick={()=> setColor('gray')}>slate</button>
        </div>
      </div>
     </div>
    </>
  )
}

export default App