import axios from 'axios';

// Function to communicate with the OpenAI API for text generation
export async function createChatMessage(inputText, text) {
  try {
    // Display initial "thinking" indicator
    let thinkingIndicator = 'Thinking...';
    console.log(thinkingIndicator);

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      messages: [
        { role: 'system', content: "you are a teacher that is teaching topic about. Answer concisely and assume questions are refering to the text chunk the user provides you unless the information is not in the text chunk. Talk in the language of the text chunk"},
        { role: 'user', content: text },
        { role: 'user', content: inputText },
        { role: 'user', content: "give your answer in the language of the text chunk" }],
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