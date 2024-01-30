import {React,useState,useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs'
import ContactUs from '../components/ContactUs'
import {auth} from "../firebase-config"
import {onAuthStateChanged} from "firebase/auth";
import Footer from '../components/Footer'
import Features from '../components/Features'
import Alert from '../components/Alert'

function Home() {
  const location=useLocation();
  const navigate=useNavigate();
  const [user, setUser] = useState(null); 
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  } 
  useEffect(()=>{
    onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);  
    });
    if(location.state){
      showAlert(location.state.msg,location.state.type);
      navigate("/");
    }
  },[])
  return (
    <div>
      <Alert alert={alert}/>
      <Navbar navbar={[["Login","/login"],["Register","/signup"]]} aboutus={true} contactus={true}/>
      <h4>{user?.email}</h4>
      <Features/>
      <AboutUs/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default Home