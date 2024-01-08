import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth,db} from "../firebase-config";
import {doc,setDoc} from "firebase/firestore";
import {useState} from 'react';

function Signup() {
  const navigate=useNavigate();
  const [data,setData] = useState({email:"",password:""});
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setData({...data,[name]:value});
  }
  const registerUser = async(e)=>{
    e.preventDefault();
    try{
      const result= await createUserWithEmailAndPassword(auth,data.email,data.password)
      await setDoc(doc(db,"users",result.user.uid),{email:data.email,password:data.password});
      await setDoc(doc(db,"booklist",result.user.uid),{});
      navigate('/searchtrain')
    }catch(error){
      setData({email:"",password:""});
      if (error.code === 'auth/email-already-in-use') {alert('Email already in use');}
      else if (error.code === 'auth/invalid-email') {alert('Invalid E-mail!');}
      else if (error.code === 'auth/weak-password') {alert('Password should be at least 6 characters!');}
      else if (error.code === 'auth/network-request-failed') {alert('Without Network Connection!');}
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={registerUser}>
      <input name='email' placeholder='email' onChange={handleChange} value={data.email}/>
      <input name='password' placeholder='password' onChange={handleChange} value={data.password}/>
      <button type='submit'>SignUp</button>
      </form>
      <Link to={"/"}>Home</Link>
      <h4>Already a User?</h4><Link to="/login">Login</Link>
    </div>
  )
}

export default Signup