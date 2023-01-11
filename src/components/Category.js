import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Stack } from "@mui/system";
import axios from "axios";

import { Categorytable } from "./CartCard";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Category = () => {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);

  const categoryRef = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    axios
      .post("http://localhost:8080/category", {
        category_name: categoryRef.current.value,
      })
      .then((data) => {
        if (data.status === 201) {
          handleClose();
          getCategory();
          categoryRef.current.value = "";
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

  const getCategory = () => {
    axios.get("http://localhost:8080/category").then((data) => {
      if (data.status === 200) {
        setCategory(data.data);
      }
    });
  };

  useEffect(() => {
    getCategory();
    getProduct();
  }, []);

  return (
    <Box p={3}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<AddCircleOutlineIcon />}
      >
        Add Category
      </Button>

      <TableContainer sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Category Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category.length !== 0 &&
              category.map((item) => {
                const result = products.filter(
                  (product) => product.category_id == item.id,
                );
                return (
                  <Categorytable
                    key={item.id}
                    {...item}
                    result={result}
                    products={products}
                    getCategory={getCategory}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Add Category"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextField
                sx={{ marginTop: "5px", width: "400px", marginBottom: "5px" }}
                inputRef={categoryRef}
                label="Enter category"
                type="text"
              />
            </Stack>
            <Button type="submit" variant="text">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Category;
