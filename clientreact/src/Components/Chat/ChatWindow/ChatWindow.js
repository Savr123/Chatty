import React, { useEffect, useRef, useState } from 'react';
import Message from './Message/Message';

import { List } from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ChatWindow = (props) => {
    
    const [user, setUser] = useState();
    const scrollBarRef = useRef();
    useEffect(()=> {
        if(scrollBarRef) {
            scrollBarRef.current.container.addEventListener('DOMNodeInserted', event => {
                scrollBarRef.current.scrollToBottom();
            });
        }
    }, []);
    const chat = props.chat
        .map((message, id) => <Message
            date        = {(new Date(message.date)).toLocaleString()}
            key         = {id}
            id          = {message.id}
            user        = {user}
            text        = {message.text}
            chatId      = {message.chatId}
            userId      ={message.userId}/>);
    
    return (
        <Scrollbars ref={scrollBarRef} autoHide>
            <List sx={{ maxHeight:'100%', height:'max-content' }}>
                {chat}
            </List>
        </Scrollbars>
    );
};

export default ChatWindow;