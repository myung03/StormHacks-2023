import { Button, Stack } from '@chakra-ui/react'
import Hero from './components/Hero';
import React, { useEffect, useState } from 'react';
import Sec from './components/Sec';
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

  return (
    <div className='main'>
    <Hero></Hero>
    {sections.map((section, index) => 
      <Sec key={index} text={section} />)}
    </div>

  )
}

export default App
