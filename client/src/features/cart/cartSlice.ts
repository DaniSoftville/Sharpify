import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Cart } from "../../app/models/Cart";
import { getCookie } from "../../app/utils/utils";

/*1.First, we need and interface for our CartState, 
inside we can have our cart type Cart or null */
interface CartState {
  cart: Cart | null;
  status: string; //added to createAsyncThunk
}

/*2. Then, we can sepecify our initial state. */

const initialState: CartState = {
  cart: null,
  status: "idle", //added to createAsyncThunk
};

/*4. To start using async api calls with createAsyncThunk,
 they create actions on our behalf that we can then use
to do something inside of our store. Set status: 'idle' to pending 
as soon as we start to go and get our cart items, 
then send it back to idle once it's fulfilled  or rejected. Do it by adding extrareducers below. */

export const fetchCartAsync = createAsyncThunk<Cart>(
  "cart/fetchCartAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Cart.get();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) return false;
    },
  }
);

export const addCartItemAsync = createAsyncThunk<
  Cart,
  { productId: number; quantity?: number } //2*give the parameters and types. quantity is optional ?
>("cart/addCartItemAsync", async ({ productId, quantity = 1 }, thunkApi) => {
  //give it quantity= 1
  //1*first, give it a name, followed the parameters to add to the asynchronous method
  try {
    //3* return the productId and quantity, then set status:'idle' to pending.
    return await agent.Cart.addItem(productId, quantity);
  } catch (error) {
    return thunkApi.rejectWithValue({ error: error });
  }
});

/*6. Create remove cart item async. We return nothing from our API when removing,
 so return void from the method*/
export const removeCartItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string } //adding name as a property, allow loading indicator to be just to specific decrement or remove item, not both.
>(
  "cart/removeCartitemAsync",

  async ({ productId, quantity }, thunkApi) => {
    try {
      await agent.Cart.removeItem(productId, quantity); //Once defined this function, go to extrareducers
    } catch (error) {
      return thunkApi.rejectWithValue({ error: error });
    }
  }
); //Specify parameters, with quantity as optional

/*3. Create the cart slice*/

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
  },

  /*5. Extrareducers,createAsyncThunk is gonna create action creators  */
  extraReducers: (builder) => {
    builder.addCase(addCartItemAsync.pending, (state, action) => {
      //First, we can set a pending status

      state.status = "pendingAddItem" + action.meta.arg.productId; //Add here and go back to ProductCard.tsx
    }); //addCase Adds a case reducer to handle a single exact action type.

    builder.addCase(removeCartItemAsync.pending, (state, action) => {
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name; //to target the specific button that's being clicked
    });
    builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } =
        action.meta.arg; /*destructure these that come  with meta */
      const itemIndex = state.cart?.items.findIndex(
        (i) => i.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.cart!.items[itemIndex].quantity -= quantity; // we put ! to override the typescript checking as we defined above as 1
      if (state.cart?.items[itemIndex].quantity === 0)
        state.cart.items.splice(itemIndex, 1);
      state.status = "idle";
    });
    builder.addCase(removeCartItemAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addMatcher(
      isAnyOf(addCartItemAsync.fulfilled, fetchCartAsync.fulfilled),
      (state, action) => {
        //second we set the status to what comes back in the action payload.
        state.cart = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(addCartItemAsync.rejected, fetchCartAsync.rejected),
      (state, action) => {
        //finnaly we set the status back to idle if rejected.
        console.log(action.payload);
        state.status = "idle";
      }
    );
  },
});
/*Export the actions and go to configureStore.tsx method */
export const { setCart, clearCart /* removeItem */ } = cartSlice.actions; //We remove removeItem cause we now use extrareducer

//Now go to Product Details
