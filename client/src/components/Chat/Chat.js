import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';
import './style/Chat.css';
import { Grid } from '@mui/material';


import { makeStyles } from '@mui/styles';
import { Paper } from '@mui/material';
import { Divider } from '@mui/material';
import { TextField } from '@mui/material';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Avatar } from '@mui/material';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '100%'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  },
  paper: {
    width: "80vw",
    height: "89vh",
    margin: "15px auto",
    overflow: "hidden"
  }
});

const Chat = () => {
    const classes = useStyles();

    const [ connection, setConnection ] = useState([]);
    const [ chat, setChat ] = useState([{id: '1', text:'Hello', date: (new Date()).toJSON()}]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:8080/hubs/chat')
            .withAutomaticReconnect()
            .build();
            
            connection.start()
            .then(result => {
                console.log('Connected!');
                
                connection.on('RecieveMessage', message => {
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);

                    setChat(updatedChat);
                })
            })
            .catch(e => console.log('Connection failed: ', e))
    }, []);

    const sendMessage = async (message, date) => {
        const chatMessage = {
            id: "1",
            text:    message,
            date:       date,
            chatId: "1",
            userId: "1"
        };

        try{
            await fetch('https://localhost:8080/Chat/messages', {
                method: 'POST',
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch(e){
            console.log('Sending message failed. ', e)
        }
    }

  return (
    
    <Paper className={classes.paper}>
        <Grid container className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="John Wick"></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                    <ListItem button key="Alice">
                        <ListItemIcon>
                            <Avatar alt="Alice" src="https://mui.com/static/images/avatar/3.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Alice">Alice</ListItemText>
                    </ListItem>
                    <ListItem button key="CindyBaker">
                        <ListItemIcon>
                            <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                    </ListItem>
                </List>
            </Grid>
            <Grid item xs={9} sx={{display:'flex', justifyContent:'flex-end', flexDirection: 'column', height: '100%'}}>
                <ChatWindow chat={chat} sx={{overflowY: 'scroll'}}/>
                <ChatInput sendMessage={sendMessage}/>
            </Grid>
        </Grid>
    </Paper>
    
  );
}

export default Chat;