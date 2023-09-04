//1. Create a function that returns createStore from redux and pass the counterReducer

//import counterReducer from "../../features/contact/counterReducer";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";
import { cartSlice } from "../../features/cart/cartSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { counterSlice } from "../../features/contact/counterSlice";

/* export function configureStore() {
  return createStore(counterReducer);
} */

//We use instead the configureStore provided by toolKit
//and specify the reducers inside giving a name as counter
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    cart: cartSlice.reducer, //once added, go and fetch the cart inside App.tsx
    catalog: catalogSlice.reducer,
    account: accountSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; //We need the type and store in RootState, we just need the type, don't add parens
export type AppDispatch = typeof store.dispatch;

/*Instead of using useDispatch from React Redux, we're gonna use our custom hook,
  which is already typed to AppDispatch which is of type store.dispatch */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/*Instead of using useSelector, we're gonna use useAppSelector */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
