// src/calculator.js
import React, { useState } from 'react';
import './calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
    setResult('');
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
    setResult('');
  };

  const handleEqual = () => {
    try {
      const evalResult = eval(input);
      setResult(evalResult);
    } catch (error) {
      setResult('Error');
    }
  };

  const operatorButtons = ['/', '*', '+', '-', 'DEL'];
  const numberButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '0', '.', '='
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="result">{result !== '' ? `(${result})` : ''}</div>
        <div className="input">{input || 0}</div>
      </div>

      <div className="top-row">
        {operatorButtons.map((btn, i) => (
          <button
            key={i}
            className={`btn operator ${btn === 'DEL' ? 'del' : ''}`}
            onClick={() => (btn === 'DEL' ? handleDelete() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="grid">
        {numberButtons.map((btn, i) => (
          <button
            key={i}
            className="btn"
            onClick={() => (btn === '=' ? handleEqual() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
