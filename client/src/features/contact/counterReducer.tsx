/* 4. Create constants to prevent typos when we're using our actions*/
export const INCREMENT_COUNTER = "INCREMENT_COUNTER"; //Actions to update the state value of 42 for example
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";

//1. Create an interface with a single property called data
export interface CounterState {
  data: number;
  title: string;
}

//2. When creating a reducer, we need to give it a initial state
const initialState: CounterState = {
  data: 42,
  title: "Counter Reducer",
};

//7.Action creators, functions that return our action types

export function increment(amount = 1) {
  return {
    type: INCREMENT_COUNTER,
    /*  If we have a payload, we specify here as well, 
     in this case we dont as we just increment one by one
     For example we can have another button that specifies a different amount */
    payload: amount, //1 by default but we can override that, now inside the counter
  };
}
export function decrement(amount = 1) {
  return {
    type: DECREMENT_COUNTER,
    /*  If we have a payload, we specify here as well, 
     in this case we dont as we just increment one by one
     For example we can have another button that specifies a different amount */
    payload: amount, //1 by default but we can override that, then inside conterReducer, we specify action.payload instead
  };
}

/* 3. Then, we need to create a reducer function passing the initial state an an action parameter. 
Actions are those we dispatch to our reducers to change the state. */

export default function counterReducer(state = initialState, action: any) {
  /*5.//When we receive the action, we want to change the data, 
        in this case increment or decrement  the counter, we add a switch statement
        based on the action type that we're receiving. We need to dispatch the action to the store, 
        so go to ContactPage and use hook useDispatch from react-redux.
 */
  switch (action.type) {
    case INCREMENT_COUNTER: //In the case of action type INCREMENT_COUNTER
      return {
        // return a state object (not allowed to mutate the state. Ex. state.data+1)
        ...state, //use instead the spread operator that creates a new copy of the state
        data: state.data + action.payload, //Then adjust the value of the data property that is returned in the new state
      };
    case DECREMENT_COUNTER: //In the case of action type DECREMENT_COUNTER
      return {
        // return a state object (not allowed to mutate the state. Ex. state.data+1)
        ...state, //use instead the spread operator that creates a new copy of the state
        data: state.data - action.payload, //Then adjust the value of the data property that is returned in the new state
      };

    default:
      return state; //even if we're not updating the state, we still return it.
  }
}
