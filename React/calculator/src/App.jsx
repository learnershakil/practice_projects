import { useState } from "react";

function App() {
  const [display, setDisplay] = useState("");
  

  /**
 * Handles button click events and updates the display.
 * 
 * @param {HTMLElement} button - The button element that was clicked.
 */
  function handleClick(button) {
    const value = button.innerHTML;

    if (value === "AC") {
      setDisplay("");
    } else if (value === "←") {
      setDisplay((prev) => prev.slice(0, -1));
    } else if (value === "=") {
      try {
      setDisplay(eval(display).toString());
      } catch {
      setDisplay("Error");
      }
    }
    else if (["+", "-", "*", "/", "."].includes(value) && ["+", "-", "*", "/", "."].includes(display.at(-1))) {
      setDisplay((prev) => prev.slice(0, -1) + value);
    }
     else if (value === "+/-") {
      setDisplay((prev) => (prev.charAt(0) === "-" ? prev.slice(1) : "-" + prev));
    } else if (value === ".") {
      setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
    } 
    else {
      setDisplay((prev) => prev + value);
    } 
  }
  
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="h-[95%] w-[40%] border-white border-2 bg-zinc-900">
        <div id="display" className="h-[30%] w-full text-white text-6xl text-right content-center p-4">
          {display}
        </div>
        <div id="buttons" className="h-[70%] w-full grid grid-cols-4 grid-rows-5">
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-700 text-white text-2xl hover:bg-gray-600">AC</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-700 text-white text-2xl hover:bg-gray-600">+/-</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-700 text-white text-2xl hover:bg-gray-600">←</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-orange-500 text-white text-2xl hover:bg-orange-400">/</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">7</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">8</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">9</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-orange-500 text-white text-2xl hover:bg-orange-400">*</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">4</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">5</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">6</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-orange-500 text-white text-2xl hover:bg-orange-400">-</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">1</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">2</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">3</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-orange-500 text-white text-2xl hover:bg-orange-400">+</button>
          <button onClick={(e) => handleClick(e.target)} className="col-span-2 bg-gray-800 text-white text-2xl hover:bg-gray-700">0</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-gray-800 text-white text-2xl hover:bg-gray-700">.</button>
          <button onClick={(e) => handleClick(e.target)} className="bg-orange-500 text-white text-2xl hover:bg-orange-400">=</button>
        </div>
      </div>
    </div>
  );
}

export default App
