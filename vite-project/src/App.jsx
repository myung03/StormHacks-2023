import { Button, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import React, { useEffect, useState, useRef } from 'react';
import Sec from './components/Sec';
import Stack from './components/Stack';
import './App.css';

function App() {
  const [sections, setSections] = useState([]);
  const [language, setLanguage] = useState('English');
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

  //sets language for lesson to be in
  const onLanguageChange = (str) => {
    setLanguage(str);
  }
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
      <Tabs className='mt-[-60px] my-[60px]'>
  <TabList>
    <Tab onClick={() => onLanguageChange('English')}>English {getUnicodeFlagIcon('CA')}</Tab>
    <Tab onClick={() => onLanguageChange('French')}>Français {getUnicodeFlagIcon('FR')}</Tab>
    <Tab onClick={() => onLanguageChange('Mandarin')}>中文 {getUnicodeFlagIcon('CN')}</Tab>
    <Tab onClick={() => onLanguageChange('German')}>Deutsch {getUnicodeFlagIcon('DE')}</Tab>
    <Tab onClick={() => onLanguageChange('Japanese')}>日本 {getUnicodeFlagIcon('JP')}</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
      <p>Placeholder Name will provide a lesson in English.</p>
    </TabPanel>
    <TabPanel>
      <p>Placeholder Name donnera une leçon en français.</p>

    </TabPanel>
    <TabPanel>
      <p>Placeholder Name 会用中文上课。</p>

    </TabPanel>
    <TabPanel>
      <p>Placeholder Name wird eine Unterrichtsstunde auf Deutsch geben.</p>

    </TabPanel>
    <TabPanel>
      <p>先生が日本語でレッスンを行います。</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        <div>
          <h1 className='font-extrabold leading-[3.25rem] text-4xl text-center pb-[5%]'>
            Tired of long and confusing slides? <br></br>
            <span className='gradient'>Create your personalized lesson today.</span>
          </h1>
        </div>

        <div className="pb-10 file-upload">
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
        <div className="loading-screen-container">
          <div className="loading-screen">
            <Spinner className="loading-spinner" size="xl" />
            <p className="loading-message">Loading...</p>
          </div>
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