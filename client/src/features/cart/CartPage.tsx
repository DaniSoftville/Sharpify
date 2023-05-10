import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

import { RemoveCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import CartSummary from "./CartSummary";

const CartPage = () => {
  const { cart, setCart, removeItem } = useStoreContext();
  const [status, setStatus] = useState({
    loading: false,
    name: "",
  });

  const handleAddItem = (productId: number, name: string) => {
    setStatus({ loading: true, name });
    agent.Cart.addItem(productId)
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error.message))
      .finally(() => setStatus({ loading: false, name: "" }));
  };

  const handleRemoveItem = (productId: number, quantity = 1, name: string) => {
    setStatus({ loading: true, name });
    agent.Cart.removeItem(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .catch((error) => console.log(error.message))
      .finally(() => setStatus({ loading: false, name: "" }));
  };
  if (!cart) return <Typography variant="h3">Your Cart is empty.</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {(item.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    color="error"
                    loading={
                      status.loading && status.name === "rem" + item.productId
                    }
                    onClick={() => handleRemoveItem(item.productId, 1, "rem")}
                  >
                    <RemoveCircleOutline />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    color="success"
                    loading={
                      status.loading && status.name === "add" + item.productId
                    }
                    onClick={() => handleAddItem(item.productId, "add")}
                  >
                    <AddCircleTwoToneIcon />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  {((item.price * item.quantity) / 100).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    loading={
                      status.loading && status.name === "del" + item.productId
                    }
                    onClick={() =>
                      handleRemoveItem(item.productId, item.quantity, "del")
                    }
                  >
                    <DeleteTwoToneIcon />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <CartSummary />
          <br></br>

          <Link to="/checkout">
            <Button variant="contained" size="large" fullWidth>
              Checkout
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default CartPage;
