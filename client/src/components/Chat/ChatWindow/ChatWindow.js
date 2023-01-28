import React, { useEffect, useRef } from 'react';
import Message from './Message/Message';

import { List } from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars';

const ChatWindow = (props) => {
    
    const scrollBarRef = useRef();
    useEffect(()=> {
        if(scrollBarRef) {
            scrollBarRef.current.container.addEventListener('DOMNodeInserted', event => {
                scrollBarRef.current.scrollToBottom();
            });
        }
    }, []);
    const chat = props.chat
        .map((m, id) => <Message
            date        = {(new Date(m.date)).toLocaleString()}
            key         = {id}
            user        = {m.user}
            message     = {m.message}/>);
    
    return (
        <Scrollbars ref={scrollBarRef} autoHide='true'>
            <List sx={{ maxHeight:'100%', height:'max-content' }}>
                {chat}
            </List>
        </Scrollbars>
    );
};

export default ChatWindow;