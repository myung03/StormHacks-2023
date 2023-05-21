import React, { useState, useEffect } from 'react';
import { Button, Heading, Text, useDisclosure, SlideFade } from '@chakra-ui/react';
import { CheckIcon, Search2Icon, QuestionIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import './Sec.css';
import { createChatMessage } from '../utils/api';

const CustomParagraph = ({ children }) => (
  <Text as="p" marginBottom="20px">
    {children}
  </Text>
);

const CustomHeading = ({ level, children }) => {
  const headingSizes = ['xl', 'lg', 'md', 'sm', 'xs'];
  const size = headingSizes[Math.min(level - 1, headingSizes.length - 1)];

  return (
    <Heading as={`h${level}`} size={size} marginBottom="20px">
      {children}
    </Heading>
  );
};

const CustomStrong = ({ children }) => <Text as="strong">{children}</Text>;

function Sec({ text, handleNextSection }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showNextSection, setShowNextSection] = useState(true);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (inputText) {
      const userMessage = {
        user: 'User',
        message: inputText,
        type: 'user-message',
      };
  
      const updatedHistory = [...chatHistory, userMessage];
      setChatHistory(updatedHistory);
  
      const thinkingMessage = {
        user: 'Teacher',
        message: 'Thinking...',
        type: 'bot-message',
      };
  
      const updatedHistoryWithThinkingMessage = [...updatedHistory, thinkingMessage];
      setChatHistory(updatedHistoryWithThinkingMessage);
  
      try {
        const botMessage = await createChatMessage(inputText, text, chatHistory);
        const responseMessage = {
          user: 'Teacher',
          message: botMessage,
          type: 'bot-message',
        };
  
        const updatedHistoryWithResponse = [...updatedHistoryWithThinkingMessage.filter((msg) => msg !== thinkingMessage), responseMessage];
        setChatHistory(updatedHistoryWithResponse);
      } catch (error) {
        console.error('Failed to create chat message:', error);
      }
  
      setInputText('');
    }
  };
  
  const handleRequestQuiz = async () => {
    const userMessage = {
      user: 'User',
      message: "Quiz Please!",
      type: 'user-quiz-message',
    };
  
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
  
    const thinkingMessage = {
      user: 'Teacher',
      message: 'Creating Quiz...',
      type: 'bot-quiz-message',
    };
  
    const updatedHistoryWithThinkingMessage = [...updatedHistory, thinkingMessage];
    setChatHistory(updatedHistoryWithThinkingMessage);
  
    try {
      const botMessage = await createChatMessage("Give me a 1 question multiple choice quiz, with no answer and ask the user for their answer, put the options in bullet points on the above topic and write the quiz in raw mdx code and use bold and headers.", text, chatHistory);
      const responseMessage = {
        user: 'Teacher',
        message: botMessage,
        type: 'bot-quiz-message',
      };
  
      const updatedHistoryWithResponse = [...updatedHistoryWithThinkingMessage.filter((msg) => msg !== thinkingMessage), responseMessage];
      setChatHistory(updatedHistoryWithResponse);
    } catch (error) {
      // Handle error if API call fails
      console.error('Failed to create chat message:', error);
    }
  };


  const handleNext = () => {
    handleNextSection();
    setShowNextSection(false);

  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');

    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  const { isOpen, onToggle } = useDisclosure()

  return (
    <div className="section sidebar">
      <div className="instruction">
        <ReactMarkdown
          plugins={[gfm]}
          components={{
            p: CustomParagraph,
            h1: (props) => <CustomHeading level={1} {...props} />,
            h2: (props) => <CustomHeading level={2} {...props} />,
            h3: (props) => <CustomHeading level={3} {...props} />,
            strong: CustomStrong,
            // Add more custom components for other elements as needed
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
      <div className="button-container">
        <Button leftIcon={<Search2Icon />}colorScheme='yellow' onClick={onToggle}>Ask a Question</Button>
      {showNextSection && <Button rightIcon={<CheckIcon/>}colorScheme='green' onClick={handleNext} className='ml-[20px] pr-7 text-center'>Next Section</Button>}
    </div>
      {onToggle && (
        <SlideFade  className="chat-container glassmorphism w-[50%]" in={isOpen} animateOpacity>
        <div id="chat-container">
          <h4 className='pb-5'>Still confused? <strong>Feel free to ask!</strong></h4>
          <Button rightIcon={<QuestionIcon/>} className='mb-10'colorScheme='yellow' onClick={handleRequestQuiz}>Quiz Me!</Button>
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <ReactMarkdown
              key={index}
              className={`message ${message.type}`}
              children={`**${message.user}:** ${message.message}`}
              plugins={[gfm]}
              components={{
                p: CustomParagraph,
                h1: (props) => <CustomHeading level={1} {...props} />,
                h2: (props) => <CustomHeading level={2} {...props} />,
                h3: (props) => <CustomHeading level={3} {...props} />,
                strong: CustomStrong,
              }}
            />

          ))}
        </div>
        <div className="chat-input">
          <textarea
            placeholder="Input text here..."
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
      </SlideFade>
    )}
  </div>
);
}

export default Sec;