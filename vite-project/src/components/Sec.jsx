// Sec.jsx
import React from 'react';
import './Sec.css'

function Sec({ text }) {
  return (
    <div className="section">
      <h2>{text}</h2>
    </div>
  );
}

export default Sec;