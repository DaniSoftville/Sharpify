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

export const fetchFilters = createAsyncThunk(
  "catalog/fetchFilters", //Specify the type prefix as catalog fetch filters.
  async (_, thunkAPI) => {
    //As seconnd parameter as thunkAPI so we can deal with any errors we get with this request
    try {
      return agent.Catalog.fetchFilters();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",
    brands: [],
    types: [],
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
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

//We can be able to use this productSelectors to get our data from the store
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
