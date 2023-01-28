import React from 'react';

import { ListItem } from '@mui/material';
import { Grid } from '@mui/material';
import { ListItemText } from '@mui/material';

const Message = (props) => (
    <ListItem key={props.key}>
        <Grid container>
            <Grid item xs={12}>
                <ListItemText align="right" primary={props.message}></ListItemText>
            </Grid>
            <Grid item xs={12}>
                <ListItemText align="right" secondary={props.date}></ListItemText>
                <ListItemText align="right" secondary={props.user}></ListItemText>
            </Grid>
        </Grid>
    </ListItem>
);

export default Message;