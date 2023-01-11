import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { AuthContext } from "../context/auth-context";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CartCard = ({
  product_name,
  product_url,
  product_price,
  id,
  category_id,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { token } = useContext(AuthContext);

  const buyProduct = {
    id,
    category_id,
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

export const CardProduct = ({
  product_name,
  product_price,
  product_url,
  id,
  getProduct,
  category_id,
  category,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const nameRef = useRef();
  const priceRef = useRef();
  const urlRef = useRef();
  const selectRef = useRef();

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const editForm = (id) => {
    const obj = {
      product_name: nameRef.current.value,
      product_price: priceRef.current.value,
      product_url: urlRef.current.value,
      category_id: selectRef.current.value,
    };

    axios.put("http://localhost:8080/products/" + id, obj).then((data) => {
      if (data.status === 200) {
        setModalOpen(false);
        getProduct();
      }
    });

    nameRef.current.value = "";
    priceRef.current.value = "";
    urlRef.current.value = "";
    selectRef.current.value = "";
  };

  const deleteProduct = (id) => {
    axios.delete("http://localhost:8080/products/" + id).then((data) => {
      if (data.status === 200) {
        getProduct();
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 220, padding: "10px" }}>
      <CardMedia
        sx={{ height: 210 }}
        image={product_url}
        title={product_name}
      />
      <CardContent>
        <Typography gutterBottom variant="p" fontSize={18} component="div">
          {product_name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={() => {
            if (token) {
              deleteProduct(id);
            } else {
              navigate("/login");
            }
          }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<EditIcon />}
          onClick={() => {
            if (token) {
              setModalOpen(true);
            } else {
              navigate("/login");
            }
          }}
        >
          Edit
        </Button>
        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                editForm(id);
              }}
            >
              <Stack sx={{ width: "400px" }} spacing={2} mt={"10px"} mb="8px">
                <TextField
                  fullWidth
                  label="Product name"
                  type="text"
                  variant="outlined"
                  required
                  inputRef={nameRef}
                  defaultValue={product_name}
                />
                <TextField
                  fullWidth
                  label="Prodcut price"
                  type="text"
                  variant="outlined"
                  inputRef={priceRef}
                  defaultValue={product_price}
                  required
                />
                <TextField
                  fullWidth
                  label="Product image url"
                  type="text"
                  inputRef={urlRef}
                  variant="outlined"
                  defaultValue={product_url}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Company</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Company"
                    inputRef={selectRef}
                    defaultValue={category_id}
                  >
                    {category.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Button variant="contained" type="submit">
                Edit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export const Categorytable = ({
  products,
  id,
  getCategory,
  category_name,
  result,
}) => {
  const [categoryEdit, setCategoryEdit] = useState(false);
  const { items, removeItem } = useCart();

  const editRef = useRef();

  const deleteCategory = (id) => {
    const deletedArr = items.filter((item) => item.category_id == id);
    deletedArr.forEach((item) => {
      removeItem(item.id);
    });

    const arr = products.filter((item) => item.category_id == id);
    arr.forEach((item) => {
      axios
        .delete("http://localhost:8080/products/" + item.id)
        .then((data) => {});
    });

    axios.delete("http://localhost:8080/category/" + id).then((data) => {
      if (data.status === 200) {
        getCategory();
      }
    });
  };

  const editHandler = (id) => {
    axios
      .put("http://localhost:8080/category/" + id, {
        category_name: editRef.current.value,
      })
      .then((data) => {
        if (data.status === 200) {
          setCategoryEdit(false);
          getCategory();
        }
      });
  };

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell>{category_name}</TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            deleteCategory(id);
          }}
          disabled={result.length > 0 ? false : true}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setCategoryEdit(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <Dialog
          open={categoryEdit}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            setCategoryEdit(false);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Add Category"}</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                editHandler(id);
              }}
            >
              <Stack>
                <TextField
                  sx={{
                    marginTop: "5px",
                    width: "400px",
                    marginBottom: "5px",
                  }}
                  inputRef={editRef}
                  defaultValue={category_name}
                  label="Enter category"
                  type="text"
                />
              </Stack>
              <Button type="submit" variant="text">
                Edit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};
