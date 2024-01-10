import {React,useState} from 'react'
import { Link,useNavigate} from 'react-router-dom'
import {auth} from "../firebase-config";
import {signInWithEmailAndPassword} from "firebase/auth";

function Login() {
  const user=auth.currentUser;
  const navigate=useNavigate();
  const [data,setData] = useState({email:"",password:""});
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setData({...data,[name]:value});
  }
  const loginUser = async(e)=>{
    e.preventDefault();
    if(user){
      navigate("/profile");
      alert("First Log Out from your account");
      return;
    }
    try{
      await signInWithEmailAndPassword(auth,data.email,data.password)
      navigate('/searchtrain');
    }catch(error){
      setData({email:"",password:""});
      if (error.code === 'auth/invalid-credential') {alert('Invalid Credentials');}
      else if (error.code === 'auth/invalid-email') {alert('Invalid E-mail!');}
      else if (error.code === 'auth/network-request-failed') {alert('Without Network Connection!');}
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <Link to={"/"}>Home</Link><br />
      <Link to={"/signup"}>SignUp</Link><br />
      <Link to={"/#aboutUs"}>About Us</Link>
      <form onSubmit={loginUser}>
      <input name='email' placeholder='email' onChange={handleChange} value={data.email}/>
      <input name='password' placeholder='password' onChange={handleChange} value={data.password}/>
      <button type='submit'>LogIn</button>
      </form>
    </div>
  )
}

export default Login