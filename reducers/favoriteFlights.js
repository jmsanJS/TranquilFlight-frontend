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
        removeFavorite:(state) => {
            state.value.filter((favorite) => {favorite.flightNumber != action.payload});
        },
    },
});

export const { addFavorite, removeFavorite } = favoriteFlightsSlice.actions;
export default favoriteFlightsSlice.reducer;