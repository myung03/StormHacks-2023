import { Button } from '@chakra-ui/react'
import './App.css'

function App() {

  const FileUpload = () => {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      // Do something with the selected file (e.g., send it to the server, process it, etc.)
    };
  }

  return (
    <div className='main'>
      <div>
<h1 class='font-extrabold leading-[3.25rem] text-4xl text-center'>
  Tired of long and confusing slides? <br></br>
  <span className='gradient'>Create your personalized lesson today.</span>
</h1>
</div>
<form>
  <label>Submit a PDF of your lecture</label>
<input type='file' accept='.pdf' ></input>
<Button></Button>
</form>  
</div>

  )
}

export default App
