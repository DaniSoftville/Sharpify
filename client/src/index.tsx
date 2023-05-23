import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./app/layout/styles.css";
import { router } from "./app/router/Routes";
import { store } from "./app/store/configureStore";
import reportWebVitals from "./reportWebVitals";
/* const store = configureStore(); Removed when start using redux toolKit*/

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

/* store.dispatch(fetchProductsAsync()); As we're gonna use entity adapter selectors*/
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
