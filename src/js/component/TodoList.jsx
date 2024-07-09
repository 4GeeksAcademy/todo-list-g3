import React, { useEffect, useState } from 'react'

function TodoList() {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    createUser()
    getTasks()
  }, [])

  function createUser() {
    fetch("https://playground.4geeks.com/todo/users/fernando_gimeno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error))
  }

  function getTasks() {
    fetch("https://playground.4geeks.com/todo/users/fernando_gimeno")
      .then((response) => response.json())
      .then((data) => setList(data.todos))
      .catch((error) => console.log(error))
  }

  function createTask(task) {
    const newTask = {
      label: task,
      is_done: false,
    }

    fetch("https://playground.4geeks.com/todo/todos/fernando_gimeno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify(newTask)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data) => {
        setList([...list, data])
        getTasks();
      })
      .catch((error) => console.log(error))
  }

  function handleKeyDown(event) {
    const text = event.target.value.trim();
    if (event.code === "Enter" && text) {
      createTask(text)
      setInput("")
    }
  }

  function removeTask(taskIndex) {
    fetch(`https://playground.4geeks.com/todo/todos/${taskIndex}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          setList([...list.filter((item, i) => item.id !== taskIndex)]);
          getTasks();
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className='container d-flex flex-column gap-4 justify-content-center p-4'>
      <input className='form-control mb-2' type="text" onKeyDown={handleKeyDown} value={input} onChange={(e) => setInput(event.target.value)} />
      {
        list.length > 0 ? (
          <ul className='list-group'>
            {
              list.map((item, index) => (
                <li className='list-group-item list-group-item-action d-flex justify-content-between align-items-center' key={item.id}>{item.label}<button className='btn btn-danger' onClick={() => removeTask(item.id)}><i className='fas fa-trash text-white'></i></button></li>
              ))
            }
          </ul>
        ) : (
          <div className='alert alert-primary text-center'>
            <i className='fas fa-info-circle'></i> Aún no hay ninguna tarea agregada, agrega alguna.
          </div>
        )
      }

    </div>
  )
}

export default TodoList