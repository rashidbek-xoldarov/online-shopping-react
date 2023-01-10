import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Stack } from "@mui/system";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Category = () => {
  const [open, setOpen] = React.useState(false);
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);

  const categoryRef = useRef();
  const editRef = useRef();

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

  const deleteCategory = (id) => {
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

  useEffect(() => {
    getCategory();
    getProduct();
  }, []);

  const editHandler = (id) => {
    console.log(id);
  };

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
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.category_name}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          deleteCategory(item.id);
                        }}
                        disabled={result.length > 0 ? false : true}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {/* <IconButton
                        onClick={() => {
                          setEditModal(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton> */}
                      <Dialog
                        open={editModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => {
                          setEditModal(false);
                        }}
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle>{"Add Category"}</DialogTitle>
                        <DialogContent>
                          <form
                            onSubmit={(evt) => {
                              evt.preventDefault();
                              console.log(item.id);
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
