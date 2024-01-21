import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db, storage } from "../firebase-config"
import { onAuthStateChanged, updateProfile, signOut, deleteUser } from "firebase/auth";
import { updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Radiobuttons from '../components/Radiobuttons'
import Navbar from '../components/Navbar';

function UserProfile() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", phone: "", dob: "", gender: "" });
  const [user, setUser] = useState(null);
  if (user) {
    console.log(user.photoURL);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      console.log(user);
      if (!currentUser) {
        navigate("/");
      }
      setUser(currentUser);
    })
  }, [])
  useEffect(() => {
    const setUserData = async () => {
      const userDoc = doc(db, "users", user.uid);
      const result = await getDoc(userDoc);
      setData(result.data());
    }
    if (user) {
      setUserData();
    }
  }, [user])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const userDoc = doc(db, "users", user.uid);
    console.log(data);
    const newFields = { name: data.name, phone: Number(data.phone), dob: data.dob, gender: data.gender, state: data.state };
    console.log(newFields);
    updateDoc(userDoc, newFields);
    alert("Profile Updated");
  }
  const [photo, setPhoto] = useState(null)
  const url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }
  const handleUpload = async () => {
    const fileRef = ref(storage, user.uid + ".png");
    await uploadBytes(fileRef, photo)
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, { photoURL: photoURL })
    alert("Profile Photo Updated");
    window.location.reload();
  }
  const logOut = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
    console.log(`${user.email} logged out`);
  }
  const deleteAccount = () => {
    if (window.confirm("Do you really want to delete your account?")) {
      deleteUser(user).then(() => {
        console.log(`deleted ${user.email}`);
      }).catch((error) => {
        alert("Requires Recent Login!")
        console.log(error);
        return;
      });
      const userDoc = doc(db, "users", user.uid);
      const userBookList = doc(db, "booklist", user.uid);
      deleteDoc(userDoc);
      deleteDoc(userBookList);

      const desertRef = ref(storage, `${user.uid}.png`);
      deleteObject(desertRef).then(() => {
        navigate("/");
        console.log("first")
      }).catch((error) => {
        console.log(error.message);
      });
    }
  }
  return (
    <div>
      <Navbar navbar={[["Home", "/"], ["SearchTrain", "/searchtrain"], ["BookList", "/booklist"], ["AboutUs", "/#aboutUs"]]} />
      {/* <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder='name' onChange={handleChange} value={data.name} required/>
        <input type="email" placeholder='email' defaultValue={user?.email} readOnly/>
        <input type="number" name="phone" placeholder='phone number' onChange={handleChange} value={data.phone} required/>
        <input type="date" name="dob"  onChange={handleChange} value={data.dob} required/>
        <Radiobuttons handleChange={handleChange} data={data}/>
        <button type='submit'>Update</button><br />
      </form>
      <input type="file" placeholder='image' onChange={handleFileChange}/>
      <button onClick={handleUpload}>Upload</button>
      <img src={user && user.photoURL?user.photoURL:url} alt="Avatar" className='avatar'/><br /><br /><br /><br />
      <button onClick={logOut}>LogOut</button>
      <button onClick={deleteAccount}>Delete Account</button> */}

      <div class=" relative grid grid-cols-2 max-w-7xl">
        <div class="flex mt-20 h-screen justify-center w-2/5 absolute left-20">
          <div class="absolute w-1/2 right-5">
            <div class="bg-white shadow-xl rounded-lg py-3">
              <div class="flex justify-center photo-wrapper p-2">
                <img class="w-32 h-32 rounded-full mx-auto" src={user && user.photoURL ? user.photoURL : url} />
              </div>
              <div class="p-2">
                <h3 class="text-center text-xl text-gray-900 font-medium leading-8">{data.name}</h3>
                <div class="text-center text-gray-400 text-xs font-semibold">
                  <p></p>
                </div>
                <table class="flex text-xs my-3 justify-center">
                  <tbody><tr>
                    <td class="px-2 py-2 text-gray-500 font-semibold">Email:</td>
                    <td class="px-2 py-2">{user?.email}</td>
                  </tr>
                    <tr>
                      <td class="px-2 py-2 text-gray-500 font-semibold">Phone:</td>
                      <td class="px-2 py-2">{data.phone}</td>
                    </tr>
                  </tbody></table>
              </div>
            </div>
            <label class="block">
              <input onChange={handleFileChange} type="file" class="mt-3 block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:file:bg-blue-500 dark:hover:file:bg-blue-400 "/>
            </label>
            <div class="relative mt-3">
              <button onClick={handleUpload} class=" mt-2 cursor-pointer flex items-center gap-4  pl-8 before:border-gray-900/60 hover:before:border-gray-300 
                group dark:before:bg-darker dark:hover:before:border-gray-900 before:bg-gray-300 dark:before:border-gray-600 before:absolute before:inset-0 before:rounded-3xl
                 before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                <div class="relative">
                  <img class="w-10" src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon" width="512" height="512" />
                </div>
                <div class="relative">
                  <span class="block text-base font-semibold relative text-black dark:text-black group-hover:text-blue-500">
                    Update Picture
                  </span>
                </div>
              </button>
            </div>
            <button onClick={logOut} type="button" class="w-3/4 mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log Out</button>
            <button onClick={deleteAccount} type="button" class="w-3/4 mt-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Account</button>
          </div>
        </div>



        <div class="flex items-center justify-center p-12 absolute right-0">
          <div class="mx-auto w-full max-w-[550px] bg-white">
            <form onSubmit={handleSubmit}>
              <div class="mb-5">
                <label for="name" class="mb-3 block text-base font-medium text-[#07074D]">
                  Full Name
                </label>
                <input type="text" name="name" placeholder='Enter Name' onChange={handleChange} value={data.name} required
                  class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
              </div>
              <div class="mb-5">
                <label for="phone" class="mb-3 block text-base font-medium text-[#07074D]">
                  Phone Number
                </label>
                <input type="number" name="phone" placeholder='Enter Phone Number' onChange={handleChange} value={data.phone} required
                  class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
              </div>
              <div class="mb-5">
                <label for="email" class="mb-3 block text-base font-medium text-[#07074D]">
                  Email Address
                </label>
                <input type="email" defaultValue={user?.email} readOnly
                  class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
              </div>
              <div class="mb-12 pt-3">
                <label for="time" class="mb-3 block text-base font-medium text-[#07074D]">
                  Gender
                </label>
                <Radiobuttons handleChange={handleChange} data={data} />
              </div>
              <div class="mx-3 flex flex-wrap">
                <div class="w-full px-3 sm:w-1/2">
                  <div class="mb-5">
                    <label for="date" class="mb-3 block text-base font-medium text-[#07074D]">
                      Date
                    </label>
                    <input type="date" name="dob" onChange={handleChange} value={data.dob} required
                      class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                </div>
                <div class="w-full px-3 sm:w-1/2">
                  <div class="mb-5">
                    <label for="time" class="mb-3 block text-base font-medium text-[#07074D]">
                      State
                    </label>
                    <input type="text" name="state" placeholder='Enter your State' onChange={handleChange} value={data.state} required
                      class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                </div>
              </div>
              <div>
                <button type="submit" class="mt-4 w-full rounded-md bg-[#6A64F1] hover:bg-[#8b5cf6] py-3 px-8 text-center text-base font-semibold text-white outline-none">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}

export default UserProfile