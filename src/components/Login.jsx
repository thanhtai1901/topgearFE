import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";
// import useAuth from "../hooks/useAuth";

const Login = () => {
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  //   const axiosPublic = useAxiosPublic();

  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
  
    login(email, password)
      .then((result) => {
        // Clear any previous error message
        seterrorMessage("");
        
        const user = result.user;
        const userInfor = {
          name: data.name,
          email: data.email,
          photoURL: result?.user?.photoURL,
        };
  
        axiosPublic.post("/users", userInfor)
          .then((response) => {
            alert("Đăng nhập thành công!");
            document.getElementById("my_modal_5").close();
            navigate('/');
          })
          .catch((error) => {
            console.error("Error storing user data:", error);
          });
          reset();
          navigate('/');
      })
      .catch((error) => {
        seterrorMessage("Please provide valid email & password!");
      });
  };
  
  // login with google

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          photoURL: result?.user?.photoURL,
        };
        axiosPublic.post("/users", userInfor).then((response) => {
          // console.log(response);
          alert("Đăng nhập thành công!");
          document.getElementById("my_modal_5").close();
          navigate(from, { replace: true });
        });
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-4 sm:my-20">
      <div className="mb-5">
        <form
          className="card-body"
          method="dialog"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="font-bold text-lg">Đăng nhập!</h3>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email")}
            />
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Mật khẩu</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              {...register("password", { required: true })}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Quên mật khẩu?
              </a>
            </label>
          </div>

          {/* show errors */}
          {errorMessage ? (
            <p className="text-red text-xs italic">
              Vui lòng nhập đúng tài khoản or mật khẩu
            </p>
          ) : (
            ""
          )}

          {/* submit btn */}
          <div className="form-control mt-4">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="Login"
            />
          </div>

          {/* close btn */}
          {/* <Link to="/">
            <div
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </div></Link> */}  

          <p className="text-center my-2">
            Chưa có tài khoản?
            <Link to="/signup" className="underline text-red ml-1">
              Đăng kí
            </Link>
          </p>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
