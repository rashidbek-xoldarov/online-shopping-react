import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Grid } from "@mui/material";
import axios from "axios";
import { CartCard } from "../../components/CartCard";
import { useCart } from "react-use-cart";
import Basket from "../../components/Basket";

function Client() {
  const [drawer, setDrawer] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [product, setProduct] = React.useState([]);
  const { totalItems, items } = useCart();

  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    axios.get("http://localhost:8080/products").then((data) => {
      if (data.status === 200) {
        setProduct(data.data);
      }
    });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: "flex", mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Link to="/login">
              <Button
                variant="contained"
                sx={{ marginRight: "10px" }}
                color="success"
              >
                Login
              </Button>
            </Link>
            <Button
              variant="contained"
              sx={{ marginRight: "10px" }}
              onClick={() => {
                navigate("/admin");
              }}
              color="error"
            >
              Admin
            </Button>
            <IconButton
              sx={{ marginRight: "10px" }}
              onClick={() => setDrawer(true)}
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon sx={{ color: "#fff" }} />
              </Badge>
            </IconButton>
            <Basket items={items} drawer={drawer} setDrawer={setDrawer} />
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{ bgcolor: "white", color: "#42a5f5" }}
                    alt="Remy Sharp"
                  >
                    R
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Button variant="contained">Log Out</Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Grid container spacing={3} marginTop="20px">
          {product.length !== 0 &&
            product.map((item) => (
              <Grid key={item.id} xs={3} item>
                <CartCard {...item} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}
export default Client;
