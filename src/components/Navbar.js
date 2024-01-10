import {React,useEffect} from 'react'
import { Link} from 'react-router-dom'

function Navbar() {
  useEffect(() => {
    const hash = window.location.hash;
    scrollTo(hash.substring(1));
  }, []);
  const scrollTo = (value) => {
      const aboutUsSection = document.getElementById(value);
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({
          behavior: 'smooth',
        });
      }
  };
  return (
    <div>
        <Link to="/login">Login</Link><br />
        <Link to="/signup">Signup</Link><br />
        <Link to={"/searchtrain"}>SearchTrain</Link><br />
        <Link to={"/profile"}>Profile</Link><br />
        <Link to={"/booklist"}>BookList</Link><br />
        <Link onClick={()=>{scrollTo("contactUs")}}>About Us</Link><br />
        <Link onClick={()=>{scrollTo("contactUs")}}>Contact Us</Link><br />
    </div>
  )
}

export default Navbar