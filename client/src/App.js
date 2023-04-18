import { Route, Routes, BrowserRouter  as Router } from 'react-router-dom';

import Chat from './components/Chat/Chat';
import NavBar from './components/NavBar';
import Login from './components/LoginPage';

import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';



function App() {
  return (
    <Box >
      <NavBar/>
      <Chat/>
    </Box>
  );
}

export default App;
