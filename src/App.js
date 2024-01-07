import './App.css';
import {createUserWithEmailAndPassword,signOut,signInWithEmailAndPassword,deleteUser, updateProfile
} from "firebase/auth";
import {auth,db,storage} from "./firebase-config";
import {collection,getDocs,updateDoc, doc ,deleteDoc,setDoc,getDoc,arrayUnion,arrayRemove} from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {useState,useEffect} from 'react';
import Radiobuttons from './components/Radiobuttons';
import Search from './components/Search';
// import SearchAPI from './SearchAPI';

function App() {
  // Authentication Only
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [users, setUsers] = useState([]);
  const usersCollectionRef=collection(db,"users");

  useEffect(()=>{
    const getUser=async()=>{
      const data=await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc)=>({...doc.data(),id:doc.id})));
    }
    getUser();
  },[])
  useEffect(()=>{
    const user = auth.currentUser;
    if(user){
    const userDoc = doc(db,"users",user.uid);
    const userBookList = doc(db,"bookList",user.uid);
    setUserData(userDoc,userBookList);
    }
  },[auth.currentUser])

  const register = async()=>{
    try{
      const result= await createUserWithEmailAndPassword(auth,registerEmail,registerPassword)
      await setDoc(doc(db,"users",result.user.uid),{email:registerEmail,password:Number(registerPassword)});
      await setDoc(doc(db,"bookList",result.user.uid),{});
    }catch(error){
      console.log(error.message);
    }
  };
  
  const login = async()=>{
    try{
      const user= await signInWithEmailAndPassword(auth,loginEmail,loginPassword)
      console.log(user.email);
    }catch(error){
      console.log(error.message);
    }
  };

  const logOut=()=>{
    signOut(auth);
  };

  // const createDocument = async()=>{
  //   await addDoc(usersCollectionRef,{name:newName,age:Number(newAge)});
  // };
  const updateDocument = async(user)=>{
    const userDoc = doc(db,"users",user.id);
    const newFields = {email:user.email,password: user.password+1};
    await updateDoc(userDoc,newFields);
  };
  const deleteDocument = async(user)=>{
    const userDoc = doc(db,"users",user.id); //any user
    await deleteDoc(userDoc);
  };
  
  
  //Fetch API
  // const [results, setResults] = useState([]);

  //Delete Current User from Auth
  const deleteCurrentUser= ()=>{
    const user = auth.currentUser;
    const userDoc = doc(db,"users",user.uid);
    deleteDoc(userDoc);
    
    deleteUser(user).then(() => { //only current user
      console.log(`deleted ${user.email}`);
    }).catch((error) => {
      console.log(error);
    });
  }

  //Update Form
  const [data,setData] = useState({});
  const [list, setList] = useState([]);
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setData({...data,[name]:value});
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    const user = auth.currentUser;
    const userDoc = doc(db,"users",user.uid);
    const newFields = {name:data.name,phone:Number(data.phone),dob:data.dob,gender:data.gender};
    updateDoc(userDoc,newFields);
  }
  const setUserData=async(userDoc,userBookList)=>{
    const result =await getDoc(userDoc);
    const listSnapshot =await getDoc(userBookList);
    const list=listSnapshot.data();
    setData(result.data());
    setList(list.bookings);
  }

  //Profile Image upload
  const [photo, setPhoto] = useState(null)
  const [photoURL, setPhotoURL] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")

  const handleFileChange=(e)=>{
    if(e.target.files[0]){
      setPhoto(e.target.files[0]);
    }
  }
  const handleUpload=async()=>{
    const fileRef = ref(storage,auth.currentUser.uid+".png");
    await uploadBytes(fileRef,photo)
    const photoURL=await getDownloadURL(fileRef);
    updateProfile(auth.currentUser,{photoURL:photoURL})
    alert("File uploaded");
  }
  useEffect(()=>{
    if(auth.currentUser?.photoURL){
      setPhotoURL(auth.currentUser.photoURL);
    }
  },[auth.currentUser]);

  //Booking Submit
  const handleBooking=async()=>{
    const user=auth.currentUser;
    const userDoc = doc(db,"bookList",user.uid);
    const newFields={from:data.from,to:data.to};
    console.log(newFields);
    await updateDoc(userDoc,{bookings:arrayUnion(newFields)});
  }
  const handleCancel=async(element)=>{
    const userBookList = doc(db,"bookList",auth.currentUser.uid);
    const listSnapshot =await getDoc(userBookList);
    const list=listSnapshot.data();
    const mapIndex = list.bookings.findIndex((map) => map.pnr === element.pnr);
    await updateDoc(userBookList, {bookings: arrayRemove(list.bookings[mapIndex])});
    console.log(`${element.pnr} PNR cancelled`);
  }

  return (
    <div className="App">
    <h2>Register</h2>
    <input placeholder='email' onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
    <input placeholder='password' onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
    <button onClick={register}>SignUp</button>

    <h2>{auth.currentUser?.email}</h2>
    {list.map(element=>{
      return(
        <div>
          <div>
          <strong>{element.pnr} {element.from} {element.to}</strong> <button onClick={()=>{handleCancel(element)}}>cancel</button>
        </div><br />
        </div>
      )
    })}
    {
      
    }
    <input placeholder='email' onChange={(e)=>{setloginEmail(e.target.value)}}/>
    <input placeholder='password' onChange={(e)=>{setloginPassword(e.target.value)}}/>
    <button onClick={login}>Login</button>
    <button onClick={logOut}>LogOut</button>

    <div className="users">
    {users.map((user)=>{
      return(
        <div>
          <h3>Email : {user.email}</h3>
          <h3>Password : {user.password}</h3>
          <h3>ID : {user.id}</h3>
          {/* <button onClick={()=>{updateDocument(user)}}>Increase age</button> */}
          {/* <button onClick={()=>{deleteDocument(user)}}>Delete</button> */}
        </div>
      )
    })}
    </div> 
    {/* <h1>Add User</h1>
    <input placeholder="Name" onChange={(e)=>{setnewName(e.target.value)}}/>
    <input placeholder="Age" onChange={(e)=>{setnewAge(e.target.value)}}/>
    <button onClick={createDocument}>Create</button> */}


    <button onClick={deleteCurrentUser}>Delete User</button>
    <h2>Update User</h2>
    <form method='post' onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder='name' onChange={handleChange} value={data?.name}/>
      <input type="email"  name="email" placeholder='email' value={data?.email}/>
      <input type="number" name="phone" placeholder='phone number' onChange={handleChange} value={data?.phone}/>
      <input type="date" name="dob"  onChange={handleChange} value={data?.dob}/>
      <Radiobuttons handleChange={handleChange} data={data}/>
      <input type="file" placeholder='image' onChange={handleFileChange}/><button onClick={handleUpload}>upload</button>
      <img src={photoURL} alt="Avatar" className='avatar'/>
      <button type='submit'>Update</button><br />
      <h2>Book</h2>
    </form>
      <input type="number" name="pnr" onChange={handleChange} value={data?.pnr} placeholder='PNR'/>
      <input type="text" name="from" onChange={handleChange} value={data?.from} placeholder='From'/>
      <input type="text" name="to" onChange={handleChange} value={data?.to} placeholder='To'/>
      <button onClick={handleBooking}>Book</button> <br /><br /><br /><br />
      <Search handleBooking={handleBooking} setData1={setData}/> <br /><br /><br />
    </div>
  );
}
export default App;