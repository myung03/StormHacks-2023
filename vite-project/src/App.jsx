import { Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Sec from './components/Sec';
import Stack from './components/Stack';
import './App.css'


function App() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Using fetch to get the data from your server/file.
    fetch('http://localhost:5173/lessoncontentgeneration/generatedlessoncontent.txt')  // adjust this URL to match your server
      .then(response => response.text())  // read the response as text
      .then(data => {
        const splitData = data.split('<?!>');
        setSections(splitData);
      })
      .catch(err => console.error(err));
  }, []);

  const FileUpload = () => {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      // Do something with the selected file (e.g., send it to the server, process it, etc.)
    };
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
          <button className='cursor-pointer'>Submit</button>
        </form>

      {sections.map((section, index) => 
        <Sec key={index} text={section} />)}
      </Stack>

    </div>

  )
}

export default App
