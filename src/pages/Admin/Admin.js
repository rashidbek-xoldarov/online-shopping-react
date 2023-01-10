import { Box, Button, Link, List, ListItem, Typography } from "@mui/material";
import React from "react";
import {
  Link as RouterLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Category from "../../components/Category";
import Order from "../../components/Order";
import Product from "../../components/Product";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "200px",
          backgroundColor: "#03a9f4",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Typography variant="h4" color={"white"}>
          Links
        </Typography>
        <List>
          <ListItem>
            <Link
              sx={{ color: "white", fontSize: "18px" }}
              to="/admin"
              component={RouterLink}
            >
              Product
            </Link>
          </ListItem>
          {/* <ListItem>
            <Link
              sx={{ color: "white", fontSize: "18px" }}
              to="order"
              component={RouterLink}
            >
              Order
            </Link>
          </ListItem> */}

          <ListItem>
            <Link
              sx={{ color: "white", fontSize: "18px" }}
              to="category"
              component={RouterLink}
            >
              Category
            </Link>
          </ListItem>
        </List>
      </Box>
      <Box flexGrow={1}>
        <Box
          bgcolor={"#01579b"}
          p={3}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h4" color={"white"}>
            Admin Panel
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </Box>
        <Routes>
          {/* <Route path="order" element={<Order />} /> */}
          <Route index element={<Product />} />
          <Route path="category" element={<Category />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Admin;
