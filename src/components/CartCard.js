import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { AuthContext } from "../context/auth-context";

const CartCard = ({ product_name, product_url, product_price, id }) => {
  console.log(product_price);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const buyProduct = {
    id,
    name: product_name,
    price: product_price,
    product_url,
  };

  return (
    <Card sx={{ width: 220, padding: "10px", flexShrink: "0" }} elevation={3}>
      <CardMedia
        sx={{ height: 210 }}
        image={product_url}
        title={product_name}
      />
      <CardContent>
        <Typography gutterBottom variant="p" fontSize={18} component="div">
          {product_name}
        </Typography>
        <Typography
          gutterBottom
          variant="span"
          bgcolor={"yellowgreen"}
          component={"span"}
        >
          $ {product_price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          sx={{ color: "#ff9800", borderColor: "#ff9800" }}
          onClick={() => {
            if (token) {
              addItem(buyProduct);
            } else {
              navigate("/login");
            }
          }}
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartCard;
