import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Container component={Paper} sx={{ height: 400 }}>
      <Typography gutterBottom variant="h3">
        Ooops - Seems to be unreacheable - Not Found
      </Typography>
      <Divider />
      <Link to="/catalog">
        <Button fullWidth>Go back to shop</Button>
      </Link>
    </Container>
  );
};

export default NotFound;
