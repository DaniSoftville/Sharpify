import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { Badge, IconButton, List, ListItem, Switch } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

interface Props {
  darkMode: boolean;
  handleDarkMode: () => void;
}
const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];
const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "grey.400",
  },
  "&.active": {
    color: "text.secondary",
  },
};
const Header = ({ darkMode, handleDarkMode }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",

              aligItems: "center",
            }}
          >
            <Typography variant="h6" component={NavLink} to="/" sx={navStyles}>
              Sharpify
            </Typography>

            <Switch checked={darkMode} onChange={handleDarkMode} />
          </Box>

          <List sx={{ display: "flex" }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              aligItems: "center",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent="4" color="secondary">
                <ShoppingCartTwoToneIcon />
              </Badge>
            </IconButton>
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
