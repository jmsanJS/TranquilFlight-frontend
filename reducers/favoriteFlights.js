import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: [],
};

export const favoriteFlightsSlice = createSlice({
    name: 'favoriteFlights',
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            state.value.push(action.payload);
        },
        removeFavorite:(state, action) => { 
            state.value = state.value.filter((favorite) => favorite.flightNumber !== action.payload);
        },
        emptyReducer: (state) => {
            state.value = []
        }
    },
});

export const { addFavorite, removeFavorite, emptyReducer } = favoriteFlightsSlice.actions;
export default favoriteFlightsSlice.reducer;