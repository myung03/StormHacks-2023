import { Button, Spinner } from '@chakra-ui/react';
import { CloseIcon, DownloadIcon, EditIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useRef } from 'react';
import Sec from './components/Sec';
import Stack from './components/Stack';
import './App.css';

function App() {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state
  const inputFile = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5174/generatedlessoncontent.txt')
      .then(response => response.text())
      .then(data => {
        const splitData = data.split('<?!>');
        setSections(splitData.slice(0, -1));
      })
      .catch(err => console.error(err));
  }, []);

  const handleNextSection = () => {
    setCurrentSection(currentSection + 1);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (file) => {
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type === 'application/pdf') {
      handleFileUpload(file);
    } else {
      console.error('File is not a PDF');
    }
  };

  const handleProcessFile = () => {
    event.stopPropagation();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setIsLoading(true); // Set isLoading to true

      fetch('http://localhost:5174/uploads', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          fetch('http://localhost:5174/generatedlessoncontent.txt')
            .then(response => response.text())
            .then(data => {
              const splitData = data.split('<?!>');
              setSections(splitData.slice(0, -1));
              setIsLoading(false); // Set isLoading to false after data is updated
            })
            .catch(err => console.error(err));
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false); // Set isLoading to false in case of error
        });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClearFile = (event) => {
    event.preventDefault();
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
          >
            <p>Drag and drop a PDF file here, or <span className="file-upload-prompt">click to select a file</span>.</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(event) => handleFileUpload(event.target.files[0])}
              className='input-file'
              disabled={isLoading}
            />
            {selectedFile ? (
              <div className='mt-5 font-medium'>
                <h3>{selectedFile.name}</h3>
                <div className="mt-5 ml-3 flex gap-[20px] items-center justify-center">
                <Button
  leftIcon={<CloseIcon />}
  onClick={handleClearFile}
  colorScheme='twitter'
  isDisabled={isLoading}
>
  Clear File
</Button>

<Button
  rightIcon={<EditIcon />}
  onClick={handleProcessFile}
  colorScheme='facebook'
  isDisabled={isLoading || !selectedFile}
>
  Process File
</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {isLoading ? ( // Show loading screen if isLoading is true
          <div className="loading-screen">
            <Spinner size="xl" />
            <p>Loading...</p>
          </div>
        ) : (
          sections.slice(0, currentSection + 1).map((section, index) => (
            <Sec key={index} text={section} handleNextSection={handleNextSection} />
          ))
        )}
      </Stack>
    </div>
  );
}

export default App;