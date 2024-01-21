import { React, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth } from "../firebase-config"

function Navbar(props) {
  const url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const user = auth.currentUser;
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
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-3">
          <div class="relative flex h-20 items-center justify-center">
            {/* <div class="relative flex flex-1"> */}
              <div class="absolute left-0 flex flex-shrink-0 items-center">
                {/* <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" /> */}
                {/* <img class="h-8 w-auto" src="" alt="Your Company" /> */}
                <img class="h-10 w-auto" src=".././IRCTC-Color.svg" alt="" />
              </div>
              <div class="relative flex justify-center">
              <div class="hidden sm:block">
                <div class="flex space-x-4">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  {
                    props.navbar.map((element)=>{
                      return(
                        <>
                          <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={element[1]}>{element[0]}</Link>
                        </> 
                      )
                    })
                  }
                  {props.aboutus && <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("aboutUs") }}>About Us</Link> }
                  {props.contactus && <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>Contact Us</Link> }                  
                </div>
              </div>
              </div>
              <div class="absolute right-1 sm:ml-6 sm:pr-0">
                <div class="relative ml-3">
                  <div>
                    <Link to="/profile"><button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <img class="h-8 w-8 rounded-full" src={user && user.photoURL ? user.photoURL : url} alt="" />
                    </button></Link>
                  </div>
                </div>
              </div>
            {/* </div> */}
          </div>

          {/* <!-- Mobile menu, show/hide based on menu state. --> */}
          <div class="sm:hidden" id="mobile-menu">
            <div class="space-y-1 px-2 pb-3 pt-2">
            {
                    props.navbar.map((element)=>{
                      return(
                        <>
                          <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={element[1]}>{element[0]}</Link><br/>
                        </> 
                      )
                    })
                  }
                  {props.aboutus && <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("aboutUs") }}>About Us</Link> }<br/>
                  {props.contactus && <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>Contact Us</Link> } <br/>
            </div>
          </div>
        </div>
      </nav>


    </div>
  )
}

export default Navbar