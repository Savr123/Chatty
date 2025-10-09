import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    username: 'guest',
    avatarUrl: 'guest.Image.com',
    status: 'online',
    IsLogedIn: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        logIn: (state, action) => {
            
        },
        logOut: (state) => {

        },
    },
})

export const { login, logout }  = userSlice.actions;

export default userSlice.reducer;