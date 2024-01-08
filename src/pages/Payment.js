import {React,useState,useEffect} from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import {onAuthStateChanged} from "firebase/auth";
import {auth,db} from "../firebase-config";
import {updateDoc,doc,getDoc} from "firebase/firestore";

function Payment() {
    const location =useLocation();
    const navigate =useNavigate();
    const [user, setUser] = useState(null); 
    useEffect(()=>{
        onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser); 
        })
    },[])
    const handlePayment=async(element)=>{
        const userBookList = doc(db,"booklist",user.uid);
        const listSnapshot =await getDoc(userBookList);
        const list=listSnapshot.data();
        const mapIndex = list.bookings.findIndex((map) => (map.from === element.from && map.to===element.to && map.date===element.date));
        list.bookings[mapIndex].booked=true;
        await updateDoc(userBookList, list);
        alert(`Ticket Booked`);
        console.log("Ticket Booked");
        navigate("/booklist");
    }
  return(
    <div>
        <h2>Payment</h2>
        <button onClick={()=>{handlePayment(location.state)}}>Pay Now</button>
    </div>
  )
}

export default Payment