import {React,useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs'
import ContactUs from '../components/ContactUs'
import {auth} from "../firebase-config"
import {onAuthStateChanged} from "firebase/auth";

function Home() {
  const [user, setUser] = useState(null);  
  useEffect(()=>{
    onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);  
    });
  },[])
  return (
    <div>
      <h1>Home</h1>
      <h4>{user?.email}</h4>
      <Navbar/>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <AboutUs/>
      <ContactUs/>
    </div>
  )
}

export default Home