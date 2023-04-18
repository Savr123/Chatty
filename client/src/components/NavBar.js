import { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';

const NavBar = () => {
    const [isOpen, setOpen] = useState(false);
    const navItems = [['signIn', '/signIn'], ['signUp', '/']];

    return (
    <AppBar component="nav" position='static'>
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
        >
            <MenuIcon />
        </IconButton>
        <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
            Chat
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
            <Button href={item[1]} key={item[0]} sx={{ color: "#fff" }}>
                {item[0]}
            </Button>
            ))}
        </Box>
        </Toolbar>
    </AppBar>
    )
}

export default NavBar;