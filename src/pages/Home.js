import {React,useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs'
import ContactUs from '../components/ContactUs'
import {auth} from "../firebase-config"
import {onAuthStateChanged} from "firebase/auth";
import Footer from '../components/Footer'
import Features from '../components/Features'

function Home() {
  const [user, setUser] = useState(null);  
  useEffect(()=>{
    onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);  
    });
  },[])
  return (
    <div>
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