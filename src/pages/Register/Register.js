import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { AuthContext } from "../../context/auth-context";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openPassword, setOpenPassword] = useState(false);

  const schema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string()
      .matches(
        "^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$",
        "This should match",
      )
      .required("Required"),
    password: Yup.string()
      .min(4, "Atleast 4")
      .max(8, "Less than 8")
      .required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const onSubmit = (value, evt) => {
    axios.post("http://localhost:8080/register", value).then((data) => {
      if (data.status === 201) {
        setToken(data.data.accessToken);
        setUser(data.data.user);
        navigate("/");
      }
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{ width: "600px", marginX: "auto", marginTop: 15, padding: "20px" }}
    >
      <Typography variant="h4" mb={2} component="h3" textAlign="center">
        Register
      </Typography>
      <Typography textAlign={"center"}>
        Already have account <Link to={"/login"}>login</Link>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} marginBottom="20px">
          <TextField
            label="Firstname"
            type="text"
            {...register("first_name")}
            helperText={errors.first_name?.message}
          />
          <TextField
            label="Lastname"
            type="text"
            {...register("last_name")}
            helperText={errors.last_name?.message}
          />
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type={openPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <RemoveRedEyeIcon
                  onClick={() => {
                    setOpenPassword((prev) => {
                      return !prev;
                    });
                  }}
                />
              ),
            }}
            {...register("password")}
            helperText={errors.password?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select label="gender" {...register("gender")}>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Button disabled={!isValid} type="submit" variant="contained">
          Outlined
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
