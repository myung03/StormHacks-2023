import React from 'react';
import './Stack.css'

function Stack({ children }) {
  return (
    <div className="stack">
      {children}
    </div>
  );
}

export default Stack;