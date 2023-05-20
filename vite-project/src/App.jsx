import { Button, Stack } from '@chakra-ui/react'
import Hero from './components/Hero';
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
    <Hero></Hero>
</div>

  )
}

export default App
