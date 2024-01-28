import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Wave from "../../assets/wave.svg";
import classes from "./Forms.module.css";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`); //TU POPATRZEC CZY MOZNA TO ZROBIC UUID

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            const notesCollectionRef = collection(db, "notes");
            const newNoteDocRef = doc(notesCollectionRef, res.user.uid);
            await setDoc(newNoteDocRef, { notes: [] });

            await sendEmailVerification(res.user);

            navigate("/");
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
            setErr(true);
          }
        });
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(true);
    }
  };

  return (
    <section className={classes.formBlock}>
      {/* NAVBAR */}
      <div className={classes.formContainer}>
        <div className={classes.formBgc}>
          <img src={Wave} alt="Wave Image" />
        </div>

        <form className={classes.form} onSubmit={handleSubmit}>
          <h2 className={classes.formTitle}>SIGN UP FOR FREE</h2>
          <label htmlFor="name">Name</label>
          <input className={classes.formInput} type="text" id="name" required />

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

          <input type="file" id="avatar" className={classes.formFileUpload} />
          <label htmlFor="avatar" className={classes.formFileUploadLabel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span>Upload an avatar!</span>
          </label>
          {err && <span>Something went wrong!</span>}
          {loading && (
            <input
              className={classes.formBtn}
              type="submit"
              value="WE ARE LOOKING FOR WAVE..."
              disabled
            />
          )}
          {!loading && (
            <input
              className={classes.formBtn}
              type="submit"
              value="JUMP ON THE WAVE!"
            />
          )}
        </form>
      </div>
    </section>
  );
};

export default Register;
