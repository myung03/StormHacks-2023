import axios from 'axios';

// Function to communicate with the OpenAI API for text generation
export async function createChatMessage(inputText, text, chatHistory) {
  try {
    // Display initial "thinking" indicator
    let thinkingIndicator = 'Thinking...';
    console.log(thinkingIndicator);



    let messagesForApi = [
      { 
        role: 'system', 
        content: "You are a teacher for guiding students through interactive lessons. You format your responses in markdown for readability. Use lots of ** boldword **" + text + ". Don't mention the fact that I asked you for markdown code" 
      },
      { 
        role: 'system', 
        content: "Before you give a quiz you must say: Sure! Here's a quiz" 
      },
      { 
        role: 'system', 
        content: "For quizzes, Don't tell the user anything about markdown, get the user to choose a, b, c, ...  Say: Please type your answer below:" 
      },
      
      
      { 
        role: 'user', 
        content: "The info is " + text + " give your responses in the language of the text chunk" 
      }
    ];
    
    const lastThreeMessages = chatHistory.slice(Math.max(chatHistory.length - 3, 0));
    
    messagesForApi = messagesForApi.concat(lastThreeMessages.map(msg => {
      return {
        role: msg.user === 'User' ? 'user' : 'assistant',
        content: msg.message
      }
    }));

    
    // Add the new user message to the messages for API
    messagesForApi.push({ role: 'user', content: inputText });

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      max_tokens: 200,
      messages: messagesForApi,
      temperature: 0.7,
      n: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
    });

    // Remove the "thinking" indicator
    console.clear();

    const generatedMessage = response.data.choices[0].message.content.trim();

    return generatedMessage;
  } catch (error) {
    console.error('Error generating message:', error);
    // Handle error
    return 'Error generating message';
  }
}


