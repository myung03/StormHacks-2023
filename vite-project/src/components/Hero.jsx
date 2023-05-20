import React from 'react'
import { Button, Stack } from '@chakra-ui/react'
import '../App.css';

const Hero = () => {
  return (
    <div>
    <h1 class='font-extrabold leading-[3.25rem] text-4xl text-center'>
        Tired of long and confusing slides? <br></br>
        <span className='gradient'>Create your personalized lesson today.</span>
    </h1>
    <form>
        <label>Submit a PDF of your lecture</label>
    <input type='file' accept='.pdf' ></input>
    <Button></Button>
    </form>
    </div>
    
  )
}

export default Hero