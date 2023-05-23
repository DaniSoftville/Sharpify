import { Button, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

const ContactPage = () => {
  //5.After creating actions, we dispath them to our reducers here to match the action type created, inside our reducer,
  // it's gonna do something and return the new state re render the component and display the updates as well. Add the button group below

  /*6. const dispatch = useDispatch(); use instead the custom hook useAppDispatch(); */
  const dispatch = useAppDispatch();

  //1. Pass the state as paramater and specifies state.
  //2. Destructure the data and title from the selector
  //3. Specify the type of the state as CounterState
  /*  const { data, title } = useSelector((state: CounterState) => state); 
 use instead the custom hook useAppSelector();*/
  const { data, title } = useAppSelector((state) => state.counter);
  //4. Add fragment so we can display two different ellements here.
  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">Data is:{data}</Typography>

      <Button
        onClick={() => dispatch(decrement(1))} //Replaces the object type { type: DECREMENT_COUNTER } after action creators functions enabled
        variant="contained"
        color="error"
      >
        Decrement
      </Button>
      <Button
        onClick={() => dispatch(increment(1))} //Replaces the object type { type: DECREMENT_COUNTER }
        /* We're gonna pass this object to our counter reducer, 
        check the action type, which ever case it receives, 
        it's gonna do something based on what we're dispatching to the counter reducer */
        variant="contained"
        color="primary"
      >
        Increment
      </Button>

      <Button
        onClick={() => dispatch(increment(5))} //ass a third button with 5
        //as an argument of 5 as the payload is 5, it’s gonna update the data as well, and our component is rerender
        // when this new state is available.
        variant="contained"
        color="secondary"
      >
        Increment by 5
      </Button>
    </>
  );
};

export default ContactPage;
