import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: [],
};

export const flightDataTrackingSlice = createSlice({
    name: 'flightDataTracking',
    initialState,
    reducers: {
        addFlight: (state, action) => {
            state.value = action.payload
        },
        emptyFlight: (state) => {
            state.value =[]
        }
    },
});

export const { addFlight, emptyFlight } = flightDataTrackingSlice.actions;
export default flightDataTrackingSlice.reducer;