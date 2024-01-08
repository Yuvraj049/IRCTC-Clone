import {React,useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {auth,db,storage} from "../firebase-config"
import {onAuthStateChanged,updateProfile,signOut,deleteUser} from "firebase/auth";
import {updateDoc,doc,getDoc,deleteDoc} from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL,deleteObject} from "firebase/storage";
import Radiobuttons from '../components/Radiobuttons'

function UserProfile() {
    const navigate=useNavigate();
    const [user, setUser] = useState(null); 
    useEffect(()=>{
      onAuthStateChanged(auth,(currentUser)=>{
        setUser(currentUser); 
      })
    },[])

    const [data,setData] = useState({name:"",email:"",phone:0,dob:"",gender:""});
    
    useEffect(()=>{
      const setUserData=async()=>{
        const userDoc = doc(db,"users",user.uid);
        const result =await getDoc(userDoc);
        setData(result.data());
        console.log(result.data());
      }
      if(user){
        setUserData();
      };
    },[user])

    const handleChange=(e)=>{
      const name=e.target.name;
      const value=e.target.value;
      setData({...data,[name]:value});
    }
    const handleSubmit=(e)=>{
      e.preventDefault();
      const userDoc = doc(db,"users",user.uid);
      const newFields = {name:data.name,phone:Number(data.phone),dob:data.dob,gender:data.gender};
      console.log(newFields);
      updateDoc(userDoc,newFields);
      alert("Profile Updated");
    }
    const [photo, setPhoto] = useState(null)
    const [photoURL, setPhotoURL] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")

    const handleFileChange=(e)=>{
      if(e.target.files[0]){
        setPhoto(e.target.files[0]);
      }
    }
    const handleUpload=async()=>{
      const fileRef = ref(storage,user.uid+".png");
      await uploadBytes(fileRef,photo)
      const photoURL=await getDownloadURL(fileRef);
      updateProfile(user,{photoURL:photoURL})
      alert("Profile Photo Updated");
      window.location.reload();
    }
    const logOut=()=>{
        signOut(auth);
        console.log(`${user.email} logged out`);
        navigate("/");
    }
    const deleteAccount= ()=>{
      if(window.confirm("Do you really want to delete your account?")){
        const userDoc = doc(db,"users",user.uid);
        const userBookList = doc(db,"booklist",user.uid);
        deleteDoc(userDoc);
        deleteDoc(userBookList);
        
        const desertRef = ref(storage, `${user.uid}.png`);
        deleteObject(desertRef).then(() => {
          console.log("first")
        }).catch((error) => {
          console.log(error.message);
        });
        
        deleteUser(user).then(() => {
          console.log(`deleted ${user.email}`);
        }).catch((error) => {
          console.log(error);
        });
        navigate("/");
      }
    }
    useEffect(()=>{
      if(user?.photoURL){
        setPhotoURL(user.photoURL);
      }
    },[user]);
  return (
    <div>
      <h2>UserProfile</h2>
      <h4>{user?.email}</h4>
      <Link to="/">Home</Link><br />
      <Link to="/searchtrain">SearchTrain</Link><br />
      <Link to="/booklist">BookList</Link>
      
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder='name' onChange={handleChange} value={data?.name}/>
        <input type="email" placeholder='email' defaultValue={user?.email} readOnly/>
        <input type="number" name="phone" placeholder='phone number' onChange={handleChange} value={data?.phone}/>
        <input type="date" name="dob"  onChange={handleChange} value={data?.dob}/>
        <Radiobuttons handleChange={handleChange} data={data}/>
        <button type='submit'>Update</button><br />
      </form>
      <input type="file" placeholder='image' onChange={handleFileChange}/>
      <button onClick={handleUpload}>Upload</button>
      <img src={photoURL} alt="Avatar" className='avatar'/><br /><br /><br /><br />
      <button onClick={logOut}>LogOut</button>
      <button onClick={deleteAccount}>Delete Account</button>
    </div>
  )
}

export default UserProfile