import { createSlice } from "@reduxjs/toolkit";

//1. Create an interface with a single property called data
export interface CounterState {
  data: number;
  title: string;
}

//2. When creating a reducer, we need to give it a initial state
const initialState: CounterState = {
  data: 42,
  title: "redux toolKit Counter",
};

/* 3. Use the function from toolKit createSlice, passing an option object and reducers. A function that accepts an initial state, an object full of reducer functions, and a "slice name", and automatically 
generates action creators and action types that correspond to the reducers and state. */
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});
//4.//export the actions creators and go to update the store to use toolKit
export const { increment, decrement } = counterSlice.actions;
