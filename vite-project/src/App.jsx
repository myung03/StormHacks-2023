import { Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Sec from './components/Sec';
import Stack from './components/Stack';
import './App.css'

function App() {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);  // Added this line

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

  const FileUpload = (event) => {
    const file = event.target.files[0];
    // Do something with the selected file (e.g., send it to the server, process it, etc.)
  }

  return (
    <div className='main'>
      <Stack>
        <div>
          <h1 className='font-extrabold leading-[3.25rem] text-4xl text-center'>
            Tired of long and confusing slides? <br></br>
            <span className='gradient'>Create your personalized lesson today.</span>
          </h1>
        </div>
        <form>
          <label htmlFor='file'>Submit a PDF of your lecture</label>
          <input type='file' accept='.pdf' onChange={FileUpload}></input>
          <Button className='cursor-pointer'>Submit</Button>
        </form>

        {sections.slice(0, currentSection + 1).map((section, index) => 
          <Sec key={index} text={section} handleNextSection={handleNextSection} />)} 
      </Stack>
    </div>
  )
}

export default App;