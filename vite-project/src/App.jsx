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
  const componentRefs = useRef([]);



  useEffect(() => {
    fetch('http://localhost:5174/generatedlessoncontent.txt')
      .then(response => response.text())
      .then(data => {
        const splitData = data.split('<?!>');
        splitData.push("## You completed this **Lesson**")
        setSections(splitData);
      })
      .catch(err => console.error(err));
  }, []);

    
  const onButtonClick = () => {
    inputFile.current.click();
  };



  const handleNextSection = () => {
    setCurrentSection(currentSection + 1);
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
              splitData.push("## You completed this **Lesson**")
              setSections(splitData);
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

  //sets language for lesson to be in
  const onLanguageChange = (str) => {
    setLanguage(str);

    // Make a POST request to update the language on the server
    fetch('http://localhost:5174/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: str }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Optional: handle the response from the server

        // Fetch the new lesson content file
        fetch(`http://localhost:5174/generatedlessoncontent${str}.txt`)
          .then(response => response.text())
          .then(data => {
            const splitData = data.split('<?!>');
            splitData.push("## You completed this **Lesson**");
            setSections(splitData);
          })
          .catch(err => console.error(err));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

  {isLoading ? (
    <div className="loading-screen-container">
      <div className="loading-screen">
        <Spinner className="loading-spinner" size="xl" />
        <p className="loading-message">Loading...</p>
      </div>
    </div>
  ) : (
    <>
      {sections.slice(0, currentSection).map((section, index) => (
        <Sec
          key={index}
          text={section}
          handleNextSection={handleNextSection}
          lastSection={false}
        />
      ))}
      {currentSection === sections.length - 1 ? (
        <Sec
          key={sections.length}
          text="You completed the lesson!"
          handleNextSection={handleNextSection}
          lastSection={true}
        />
      ) : (
        <Sec
          key={currentSection}
          text={sections[currentSection]}
          handleNextSection={handleNextSection}
          lastSection={false}
        />
      )}
    </>
  )}

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClearFile = (event) => {
    event.stopPropagation();
    setSelectedFile(null);
    if (inputFile && inputFile.current) {
        inputFile.current.value = '';
    }
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
      <p>NeuralProf will provide a lesson in English.</p>
    </TabPanel>
    <TabPanel>
      <p>donnera une leçon en français.</p>

    </TabPanel>
    <TabPanel>
      <p>会用中文上课。</p>

    </TabPanel>
    <TabPanel>
      <p>wird eine Unterrichtsstunde auf Deutsch geben.</p>

    </TabPanel>
    <TabPanel>
      <p>先生が日本語でレッスンを行います。</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        <div className="content">
          <div className="content__container">
          <h1 className='content__container__text font-extrabold leading-[3.25rem] text-4xl text-center'>
            Tired of
            </h1> 
            <ul className="content__container__list">
              <li className="content__container__list__item">long and confusing slides?</li>
              <li className="content__container__list__item">unengaging lectures?</li>
              <li className="content__container__list__item">dense and boring readings?</li>
              </ul>
          </div>
          <h1 className='gradient font-extrabold leading-[3.25rem] text-4xl text-center pb-[5%]'>Create your personalized lesson today.</h1>
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

        {isLoading ? (
  <div className="loading-screen-container">
    <div className="loading-screen">
      <Spinner className="loading-spinner" size="xl" />
      <p className="loading-message">Loading...</p>
    </div>
  </div>
) : (
  sections.slice(0, currentSection + 1).map((section, index) => (
    <Sec
      key={index}
      text={section}
      lastSection={index === sections.length - 2}
      conclusion={index === sections.length - 1}
      handleNextSection={handleNextSection}
    />
  ))
)}
      </Stack>
    </div>
  );
}

export default App;