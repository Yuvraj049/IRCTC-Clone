import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

function Login() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  }
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
  const loginUser = async (e) => {
    e.preventDefault();
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
    try{
      await signInWithEmailAndPassword(auth, data.email, data.password)
      navigate('/profile',{state:{msg:"Logged Successfully",type:"success"}});
    } catch (error) {
      setData({ email: "", password: "" });
      if (error.code === 'auth/invalid-email') { showAlert('Invalid Email!',"danger"); }
      else if (error.code === 'auth/invalid-credential') { showAlert('Invalid Credentials!',"danger"); }
      else if (error.code === 'auth/network-request-failed') { showAlert('Network Request Failed!',"danger"); }
      console.log(error.message);
    }
  };
  return (
    <div>
      <Alert alert={alert}/>
      <Navbar navbar={[["Home","/"],["Register","/signup"],["AboutUs","/#aboutUs"]]}/>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login in to your account</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={loginUser}>
            <div>
              <div className="flex items-center justify-between">
                <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              </div>
              <div className="mt-2">
                <input name='email' onChange={handleChange} value={data.email} required className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div className="mt-2">
                <input type="password" id='password' name='password' onChange={handleChange} value={data.password}  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div>
              <button type='submit' className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign In</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not Registered?&nbsp;<Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login