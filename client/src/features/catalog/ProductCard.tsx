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
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { Product } from "../../app/models/product";
import { currencyFormat } from "../../app/utils/utils";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  const [loading, setLoading] = useState(false);
  const { setCart } = useStoreContext();
  function handleAddItem(productId: number) {
    setLoading(true);
    agent.Cart.addItem(productId)
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error.message))
      .finally(() => setLoading(false));
  }
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
          loading={loading}
          onClick={() => handleAddItem(product.id)}
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
