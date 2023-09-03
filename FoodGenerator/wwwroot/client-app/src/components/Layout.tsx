import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import EggIcon from "@mui/icons-material/Egg";
function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Drawer open={isOpen} onClose={() => [setIsOpen(false)]}>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ ml: 1, mt: 1 }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem
              disablePadding
              onClick={() => {
                navigate("/");
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItemButton>
            </ListItem>
            {/* <ListItem
              disablePadding
              onClick={() => {
                navigate("/foods");
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FastfoodIcon />
                </ListItemIcon>
                <ListItemText primary={"Posiłki"} />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => {
                navigate("/ingredients");
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <EggIcon />
                </ListItemIcon>
                <ListItemText primary={"Składniki"} />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Drawer>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Generator żarełka
              </Typography>
            </Toolbar>
          </AppBar>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default Layout;
