import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import chatTokenManager from '../../Services/ChatTokenManager';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

//TODO: Допилить нормально
export default function SignIn({onUserDataChange} ) {
    const [ email, setEmail ] = useState();
    const [ password, setPassword] = useState();
    const [ user, setUser] = useState();
    const navigate = useNavigate();
    const userState = useSelector((state => state.User));
    const rootURI = process.env.REACT_APP_SERVER_HTTP_ROOT;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        var tokenKey = "accessToken";
        const response = await fetch(`${rootURI}/User/Login`,{
            method:'POST',
            body:JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
            headers: {
            'Content-Type': 'application/json'
            }
        });

        var responseData = await response.json();

        var userObj = {
            name: responseData.username,
            email: responseData.email,
        }
        setUser(userObj);
        if (onUserDataChange)
            onUserDataChange(user);

        if(response.ok === true){
            // sessionStorage.setItem(tokenKey, responseData.access_token);
            chatTokenManager.setToken(responseData.token);
            navigate('/');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value={formData.rememberMe} color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                            </Grid>
                            <Grid item>
                            <Link href="/SignUp" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}