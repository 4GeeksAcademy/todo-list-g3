import React, { useEffect, useRef, useState } from "react";

function TodoList() {
  const [input, setInput] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [updateLabel, setUpdateLabel] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  function createUser() {
    fetch("https://playground.4geeks.com/todo/users/fernando_gimeno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }

  function getTasks() {
    fetch("https://playground.4geeks.com/todo/users/fernando_gimeno")
      .then((response) => {
        if (response.status === 404) {
          createUser();
        }
        return response.json();
      })
      .then((data) => setList(data.todos))
      .catch((error) => console.log(error));
  }

  function createTask(task) {
    const newTask = {
      label: task,
      is_done: false,
    };

    fetch("https://playground.4geeks.com/todo/todos/fernando_gimeno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setList([...list, data]);
      })
      .catch((error) => console.log(error));
  }

  function handleKeyDown(event) {
    const text = event.target.value.trim();
    if (event.code === "Enter" && text) {
      createTask(text);
      setInput("");
    }
  }

  function removeTask(taskIndex) {
    fetch(`https://playground.4geeks.com/todo/todos/${taskIndex}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 404) {
          return alert("El ID de la tarea no existe");
        }
        setList(list.filter((item, i) => item.id !== taskIndex));
      })
      .catch((error) => console.log(error));
  }

  function updateTask(taskIndex, updatedLabel) {
    const updatedTask = {
      label: updatedLabel,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${taskIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("No se pudo actualizar la tarea");
        }
      })
      .then((data) => {
        setList(list.map((item) => (item.id === taskIndex ? data : item)));
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="container d-flex flex-column gap-4 justify-content-center p-4">
      <h1 className="text-center">Todo List</h1>
      <input
        className="form-control mb-2"
        type="text"
        onKeyDown={handleKeyDown}
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      {list.length > 0 ? (
        <>
          <ul className="list-group shadow-sm">
            {list.map((item, index) => (
              <li
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                key={item.id}
                onClick={() => {
                  setUpdateLabel(item.label);
                  setUpdateId(item.id);
                }}
              >
                {updateId === item.id ? (
                  <input
                    className="form-control me-3"
                    type="text"
                    value={updateLabel}
                    onChange={(e) => setUpdateLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.code === "Enter" && updateLabel.trim()) {
                        updateTask(item.id, updateLabel);
                        setUpdateId(null);
                      }
                    }}
                    onBlur={() => setUpdateId(null)}
                  />
                ) : (
                  `${index + 1}. ${item.label}`
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeTask(item.id)}
                >
                  <i className="fas fa-trash text-white"></i>
                </button>
              </li>
            ))}
          </ul>
          <span className="badge text-bg-secondary">{list.length} items</span>
        </>
      ) : (
        <div className="alert alert-primary text-center">
          <i className="fas fa-info-circle"></i> Aún no hay ninguna tarea
          agregada, agrega alguna.
        </div>
      )}
    </div>
  );
}

export default TodoList;
