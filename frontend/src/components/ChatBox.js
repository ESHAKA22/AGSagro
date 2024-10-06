import React, { useState } from 'react';
import './ChatBox.css'; // Keep this unless you rename the CSS file

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      const replyMessage = generateReply(input);

      setMessages([...messages, userMessage, replyMessage]);
      setInput('');
    }
  };

  const generateReply = (question) => {
    let replyText = 'Sorry, I did not understand that. Please ask about treatments.';

    const lowerCaseQuestion = question.toLowerCase();

    if (lowerCaseQuestion.includes('hi') || lowerCaseQuestion.includes('hey') || lowerCaseQuestion.includes('hello')) {
        replyText = 'Hello! How can I help you?';
    } else if (lowerCaseQuestion.includes('thank you') || lowerCaseQuestion.includes('thanks')) {
        replyText = 'You’re welcome!';
    } else if (lowerCaseQuestion.includes('ok')) {
        replyText = 'Okay. Have a nice day!';
    } else if (lowerCaseQuestion.includes('bye')) {
        replyText = 'Bye and have a nice day!';
    } else if (lowerCaseQuestion.includes('treatment')) {
        replyText = 'We offer a variety of Ayurvedic treatments. Please visit our Treatments page for more information.';
    } else if (lowerCaseQuestion.includes('appointment')) {
        replyText = 'You can request an appointment directly from our website. Just click the "Request an Appointment" button.';
    } else if (lowerCaseQuestion.includes('contact')) {
        replyText = 'You can contact us at 0777471333 or email us at support@wellnessayurvedahospital.com.';
    } else if (lowerCaseQuestion.includes('hours')) {
        replyText = 'Our hospital is open from 8 AM to 8 PM, Monday to Saturday.';
    } else if (lowerCaseQuestion.includes('location')) {
        replyText = 'We are located at 123 Ayurvedic Lane, Wellness City.';
    } else if (lowerCaseQuestion.includes('doctors')) {
        replyText = 'We have a team of experienced Ayurvedic doctors. You can choose your preferred doctor when booking an appointment.';
    } else if (lowerCaseQuestion.includes('insurance')) {
        replyText = 'Please check with your insurance provider to see if they cover our treatments.';
    } else if (lowerCaseQuestion.includes('cost')) {
        replyText = 'The cost of treatment varies. Please visit our Pricing page or contact us for more details.';
    }

    return { sender: 'bot', text: replyText };
  };

  return (
    <div className={`chatbox-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbox-toggle" onClick={toggleChatbox}>
        {isOpen ? 'Close Chat' : 'Chat with Us'}
      </button>
      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbox-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input 
              type="text" 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
