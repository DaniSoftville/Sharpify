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
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import CartSummary from "./CartSummary";
import { addCartItemAsync, removeCartItemAsync } from "./cartSlice";
const CartPage = () => {
  //const { cart, setCart, removeItem } = useStoreContext();
  const { cart, status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

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
                      status === "pendingRemoveItem" + item.productId + "rem"
                    }
                    onClick={() =>
                      dispatch(
                        removeCartItemAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: "rem",
                        })
                      )
                    }
                  >
                    <RemoveCircleOutline />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    color="success"
                    loading={status === "pendingAddItem" + item.productId}
                    onClick={() =>
                      dispatch(addCartItemAsync({ productId: item.productId }))
                    }
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
                    loading={status === "pending" + item.productId + "del"}
                    onClick={() =>
                      dispatch(
                        removeCartItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: "del",
                        })
                      )
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
