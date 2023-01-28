import React, { useState } from 'react';

import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = (props) => {
    const [message, setMessage] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        const isMessageProvided = message && message !== '';

        if (isMessageProvided) {
            props.sendMessage(message, (new Date()).toJSON());
            setMessage("");
        }
    }

    const onKeySubmit = (e) => {
        if(e && e.keyCode === 13){
            onSubmit(e);
        }
    }

    const onMessageUpdate = (e) => {
        setMessage(e.target.value);
    }

    return (
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
                <TextField 
                    onKeyDown={onKeySubmit}
                    id="outlined-basic-email" 
                    label="Type Something" 
                    fullWidth 
                    value = {message}
                    onChange = {onMessageUpdate}
                />
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary" aria-label="add" onClick={onSubmit}><SendIcon /></Fab>
            </Grid>
        </Grid>
    )
};

export default ChatInput;