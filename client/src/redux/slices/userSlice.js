import { createSlice } from 'react-redux'

const initialState = {

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

export default userSlice.reducers;