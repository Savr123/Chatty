import Chat from './components/Chat/Chat';
import NavBar from './components/NavBar';

import * as React from 'react';
import Box from '@mui/material/Box';

function App() {
  return (
    <Box sx={{flexgrow: 1}}>
      <NavBar/>
      <Chat />  
    </Box>
    
  );
}

export default App;
