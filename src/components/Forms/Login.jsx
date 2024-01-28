import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Wave from "../img/wave.svg";
import classes from "./Forms.module.css";

const Login = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user && userCredential.user.emailVerified)
        navigate("/");
    } catch (error) {
      console.error(error);
      setErr(true);
    }
    setLoading(false);
  };

  return (
    <section className={classes.formBlock}>
      {/* NAVBAR */}
      <div className={classes.formContainer}>
        <div className={classes.formBgc}>
          <img src={Wave} alt="Wave Image" />
        </div>

        <form className={classes.form} onSubmit={handleSubmit}>
          <h2 className={classes.formTitle}>LOGIN</h2>
          <label htmlFor="email">E-mail</label>
          <input
            className={classes.formInput}
            type="email"
            id="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            className={classes.formInput}
            type="password"
            id="password"
            required
          />

          {err && <span>Something went wrong!</span>}
          <button type="submit" clasName={classes.formBtn}>
            {!loading && "COME BACK ON WAVE"}
            {loading && "BIG WAVE IS COMING..."}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
