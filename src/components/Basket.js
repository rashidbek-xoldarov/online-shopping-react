import {
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useContext } from "react";
import { useCart } from "react-use-cart";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const Basket = ({ drawer, setDrawer }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isEmpty, items, updateItemQuantity, cartTotal, emptyCart } =
    useCart();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const orderProduct = () => {
    axios.post("http://localhost:8080/orders", items).then((data) => {
      if (data.status === 201) {
        handleClose();
        emptyCart();
      }
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Drawer
      anchor={"right"}
      open={drawer}
      onClose={() => {
        setDrawer(false);
      }}
    >
      <Box width={300}>
        {isEmpty && (
          <Typography variant="h5" marginTop={"20px"} textAlign={"center"}>
            Your cart is empty
          </Typography>
        )}
        <List sx={{ padding: "10px", maxHeight: "500px", overflowY: "scroll" }}>
          {items.length !== 0 &&
            items.map((item) => (
              <ListItem key={item.id} sx={{ display: "block" }} divider>
                <Stack direction={"row"}>
                  <ListItemAvatar>
                    <Avatar>
                      <img
                        style={{
                          objectFit: "cover",
                          width: "40px",
                          height: "40px",
                        }}
                        src={item.product_url}
                        alt={item.name}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.price} $`}
                  />
                </Stack>
                <Box display={"flex"} gap={2} alignItems="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      updateItemQuantity(item.id, item.quantity + 1);
                    }}
                  >
                    +
                  </Button>
                  <Typography>{item.quantity}</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      updateItemQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    -
                  </Button>
                  <Typography>{item.price * item.quantity}</Typography>
                </Box>
              </ListItem>
            ))}
        </List>
      </Box>
      <Box sx={{ padding: "15px", marginTop: "auto" }}>
        <Typography variant="h5" component={"p"}>
          Total: {cartTotal}
        </Typography>
        <Button
          sx={{ marginRight: "15px" }}
          color="success"
          variant="contained"
          onClick={() => {
            if (token) {
              handleOpen();
            } else {
              navigate("/login");
            }
          }}
        >
          Order
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setDrawer(false);
          }}
        >
          Cancel
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" textAlign={"center"} mb={1}>
            Aru you agree ?
          </Typography>
          <Button
            variant="outlined"
            color="success"
            onClick={orderProduct}
            endIcon={<DoneOutlineIcon />}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ marginLeft: "10px" }}
            endIcon={<DoNotDisturbAltIcon />}
          >
            No
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default Basket;
