import {React,useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {onAuthStateChanged} from "firebase/auth";
import {auth,db} from "../firebase-config";
import {updateDoc,doc,getDoc,arrayRemove} from "firebase/firestore";

function BookList() {
  const navigate=useNavigate();
  const [user, setUser] = useState(null); 
  const [booklist, setBooklist] = useState([]);
  useEffect(()=>{
    onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser); 
    })
  },[])
  useEffect(()=>{
    const setList=async()=>{
      const userBookList = doc(db,"booklist",user.uid);
      const listSnapshot =await getDoc(userBookList);
      const list=listSnapshot.data();
      setBooklist(list.bookings);
    }
    if(user){
      setList();
    };
  },[user])
  const handleCancel=async(element)=>{
    const userBookList = doc(db,"booklist",user.uid);
    const listSnapshot =await getDoc(userBookList);
    const list=listSnapshot.data();
    const mapIndex = list.bookings.findIndex((map) => (map.from === element.from && map.to===element.to && map.date===element.date));
    await updateDoc(userBookList, {bookings: arrayRemove(list.bookings[mapIndex])});
    console.log(`ticket cancelled`);
  }
  

  return (
    <div>
        <h2>BookList</h2>
        <h4>{user?.email}</h4>
        <Link to="/profile">Profile</Link><br />
        <Link to="/searchtrain">SearchTrain</Link>
        {booklist.map(element=>{
      return(
        <div>
          <div>
          <strong>{element.booked?'true':'false'} {element.date} {element.from} {element.to}</strong> 
          {(()=>{
            if(!element.booked){return <button onClick={()=>{navigate("/payment",{state:element})}}>pay</button>;}
            else{return <button>paid</button>}
          })()}
          <button onClick={()=>{handleCancel(element)}}>cancel</button>
        </div><br />
        </div>
      )
    })}
    </div>
  )
}

export default BookList