import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utils/utils";
import { addCartItemAsync } from "../cart/cartSlice";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  //const [loading, setLoading] = useState(false); After creating AsyncThunk,
  //we can remove this, instead, get the status from useAppSelector
  /*   const { setCart } = useStoreContext(); */
  const { status } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch(); // We still need dispatch.

  /* After creating AsyncThunk, we don't need this function anymore
  function handleAddItem(productId: number) {
    setLoading(true);
    agent.Cart.addItem(productId)
      .then((cart) => dispatch(setCart(cart))) //When we add a product using our product card, we update the satete in redux.
      .catch((error) => console.log(error.message))
      .finally(() => setLoading(false));
  } */

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.light" },
        }}
      />
      <CardMedia
        sx={{ height: 140, backgroundSize: "contain" }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secundary" variant="h5">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand}/{product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={status.includes("pendingAddItem" + product.id)} //This way, we got just the specific loading button displayed
          onClick={() => dispatch(addCartItemAsync({ productId: product.id }))} //Just productId because quantity is optional and we set to 1, take a llok in the browser and add to cart from /catalog, all loading indicators
          size="small"
        >
          Add to Cart
        </LoadingButton>
        <Link to={`/catalog/${product.id}`}>
          <Button size="small">
            <ReadMoreIcon />
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
