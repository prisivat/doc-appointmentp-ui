import { Grid } from '@mui/material';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from "./Component/Login"
import SignUp from "./Component/SignUp"
import Home from "./Component/Home"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import BookingDetails from './Component/BookingDetails';



function App() {

  

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
      }
    ]
  )
  const userName = useSelector((state: RootState) => state.user.userName);


 console.log(userName, "App")

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>

  );
}



export default App;
