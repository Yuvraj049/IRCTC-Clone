import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

function Signup() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  }
  const registerUser = async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    const passwordValue = passwordInput.value;
    let validityMessage = "";
    if (/\s/.test(passwordValue)) {
      validityMessage = "Password must not contain spaces";
    }
    else if (passwordValue.length < 6) {
      validityMessage = "Password must contain at least 6 characters";
    }
    if(validityMessage!==""){
      showAlert(validityMessage,"danger");
      setData({password: "" });
      return;
    }


    if (user) {
      navigate("/profile");
      window.alert("First Log Out from your account");
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await setDoc(doc(db, "users", result.user.uid), { email: data.email, password: data.password });
      await setDoc(doc(db, "booklist", result.user.uid), {});
      navigate('/profile',{state:{msg:"Registered Successfully",type:"success"}});
    } catch (error) {
      setData({ email: "", password: "" });
      if (error.code === 'auth/email-already-in-use') { showAlert('Email Already in Use!',"danger"); }
      else if (error.code === 'auth/invalid-email') { showAlert('Invalid E-mail!',"danger"); }
      else if (error.code === 'auth/weak-password') { showAlert('Password should be at least 6 characters!','warning'); }
      else if (error.code === 'auth/network-request-failed') { showAlert('No Network Connection!','danger'); }
      console.log(error.message);
    }
  };
  const [alert, setAlert] = useState(null);
    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 3000);
  }
  return (
    <div>
      {/* <form onSubmit={registerUser}> */}
      {/* <input name='email' placeholder='email' onChange={handleChange} value={data.email}/> */}
      {/* <input name='password' placeholder='password' onChange={handleChange} value={data.password}/> */}
      {/* <button type='submit'>SignUp</button> */}
      {/* </form> */}


      <Alert alert={alert}/>
      <Navbar navbar={[["Home","/"],["Login","/login"],["AboutUs","/#aboutUs"]]}/>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register your account</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={registerUser}>
            <div>
            <div className="flex items-center justify-between">
              <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            </div>
              <div className="mt-2">
                <input name='email' onChange={handleChange} value={data.email} required className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div className="mt-2">
              <input type="password" id='password' name="password"  onChange={handleChange} value={data.password} required  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div>
              <button type='submit' className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
          Already a User?&nbsp;<Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup