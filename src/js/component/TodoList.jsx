import React, { useState } from 'react'

function TodoList() {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);

  function handleKeyDown(event) {
    const text = event.target.value.trim();
    if (event.code === "Enter") {
      addItem(text);
    }
  }

  function addItem(text) {
    if (text) {
      setList([...list, text]);
    }
    setInput("");
  }

  function removeItem(index) {
    setList([...list.filter((item, i) => i !== index)])
  }

  return (
    <div className='container d-flex flex-column gap-4 justify-content-center p-4'>
      <input className='form-control mb-2' type="text" onKeyDown={handleKeyDown} value={input} onChange={(e) => setInput(event.target.value)} />
      {
        list.length === 0 ? (
          <div className='alert alert-primary text-center'>
            <i className='fas fa-info-circle'></i> Aún no hay ninguna tarea agregada, agrega alguna.
          </div>
        ) : (
          <ul className='list-group'>
            {
              list.map((item, index) => (
                <li className='list-group-item list-group-item-action d-flex justify-content-between align-items-center' key={index}>{item} <button className='btn btn-danger' onClick={() => removeItem(index)}><i className='fas fa-trash text-white'></i></button></li>
              ))
            }
          </ul>
        )
      }

    </div>
  )
}

export default TodoList