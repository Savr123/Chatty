import logo from './logo.svg';
import './App.css';
import { Route, Routes, BrowserRouter  as Router } from 'react-router-dom';

import Chat from './Components/Chat/Chat';
import NavBar from './Components/NavBar';

import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { useState, useEffect } from "react";

function App() {
  const { user, setUser } = useState();
  const [config, setConfig] = useState(null);

  const handleUserChange = ( user ) => {
  setUser(user);
  }

  useEffect(() => {
      fetch('/path/to/config.json')
          .then(response => response.json())
          .then(data => {
              setConfig(data);
          })
          .catch(error => {
              console.error('Error loading config:', error);
          });
  }, []);

  return (
    <Box >
      <NavBar/>
      <Chat onChange = { handleUserChange }/>
    </Box>
  );
}

export default App;
