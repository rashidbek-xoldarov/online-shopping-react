import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [value, setValue] = React.useState("1");
  const nameRef = useRef();
  const priceRef = useRef();
  const urlRef = useRef();
  const selectRef = useRef();

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCategory = () => {
    axios.get("http://localhost:8080/category").then((data) => {
      if (data.status === 200) {
        setCategory(data.data);
      }
    });
  };

  const getProduct = () => {
    axios.get("http://localhost:8080/products").then((data) => {
      if (data.status === 200) {
        setProducts(data.data);
      }
    });
  };

  useEffect(() => {
    getCategory();
    getProduct();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (value) => {
    axios.post("http://localhost:8080/products", value).then((data) => {
      if (data.status === 201) {
        handleClose();
        getProduct();
        reset();
      }
    });
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
    <Box p={3}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<AddCircleOutlineIcon />}
      >
        Add Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ width: "400px" }} spacing={2} mt={"10px"} mb="8px">
              <TextField
                fullWidth
                label="Product name"
                type="text"
                variant="outlined"
                required
                {...register("product_name")}
              />
              <TextField
                fullWidth
                label="Prodcut price"
                type="text"
                variant="outlined"
                required
                {...register("product_price")}
              />
              <TextField
                fullWidth
                label="Product image url"
                type="text"
                variant="outlined"
                required
                {...register("product_url")}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  {...register("category_id")}
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
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {category.length !== 0 &&
                category.map((item) => (
                  <Tab
                    key={item.id}
                    label={item.category_name}
                    value={String(item.id)}
                  />
                ))}
            </TabList>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {products.length !== 0 &&
              products.map((item) => (
                <TabPanel key={item.id} value={String(item.category_id)}>
                  <Card sx={{ maxWidth: 220, padding: "10px" }}>
                    <CardMedia
                      sx={{ height: 210 }}
                      image={item.product_url}
                      title={item.product_name}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="p"
                        fontSize={18}
                        component="div"
                      >
                        {item.product_name}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<DeleteIcon />}
                        onClick={() => {
                          if (token) {
                            deleteProduct(item.id);
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
                    </CardActions>
                    <Dialog open={modalOpen} onClose={handleCloseModal}>
                      <DialogTitle>Add Item</DialogTitle>
                      <DialogContent>
                        <form
                          onSubmit={(evt) => {
                            evt.preventDefault();
                            editForm(item.id);
                          }}
                        >
                          <Stack
                            sx={{ width: "400px" }}
                            spacing={2}
                            mt={"10px"}
                            mb="8px"
                          >
                            <TextField
                              fullWidth
                              label="Product name"
                              type="text"
                              variant="outlined"
                              required
                              inputRef={nameRef}
                              defaultValue={item.product_name}
                            />
                            <TextField
                              fullWidth
                              label="Prodcut price"
                              type="text"
                              variant="outlined"
                              inputRef={priceRef}
                              defaultValue={item.product_price}
                              required
                            />
                            <TextField
                              fullWidth
                              label="Product image url"
                              type="text"
                              inputRef={urlRef}
                              variant="outlined"
                              defaultValue={item.product_url}
                              required
                            />
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Company
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Company"
                                inputRef={selectRef}
                                defaultValue={item.category_id}
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
                  </Card>
                </TabPanel>
              ))}
          </Box>
        </TabContext>
      </Box>
    </Box>
  );
};

export default Product;
