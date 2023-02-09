import Chat from './components/Chat/Chat';
import NavBar from './components/NavBar';

import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';

function App() {
  return (
    <Box sx={{flexgrow: 1}}>
      <NavBar/>
      <Paper>
        <Chat />  
      </Paper>
    </Box>
    
  );
}

export default App;
