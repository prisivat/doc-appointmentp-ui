import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';  // Import CSS for styles
import chatbot from '../assets/chatbot.png';

const Chatbot = () => {
    const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const Loader = () => (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5em',
          color: '#333',
          zIndex: 1
        }}>
          Loading...
        </div>
      );

    // Handle user input change
    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    // Hardcoded greetings and responses
    const getGreetingResponse = (input: string) => {
        const greetings = ['hi', 'hello', 'hey', ];
        const end = ['thanks', 'thank you'];
        const userMessage = input.toLowerCase().trim();
        setIsLoading(true)
        if (greetings.includes(userMessage)) {
            return "Hi, how can I help you?";
        } else if(end.includes(userMessage)){
            return "Welcome!";
        } else if("good morning".includes(userMessage)){
            return "Good morning! How can I assist you?";
        } else if("good morning".includes(userMessage)){
            return "Good morning! How can I assist you?";
        } else if("good evening".includes(userMessage)){
            return "Good Evening! How can I assist you?";
        }  else if("goodbye".includes(userMessage)){
            return "Goodbye! Have a great day!";
        }  else if("see you later".includes(userMessage)){
            return "Take care! See you next time.";
        } else if("i'm having high temperature and tiredness".includes(userMessage)){
            return "Fever.";
        } 
        return null;  // No greeting, so return null for further processing
    };

    // Send message to the backend and update the chat
    const sendMessage = async () => {
        if (userInput.trim()) {
            // Check for greetings first
            const greetingResponse = getGreetingResponse(userInput);
            if (greetingResponse) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'user', message: userInput },
                    { sender: 'bot', message: greetingResponse },
                ]);
                setIsLoading(false)
            } else {
                // If no greeting, send the message to the backend
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'user', message: userInput },
                ]);

                try {
                    const response = await axios.post('http://127.0.0.1:5000/ask', {
                        query: userInput
                    });
                    if(response.data.answer){
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { sender: 'bot', message: response.data.answer },
                        ]); 
                        setIsLoading(false)
                    } else{
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: 'bot', message: "Something Went Wrong, Please try again later!"},
                    ]);
                    setIsLoading(false)
                }
                } catch (error) {
                    setIsLoading(false)
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: 'bot', message: "Something Went Wrong, Please try again later!"},
                    ]);
                    console.error("Error sending message", error);
                }
            }

            setUserInput('');
        }
    };

    // Toggle chat window visibility
    const toggleChatWindow = () => {
        setIsChatOpen(prevState => !prevState);
    };

    // Handle key press event to trigger send on Enter key
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default behavior of the Enter key (e.g., new line)
            sendMessage();
        }
    };

    return (
        <div>
            {isLoading ? <><div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)', // Adds a white overlay
        backdropFilter: 'blur(10px)', // Adjust the blur intensity
        zIndex: 1,
      }}></div><Loader /> </> : <div> 
            {/* Floating chatbot icon */}
            <div className="chat-icon" onClick={toggleChatWindow}>
                <img src={chatbot} alt="Chat Icon" />
            </div>

            {/* Chat window */}
            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>Chatbot</h4>
                        <button onClick={toggleChatWindow}>x</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender}>
                                <span style={{color: "black"}}>{msg.sender === 'user' ? 'You' : 'Bot'}: </span>
                                  {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleUserInputChange}
                            onKeyDown={handleKeyPress}  // Listen for key press
                            placeholder="Type a message"
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
            </div>}
        </div>
        
    );
    
};

export default Chatbot;
