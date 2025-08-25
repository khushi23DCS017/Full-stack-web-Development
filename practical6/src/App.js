import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    if (!input.trim()) return;

    if (editId !== null) {
      setTasks(tasks.map((task, idx) => (
        idx === editId ? input : task
      )));
      setEditId(null);
    } else {
      setTasks([...tasks, input]);
    }
    setInput('');
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setInput(tasks[index]);
    setEditId(index);
  };

  return (
    <div className="container">
      <h1>Get Things Done !</h1>
      <div className="input-area">
        <input
          type="text"
          placeholder="What is the task today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>
          {editId !== null ? 'Update' : 'Add Task'}
        </button>
      </div>

      {tasks.map((task, index) => (
        <div className="task" key={index}>
          <span>{task}</span>
          <div>
            <button onClick={() => handleEdit(index)}>✏</button>
            <button onClick={() => handleDelete(index)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;