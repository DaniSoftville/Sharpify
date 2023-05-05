import SettingsBrightnessTwoToneIcon from "@mui/icons-material/SettingsBrightnessTwoTone";
import { Switch } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

interface Props {
  darkMode: boolean;
  handleDarkMode: () => void;
}
const Header = ({ darkMode, handleDarkMode }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sharpify
          </Typography>
          <Switch checked={darkMode} onChange={handleDarkMode} />
          <SettingsBrightnessTwoToneIcon />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
