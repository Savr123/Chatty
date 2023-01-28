
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';

const NavBar = () => {


    return (
    <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat
        </Typography>
        <Button color="inherit">Login</Button>
        </Toolbar>
    </AppBar>)
}

export default NavBar;