import { Route, Routes, BrowserRouter  as Router } from 'react-router-dom';

import Chat from './components/Chat/Chat';
import NavBar from './components/NavBar';

import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { useState } from "react";



function App() {
  
  const { user, setUser} = useState();
  const handleUserChange = ( user ) => {
    setUser(user);
  }
  return (
    <Box >
      <NavBar/>
      <Chat onChange = { handleUserChange }/>
    </Box>
  );
}

export default App;
