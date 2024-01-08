import React from 'react'
import { Link } from 'react-router-dom'
// const scrollTo = (value) => {
//     const aboutUsSection = document.getElementById(value);

//     if (aboutUsSection) {
//       aboutUsSection.scrollIntoView({
//         behavior: 'smooth',
//       });
//     }
// };
function Navbar() {
  return (
    <div>
        {/* <Link to="/">Home</Link> */}
        <Link to="/login">Login</Link><br />
        <Link to="/signup">Signup</Link><br />
        <Link to={"/searchtrain"}>SearchTrain</Link><br />
        <Link to={"/profile"}>Profile</Link><br />
        <Link to={"/booklist"}>BookList</Link><br />
        <a href="#aboutUs" >About Us</a><br />
        <a href="#contactUs">Contact Us</a>
        {/* <Link onClick={()=>{scrollTo("contactUs")}}>Contact us</Link> */}
    </div>
  )
}

export default Navbar