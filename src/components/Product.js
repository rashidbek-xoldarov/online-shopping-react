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
import { CardProduct } from "./CartCard";

const Product = () => {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [value, setValue] = React.useState("1");

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
                  <CardProduct
                    {...item}
                    getProduct={getProduct}
                    category={category}
                  />
                </TabPanel>
              ))}
          </Box>
        </TabContext>
      </Box>
    </Box>
  );
};

export default Product;
