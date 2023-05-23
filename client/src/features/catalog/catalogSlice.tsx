import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { errorMonitor } from "events";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();
//After creating productsAdapter, go to configureStore and add it
export const fetchProductsAsync = createAsyncThunk<Product[]>(
  "catalog/fetchProductsAsync",
  async (_, thunkApi) => {
    try {
      return await agent.Catalog.list();
    } catch (error) {
      return thunkApi.rejectWithValue({ error: error });
    }
  }
);
export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkApi) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error) {
      return thunkApi.rejectWithValue({ error: errorMonitor });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchproducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchproduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(
        "🚀 ~ file: catalogSlice.tsx:61 ~ builder.addCase ~ action:",
        action
      );

      state.status = "idle";
    });
  },
});

//We can be able to use this productSelectors to get our data from the store
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
