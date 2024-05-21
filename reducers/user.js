import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { token: null, email: null, firstname:null, lastname:null },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.token = action.payload.token;
            state.value.firstname = action.payload.firstname;
            state.value.lastname = action.payload.lastname;
            state.value.email = action.payload.email;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.firstname = null;
            state.value.lastname = null;
            state.value.email = null;
        },
        updateEmail: (state, action) => {
            state.value.email = action.payload;
        }
    },
});

export const { login, logout, updateEmail } = userSlice.actions;
export default userSlice.reducer;