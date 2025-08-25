import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => prev - 1);
  const handleReset = () => setCount(0);
  const handleIncrement5 = () => setCount(prev => prev + 5);

  return (
    <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Count: {count}</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleReset}>Reset</button>{' '}
        <button onClick={handleIncrement}>Increment</button>{' '}
        <button onClick={handleDecrement}>Decrement</button>{' '}
        <button onClick={handleIncrement5}>Incremen 5</button>
      </div>t

      <h1><b>Welcome to CHARUSAT!!!</b></h1>

      <div style={{ marginBottom: '10px' }}>
        <label>First Name: </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Last Name: </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <h3>First Name: {firstName}</h3>
      <h3>Last Name: {lastName}</h3>
    </div>
  );
}

export default App;