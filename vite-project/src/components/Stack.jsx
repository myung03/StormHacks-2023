import React from 'react';
import './Stack.css'

function Stack({ children }) {
  return (
    <div className="stack">
      {React.Children.map(children, (child, i) => (
        <div className="stack-item" key={i}>
          {child}
        </div>
      ))}
    </div>
  );
}

export default Stack;