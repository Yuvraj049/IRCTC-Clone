import { React, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth, db, storage } from "../firebase-config"
import { onAuthStateChanged, updateProfile, signOut, deleteUser } from "firebase/auth";
import { updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Radiobuttons from '../components/Radiobuttons'
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';
import DialogBox from '../components/DialogBox';

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  //  for DOB
  const today = new Date().toISOString().split('T')[0];

  const [data, setData] = useState({ name: "", email: "", phone: "", dob: "", gender: "" });
  const [user, setUser] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      }
      setUser(currentUser);
    })
    if(location.state){
      showAlert(location.state.msg,location.state.type);
      navigate("/profile");
    }
  }, []);

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
    window.scrollTo({top:0,behavior:"smooth"});
    showAlert("Profile Updated",'success');
  }
  const [photo, setPhoto] = useState(null)
  const url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    } else {
      e.target.value = "";
      window.scrollTo({top:0,behavior:"smooth"});
      showAlert("Please upload the right extension format.", "danger");
    }
  }
  const handleUpload = async () => {
    if (!photo) {
      window.scrollTo({top:0,behavior:"smooth"});
      showAlert("Please upload an Image", "danger");
      return;
    }
    const fileRef = ref(storage, user.uid + ".png");
    console.log(fileRef);
    await uploadBytes(fileRef, photo)
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, { photoURL: photoURL })
    window.scrollTo({top:0,behavior:"smooth"});
    showAlert("Profile Photo Updated","success");
  }
  
  const logOut = () => {
    signOut(auth).then(() => {
      navigate('/',{state:{msg:"Logged Out SuccessFully",type:"success"}});
      window.scrollTo({top:0});
    });
    console.log(`${user.email} logged out`);
  }

  const deleteAccount = () => {
      const userDoc = doc(db, "users", user.uid);
      const userBookList = doc(db, "booklist", user.uid);
      const desertRef = ref(storage, `${user.uid}.png`);

      console.log(userDoc);
      console.log(userBookList);

      deleteDoc(userDoc);
      deleteDoc(userBookList);
      deleteObject(desertRef).then(() => {
      }).catch((error) => {
        console.log(error.message);
      });

      deleteUser(user).then(() => {
        navigate('/',{state:{msg:"Account Deleted SuccessFully",type:"success"}});
        console.log(`deleted ${user.email}`);
      }).catch((error) => {
          window.alert("Requires Recent Login!")
          console.log(error);
          return;
      });
    }
  return (
    <div>
      <Alert alert={alert}/>
      {showModal && <DialogBox setShowModal={setShowModal} action={deleteAccount} msg={"Are you sure you want to delete your Account?"}/>}
      <Navbar navbar={[["Home", "/"], ["Search Train", "/searchtrain"], ["Book List", "/booklist"], ["About Us", "/#aboutUs"]]} />
      <h1 class="mt-5 text-3xl font-bold">User Profile</h1>
      <div class=" relative grid grid-cols-2 max-w-7xl">
        <div class="flex mt-20 h-screen justify-center w-2/5 absolute left-20">
          <div class="absolute w-3/5 right-5">
            <div class="bg-white shadow-xl rounded-lg py-3">
              <div class="flex justify-center photo-wrapper p-2">
                <img class="w-32 h-32 rounded-full mx-auto" src={user && user.photoURL ? user.photoURL : url} />
              </div>
              <div class="p-2">
                <h3 class="text-center text-2xl text-gray-900 font-medium leading-8">{data?.name}</h3>
                <div class="text-center text-gray-400 text-xs font-semibold">
                </div>
                <table class="flex text-xs my-3 justify-center">
                  <tbody><tr>
                    <td class="px-2 py-2 text-base text-gray-500 font-bold">Email:</td>
                    <td class="px-2 py-2 text-base">{user?.email}</td>
                  </tr>
                    <tr>
                      <td class="px-2 py-2 text-base text-gray-500 font-bold">Phone:</td>
                      <td class="px-2 py-2 text-base">{data?.phone}</td>
                    </tr>
                  </tbody></table>
              </div>
            </div>
            <input onChange={handleFileChange}  class="mt-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input>
            <div class="w-3/5 relative mt-3 m-auto">
              <button onClick={handleUpload} class="mt-2 cursor-pointer flex items-center gap-4 py-1 pl-4 before:border-gray-900/60 hover:before:border-gray-300 
                group dark:before:bg-darker dark:hover:before:border-gray-900 before:bg-gray-300 dark:before:border-gray-600 before:absolute before:inset-0 before:rounded-3xl
                 before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                <div class="relative">
                  <img class="w-9" src="https://www.svgrepo.com/show/485545/upload-cicle.svg" alt="file upload icon"/>
                </div>
                <div class="relative">
                  <span class="block text-sm font-semibold relative text-black dark:text-black group-hover:text-blue-500">
                    Update Picture
                  </span>
                </div>
              </button>
            </div>
            <button onClick={logOut} type="button" class="w-1/2 mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log Out</button>
            <button onClick={()=>{window.scrollTo({top:0});setShowModal(true)}} type="button" class="w-1/2 mt-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Account</button>
          </div>
        </div>

        <div class="flex items-center justify-center p-12 absolute right-0">
          <div class="mx-auto w-full max-w-[550px] bg-white">
            <form onSubmit={handleSubmit}>
              <div class="mb-5">
                <label for="name" class="mb-3 block text-base font-medium text-[#07074D]">
                  Full Name
                </label>
                <input type="text" name="name" placeholder='Enter Name' onChange={handleChange} value={data?.name} required
                  class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
              </div>
              <div class="mb-5">
                <label for="phone" class="mb-3 block text-base font-medium text-[#07074D]">
                  Phone Number
                </label>
                <input type="number" name="phone" placeholder='Enter Phone Number' onChange={handleChange} value={data?.phone} required
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
                    <input type="date" name="dob" onChange={handleChange} min={today} value={data?.dob} required
                      class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                </div>
                <div class="w-full px-3 sm:w-1/2">
                  <div class="mb-5">
                    <label for="time" class="mb-3 block text-base font-medium text-[#07074D]">
                      State
                    </label>
                    <input type="text" name="state" placeholder='Enter your State' onChange={handleChange} value={data?.state} required
                      class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                  </div>
                </div>
              </div>
              <div>
                <button type="submit" class="mt-4 w-full rounded-md bg-[#6A64F1] hover:bg-[#8b5cf6] py-2 px-8 text-center text-lg font-semibold text-white outline-none">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile