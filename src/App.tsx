import { Grid } from '@mui/material';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from "./Component/Login"
import SignUp from "./Component/SignUp"
import Home from "./Component/Home"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import BookingDetails from './Component/BookingDetails';
import ResetPassword from './Component/ResetPassword';
import { useDispatch } from 'react-redux';
import { clearUser } from './userSlice';
import BookingHistory from './Component/BookingHistory';
import MyCalendar from './Component/MyCalendar';
import SchedulerSignIn from './Component/SchedulerSignin';
import SchedulerLogin from './Component/SchedulerLogin';
import SchedulerHome from './Component/SchedulerHome';




function App() {
  const disaptach = useDispatch();

  

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignUp />
      },
      {
        path: "/bookAppointment",
        element: <BookingDetails/>
      },
      {
        path: "/resetPassword",
        element: <ResetPassword/>
      },
      {
        path: "/bookingHistory",
        element: <BookingHistory/>
      },
      {
        path: "/schedulerLogin",
        element: <SchedulerLogin/>
      },
      {
        path: "/schedulerSignIn",
        element: <SchedulerSignIn/>
      } ,
      {
        path: "/schedulerHome",
        element: <SchedulerHome/>
      } 
    ]
  )
  const userName = useSelector((state: RootState) => state.user.userName);
  // useEffect(() => {
  //   disaptach(clearUser());
  // },[])


 console.log(userName, "App")

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>

  );
}



export default App;



// import React from "react";
// import Chatbot from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css"; // Import necessary CSS

// import config from "./config/config";       // Your chatbot configuration file
// import MessageParser from "./config/MessageParser"; // Your message parser
// import ActionProvider from "./config/ActionProvider"; // Your action provider

// function App() {
//   return (
//     <div className="App">
//       <h1>My Chatbot</h1>
//       <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
//     </div>
//   );
// }

// export default App;

//npm i @fullcalendar/react

