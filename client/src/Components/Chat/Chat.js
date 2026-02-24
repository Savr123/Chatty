import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';
import './style/Chat.css';
import { Grid } from '@mui/material';


import { Paper } from '@mui/material';
import { Divider } from '@mui/material';
import { TextField } from '@mui/material';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import chatTokenManager from '../../Services/ChatTokenManager';



const Chat = ( user ) => {

    const [ connection, setConnection ] = useState([]);
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);
    const userState = useSelector(state => state.user);
    const rootURI = process.env.REACT_APP_SERVER_HTTP_ROOT;

    latestChat.current = chat;

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${rootURI}/hubs/chat`,
                {
                    accessTokenFactory() {
                        let token = chatTokenManager.getToken();
                        return token;
                    }
                })
            .withAutomaticReconnect()
            .build();
            
            connection.start()
            .then(result => {
                console.log('Connected!');
                
                connection.on('RecieveMessage', message => {
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);

                    setChat(updatedChat);
                });
            })
            .catch(e => console.log('Connection failed: ', e));
    }, []);

    const sendMessage = async (message, date) => {
        var tempId = uuidv4();
        const chatMessage = {
            id: tempId,
            text:    message,
            date:       date,
            chatId: "2",
            userId: "3",
        };


        try {
            let token = chatTokenManager.getToken();
            await fetch(`${rootURI}/Chat/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(chatMessage),
                credentials: 'include',
            });
        }
        catch(e){
            console.log('Sending message failed. ', e)
        }
    };

  return (
    
    <Paper className="custom-paper">
        <Grid container className="chatSection">
            <Grid item xs={3} className="borderRight500">
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
                <ChatWindow user={user} chat={chat} sx={{overflowY: 'scroll'}}/>
                <ChatInput sendMessage={sendMessage}/>
            </Grid>
        </Grid>
    </Paper>
    
  );
}

export default Chat;