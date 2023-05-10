import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import agent from "../api/agent";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../utils/utils";
import Header from "./Header";
import LoadingComponent from "./LoadingComponent";

function App() {
  const { setCart } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Cart.get()
        .then((cart) => setCart(cart))
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setCart]);
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
