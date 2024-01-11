import { React, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {auth} from "../firebase-config"

function Navbar() {
  const url="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const user=auth.currentUser;
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
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-20 items-center justify-between">
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex flex-shrink-0 items-center ml-4">
                {/* <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" /> */}
                {/* <img class="h-8 w-auto" src="" alt="Your Company" /> */}
                <img class="h-10 w-auto" src=".././IRCTC-Color.svg" alt="" />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4 ml-20">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to="/login">Login</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to="/signup">Signup</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/searchtrain"}>SearchTrain</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/profile"}>Profile</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/booklist"}>BookList</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>About Us</Link><br />
                  <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>Contact Us</Link><br />
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <!-- Profile dropdown --> */}
              <div class="relative ml-3">
                <div>
                  <button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <img class="h-8 w-8 rounded-full" src={user && user.photoURL?user.photoURL:url} alt=""/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2">
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to="/login">Login</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to="/signup">Signup</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/searchtrain"}>SearchTrain</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/profile"}>Profile</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" to={"/booklist"}>BookList</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>About Us</Link><br />
            <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" onClick={() => { scrollTo("contactUs") }}>Contact Us</Link><br />
          </div>
        </div>
      </nav>


    </div>
  )
}

export default Navbar