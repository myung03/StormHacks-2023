import React, { useState, useEffect } from 'react';
import { Button, Heading, Text } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
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
  const [showSubsection, setShowSubsection] = useState(false);
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
      setChatHistory((prevHistory) => [...prevHistory, userMessage]);
  
      // Display "thinking" message while waiting for response
      const thinkingMessage = {
        user: 'Teacher',
        message: 'Thinking...',
        type: 'bot-message',
      };
      setChatHistory((prevHistory) => [...prevHistory, thinkingMessage]);
  
      try {
        // Generate response from the model
        const botMessage = await createChatMessage(inputText, text); // Pass the `text` parameter here
        const responseMessage = {
          user: 'Teacher',
          message: botMessage,
          type: 'bot-message',
        };
        setChatHistory((prevHistory) => [
          ...prevHistory.filter((msg) => msg !== thinkingMessage),
          responseMessage,
        ]);
      } catch (error) {
        // Handle error if API call fails
        console.error('Failed to create chat message:', error);
      }
  
      setInputText('');
    }
  };

  const toggleSubsection = () => {
    setShowSubsection(!showSubsection);
  };

  const handleNext = () => {
    handleNextSection();
    setShowSubsection(false);
    setShowNextSection(false);
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');

    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="section">
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
      {showSubsection && (
        <div className="chat-container" id="chat-container">
        <Button
          className="collapse-button"
          onClick={toggleSubsection}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <ChevronUpIcon />
        </Button>
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <span className="user">{message.user}:</span> {message.message}
            </div>
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
    )}
    <div className="button-container">
      {!showSubsection && (
        <Button onClick={toggleSubsection}>Ask a Question</Button>
      )}
      {showNextSection && <Button onClick={handleNext}>Next Section</Button>}
    </div>
  </div>
);
}

export default Sec;