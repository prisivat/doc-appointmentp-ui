import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Chatbot.css';  // Import CSS for styles
import chatbot from '../assets/chatbot.png';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { hospitalDetails } from '../userSlice';
import Model from './Model';



const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<any>("11-11-2024")
  const userName = useSelector((state: RootState) => state.user.userName);
  const [localHospitalDetails, setLocalHospitalDetails] = useState([]);
  const [showButton, setShowButton] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [appBody, setAppBody] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();


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

  const checkMatch = (text:any, words:any) => {
    const wordArray = words.split(" ");
    return wordArray.some((word:any) => new RegExp(`\\b${word}\\b`, 'i').test(text));
  };

  // Hardcoded greetings and responses
  const getGreetingResponse = (input: string) => {
    const greetings = ['hi', 'hello', 'hey',];
    const end = ['thanks', 'thank you'];
    const userMessage = input.toLowerCase().trim();
    setIsLoading(true)
    if (checkMatch(greetings,userMessage)) {
      return "Hi, how can I help you?";
    } else if (checkMatch(end,userMessage)) {
      return "Welcome!";
    } else if (checkMatch("good morning",userMessage)) {
      return "Good morning! How can I assist you?";
    } else if (checkMatch("good morning",userMessage)) {
      return "Good morning! How can I assist you?";
    } else if (checkMatch("good evening",userMessage)) {
      return "Good Evening! How can I assist you?";
    } else if (checkMatch("goodbye",userMessage)) {
      return "Goodbye! Have a great day!";
    } else if (checkMatch("see you later",userMessage)) {
      return "Take care! See you next time.";
    } else if (checkMatch("high temperature and tiredness",userMessage)) {
      return "you may have Fever.";
    } else if (checkMatch("sore throat and cough",userMessage)) {
      return "you may have a Common Cold.";
    }
    else if (checkMatch("chest pain and shortness of breath",userMessage)) {
      return "you may have a Heart-related issue. Please consult a doctor immediately.";
    }
    else if (checkMatch("nauseous and stomach pain",userMessage)) {
      return "you may have a Stomach Infection.";
    }
    else if (checkMatch(" headache and sensitivity to light",userMessage)) {
      return "you may have a Migraine.";
    }
    else if (checkMatch("i'm feeling a lump in my throat and difficulty swallowing",userMessage)) {
      return "you may have a Throat Infection.";
    }
    else if (checkMatch("i'm having skin rashes and itching",userMessage)) {
      return "you may have an Allergic Reaction.";
    }
    else if (checkMatch("i'm experiencing joint pain and swelling",userMessage)) {
      return "you may have Arthritis.";
    }
    else if (checkMatch("i'm feeling extremely thirsty and urinating frequently",userMessage)) {
      return "you may have Diabetes Symptoms.";
    }
    else if (checkMatch("i'm feeling dizzy and fainting frequently",userMessage)) {
      return "you may have Low Blood Pressure.";
    }
    else if (checkMatch("i'm experiencing severe back pain and leg numbness",userMessage)) {
      return "you may have a Spine or Nerve issue.";
    } else if (checkMatch("i'm having sneezing and runny nose",userMessage)) {
      return "you may have Allergic Rhinitis or a Common Cold.";
    }
    else if (checkMatch("i'm experiencing severe abdominal pain and diarrhea",userMessage)) {
      return "you may have Food Poisoning or Gastroenteritis.";
    }
    else if (checkMatch(" pounding headache and nausea",userMessage)) {
      return "you may have a Migraine or Dehydration.";
    }
    else if (checkMatch("i'm feeling a burning sensation while urinating",userMessage)) {
      return "you may have a Urinary Tract Infection (UTI).";
    }
    else if (checkMatch("i'm feeling shortness of breath and wheezing",userMessage)) {
      return "you may have Asthma or a Respiratory Issue.";
    }
    else if (checkMatch("i'm having blurry vision and feeling tired",userMessage)) {
      return "you may have Diabetes or an Eye-related issue.";
    }
    else if (checkMatch("i'm feeling extreme fatigue and loss of appetite",userMessage)) {
      return "you may have Anemia or another underlying condition.";
    }
    else if (checkMatch("i'm experiencing swelling in my feet and difficulty breathing",userMessage)) {
      return "you may have a Heart or Kidney Issue.";
    }
    else if (checkMatch("i'm feeling dizziness and frequent headaches",userMessage)) {
      return "you may have High Blood Pressure or Vertigo.";
    }
    else if (checkMatch("i'm having dry eyes and sensitivity to light",userMessage)) {
      return "you may have Dry Eye Syndrome or an Eye Infection.";
    }
    else if (checkMatch("i'm experiencing a persistent dry cough and fatigue",userMessage)) {
      return "you may have Bronchitis or a Respiratory Infection.";
    }
    else if (checkMatch("i'm having persistent pain in my joints",userMessage)) {
      return "you may have Rheumatoid Arthritis or a Joint-related issue.";
    }
    else if (checkMatch("i'm feeling itchy red patches on my skin",userMessage)) {
      return "you may have Eczema or Psoriasis.";
    }
    else if (checkMatch(" fever and a red rash on my body",userMessage)) {
      return "you may have Measles or another Viral Infection.";
    }
    else if (checkMatch("i'm feeling sudden chest tightness and anxiety",userMessage)) {
      return "you may have Panic Attack symptoms or a Heart-related issue. Seek immediate medical attention if severe.";
    }
    else if (checkMatch("i'm experiencing hair loss and brittle nails",userMessage)) {
      return "you may have a Nutritional Deficiency or Thyroid Problem.";
    }
    else if (checkMatch("i'm having frequent nosebleeds and bruising",userMessage)) {
      return "you may have a Blood Disorder or Vitamin Deficiency.";
    }
    else if (checkMatch("i'm experiencing frequent vomiting and abdominal cramps",userMessage)) {
      return "you may have a Stomach Ulcer or Gastrointestinal Problem.";
    }
    else if (checkMatch("i'm feeling numbness in my arms and legs",userMessage)) {
      return "you may have a Nerve-related issue or a Vitamin Deficiency.";
    }
    else if (checkMatch(" fever and swollen lymph nodes",userMessage)) {
      return "you may have an Infection, such as Mononucleosis.";
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
          const response = await axios.post('https://chatbot-1b1xlh7cw-prisivats-projects.vercel.app/ask', {
            query: userInput
          });
          if (response.data.answer) {
            setMessages(prevMessages => [
              ...prevMessages,
              { sender: 'bot', message: response.data.answer },
            ]);
            setIsLoading(false)
          } else {
            setMessages(prevMessages => [
              ...prevMessages,
              { sender: 'bot', message: "Something Went Wrong, Please try again later!" },
            ]);
            setIsLoading(false)
          }
        } catch (error) {
          setIsLoading(false)
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'bot', message: "Something Went Wrong, Please try again later!" },
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

  function getDate(date: any) {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();

    if (month.length === 1) {
      month = "0" + month;
    }

    return date.replace("YEAR", year).replace("MONTH", month);
  }


  useEffect(() => {
    var val = getDate("YEAR-MONTH-24")
    console.log(val, "val")
    setEvent([{ title: "AZUL +5", start: val }])
    const bookingHistory = async () => {
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/appointment/booking-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: (userName),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
        } else {
          setIsLoading(false);
          var val = await response.json()
          console.log(val, "History")
          setLocalHospitalDetails(val)
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    if (userName && userName != "") {
      setIsLoading(true);
      bookingHistory();
    }
  }, [])

  const handleRescheduler = (item: any) => {
    dispatch(hospitalDetails({
      docName: item.docName,
      cost: item.cost,
      hospitalName: item.hospitalName,
      location: item.location,
      specialist: item.specialist,
      bookingId: item.bookingId
    }));
    navigate("/bookAppointment")
  }

  const handleCancelAppointment = async (item: any) => {
    try {
      const body = { bookingId: item.bookingId, patientName: item.patientNam };
      const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/appointment/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);

      } else {
        setIsLoading(false);
        toast.success("Appointment cancelled successfully!")
        navigate("/home")
      }

    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }

  }

  const handleSelectEvent = (item: any) => {
    setOpenModel(true)
    const val = <div><b>Appointment Detail of  {item.patientName}</b><br />Doctor Name: {item.docName}<br /> Patient Gender: {item.gender}
      <br /> Hospital Name: {item.hospitalName} <br /> Location: {item.location} <br /> Phone Number: {item.phoneNumber} <br /> Specialist: {item.specialist}<br />
      <button style={{ padding: "5px", border: "2px #0799c1 solid", borderRadius: "5px", marginRight: "1rem" }} onClick={() => handleRescheduler(item)}>Reschedule Appointment</button>
      <button style={{ padding: "5px", border: "2px #0799c1 solid", borderRadius: "5px" }} onClick={() => handleCancelAppointment(item)}>Cancel Appointment</button></div>
    setAppBody(val)
    // alert(`${item.title}\nage : ${item.age}\nDoctor Name: ${item.docName}\nPatient Gender : ${item.gender}\nHospital Name : ${item.hospitalName}\nLocation : ${item.location}\n
    //   Phone Number : ${item.phoneNumber}\nSpecialist : ${item.specialist}`);
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
        {openModel && (
          <Model title={"Appointment Details"} opeModel={openModel} setOpeModel={setOpenModel} isHospDtls={false} body={appBody} iscalendar={true} />
        )}

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
                  <span style={{ color: "black" }}>{msg.sender === 'user' ? 'You' : 'Bot'}: </span>
                  {msg.message}
                </div>
              ))}
            </div>
            {showButton && localHospitalDetails.length != 0 && (
              <>
                <div>Upcoming Appointment: </div>
                {localHospitalDetails.length != 0 && localHospitalDetails?.map((val: any) => (
                  <>

                    <button style={{ background: "white", border: "2px solid black", borderRadius: "2px", margin: "0.5rem" }} onClick={() => { handleSelectEvent(val) }}>Booking ID:  {val.bookingId}</button>
                  </>
                ))
                }
              </>
            )}


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
