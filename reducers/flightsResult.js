import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {},
};

export const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        addFlight: (state, action) => {
            state.value = action.payload
        },
        removeFlight:(state) => {
            state.value = {};
        },
    },
});

export const { addFlight, removeFlight } = flightsSlice.actions;
export default flightsSlice.reducer;