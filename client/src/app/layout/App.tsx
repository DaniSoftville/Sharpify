import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import { fetchCartAsync } from "../../features/cart/cartSlice";
import { useAppDispatch } from "../store/configureStore";
import Header from "./Header";
import LoadingComponent from "./LoadingComponent";

function App() {
  /*  const { setCart } = useStoreContext(); Once cartSlice is created, this line is removed */
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(
    async function initApp() {
      try {
        await dispatch(fetchCurrentUser());
        await dispatch(fetchCartAsync());
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch]
  );
  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  function handleDarkMode() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message="Initialising app..." />;
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleDarkMode={handleDarkMode} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
