import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    timeFormat: "24h",
    distanceUnit: "km",
    temperatureUnit: "°C",
    notifications: "on",
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateTimeFormat: (state, action) => {
      state.value.timeFormat = action.payload;
    },
    updateDistanceUnit: (state, action) => {
      state.value.distanceUnit = action.payload;
    },
    updateTemperatureUnit: (state, action) => {
      state.value.temperatureUnit = action.payload;
    },
    updateNotifications: (state, action) => {
      state.value.notifications = action.payload;
    },
    resetSettingsReducer: (state) => {
      state.value = {
        timeFormat: "24h",
        distanceUnit: "km",
        temperatureUnit: "°C",
        notifications: "on",
      }
  }
  },
});

export const {
  updateTimeFormat,
  updateDistanceUnit,
  updateTemperatureUnit,
  updateNotifications,
  resetSettingsReducer
} = settingsSlice.actions;
export default settingsSlice.reducer;
