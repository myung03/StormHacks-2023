import { Button } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react';
import Sec from './components/Sec';
import Stack from './components/Stack';
import './App.css'

function App() {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);  // Added this line
  const [selectedFile, setSelectedFile] = useState(null);
  const inputFile = useRef(null);
  useEffect(() => {
    // Using fetch to get the data from your server/file.
    fetch('http://localhost:5173/lessoncontentgeneration/generatedlessoncontent.txt')
      .then(response => response.text())
      .then(data => {
        const splitData = data.split('<?!>');
        setSections(splitData.slice(0, -1));
      })
      .catch(err => console.error(err));
  }, []);

  const handleNextSection = () => {
    setCurrentSection(currentSection + 1);
  }

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

    const handleFileUpload = (file) => {
    setSelectedFile(file);
    // Do something with the selected file (e.g., send it to the server, process it, etc.)
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  const handleClearFile = (event) => {
     event.preventDefault(); // Prevent the default button behavior
    setSelectedFile(null);
  };


  return (
    <div className='main'>
      <Stack>
        <div>
          <h1 className='font-extrabold leading-[3.25rem] text-4xl text-center pb-10'>
            Tired of long and confusing slides? <br></br>
            <span className='gradient'>Create your personalized lesson today.</span>
          </h1>
          </div>

          <div className="file-upload">
      <div
        className={`file-drop-area ${selectedFile ? 'file-drop-area-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={inputFile}
        onClick={onButtonClick}
      >
        {selectedFile ? (
          <div>
            <h3>{selectedFile.name}</h3>
            <button className="clear-file-button" onClick={handleClearFile}>
              Clear File
            </button>
          </div>
        ) : (
          <p>Drag and drop a PDF file here.</p>
        )}
      </div>
      <input
        type="file"
        accept=".pdf"
        ref={inputFile}
        onChange={(event) => handleFileUpload(event.target.files[0])}
        className='hidden p-[50px]'
      />
    </div>

        {sections.slice(0, currentSection + 1).map((section, index) => 
          <Sec key={index} text={section} handleNextSection={handleNextSection} />)} 
      </Stack>
    </div>
  );
}

export default App;