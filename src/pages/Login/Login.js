import { Button, Paper, TextField, Typography } from "@mui/material";
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

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(UserContext);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openPassword, setOpenPassword] = useState(false);

  const schema = Yup.object({
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

  const onSubmit = (value) => {
    axios
      .post("http://localhost:8080/login", value)
      .then((data) => {
        if (data.status === 200) {
          setToken(data.data.accessToken);
          setUser(data.data.user);
          navigate("/");
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data);
      });
  };

  return (
    <Paper
      elevation={2}
      sx={{ width: "600px", marginX: "auto", marginTop: 15, padding: "20px" }}
    >
      <Typography variant="h4" mb={2} component="h3" textAlign="center">
        Login
      </Typography>
      <Typography
        textAlign={"center"}
        color={!errorMessage ? "black" : "error"}
      >
        {!errorMessage ? "Do you have an account " : `${errorMessage} Please `}
        <Link to="/register">register</Link>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} marginBottom="20px">
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
        </Stack>

        <Button disabled={!isValid} type="submit" variant="contained">
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
