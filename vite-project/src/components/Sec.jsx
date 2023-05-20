import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import './Sec.css'

function Sec({ text, handleNextSection }) {
  const [showSubsection, setShowSubsection] = useState(false);

  const handleButtonClick = () => {
    setShowSubsection(true);
  };

  return (
    <div className="section">
      <div className="instruction">
      <h2>{text}</h2>
      </div>
      <div className="button-container">
        <Button onClick={handleButtonClick}>Add Subsection</Button>
        <Button onClick={handleNextSection}>Next Section</Button>
      </div>
      {showSubsection && 
        <div className="subsection">
          <textarea placeholder="Input text here..."></textarea>
        </div>
      }
    </div>
  );
}

export default Sec;