import { React, useState, useEffect } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { updateDoc, doc, getDoc, arrayRemove } from "firebase/firestore";
import Navbar from '../components/Navbar';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';
import Alert from "../components/Alert"
import DialogBox from '../components/DialogBox';

function BookList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [booklist, setBooklist] = useState([]);
  const [element1,setElement] = useState(null);
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
  }, [])
  useEffect(() => {
    const setList = async () => {
      const userBookList = doc(db, "booklist", user.uid);
      const listSnapshot = await getDoc(userBookList);
      const list = listSnapshot.data();
      setBooklist(list.bookings);
    }
    if (user) {
      setList();
    };
  }, [user])
  const handleCancel = async (element) => {
    navigate("/booklist");
    const userBookList = doc(db, "booklist", user.uid);
    console.log(user);
    console.log(userBookList);
    const listSnapshot = await getDoc(userBookList);
    const list = listSnapshot.data();
    const mapIndex = list.bookings.findIndex((map) => (map.from === element.from && map.to === element.to && map.date === element.date));
    console.log(mapIndex);
    await updateDoc(userBookList, { bookings: arrayRemove(list.bookings[mapIndex]) });
    window.location.reload();
    console.log(`ticket cancelled`);
  }

  return (
    <div>
      {/*
        { booklist && booklist.map(element=>{
      return(
        <div>
          <div>
          <strong>{element.booked?'true':'false'} {element.train_date} {element.from} {element.to}</strong> 
          {(()=>{
            if(!element.booked){return <button onClick={()=>{navigate("/payment",{state:element})}}>pay</button>;}
            else{return <button>paid</button>}
          })()}
          <button onClick={()=>{handleCancel(element)}}>cancel</button>
        </div><br />
        </div>
      )
    })} */}
      <Alert alert={alert}/>
      {showModal && <DialogBox setShowModal={setShowModal} element={element1} action={handleCancel} msg={"Are you sure you want to cancel the Ticket?"}/>}
      <Navbar navbar={[["Home", "/"], ["Search Train", "/searchtrain"], ["About Us", "/#aboutUs"]]} />
      <h1 class="mt-5 mb-10 text-3xl font-bold">Book List</h1>
      {booklist && booklist.map(element => {
        return (
          <div>
            <div>
              {/* <strong>{element.booked?'true':'false'} {element.train_date} {element.from} {element.to}</strong>  */}
              <Accordion class="w-3/4 m-auto relative border-2" >
                <AccordionPanel>
                  <AccordionTitle>
                    <button class="ml-5 bg-blue-500 hover:bg-blue-700 text-base text-white py-2 px-4 rounded-full">
                      FROM : {element.from}
                    </button>
                    <button class="ml-4 bg-blue-500 hover:bg-blue-700 text-base text-white py-2 px-4 rounded-full">
                      TO : {element.to}
                    </button>
                    <button class="ml-4 bg-blue-500 hover:bg-blue-700 text-base text-white py-2 px-4 rounded-full">
                      DATE : {element.train_date}
                    </button>
                    <button class="ml-4 bg-blue-500 hover:bg-blue-700 text-base text-white py-2 px-4 rounded-full">
                      TRAIN NUMBER : {element.train_number}
                    </button>
                    {(() => {
                      if (!element.booked) { return <button onClick={() => { navigate("/payment", { state: element }) }} class="absolute right-16 text-white bg-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">BOOK NOW</button>; }
                      else { return <button class="absolute right-16 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-700 dark:hover:bg-green-700 dark:focus:ring-green-800">BOOKED</button> }
                    })()}
                  </AccordionTitle>
                  <AccordionContent>
                    <div class="grid grid-cols-2 border-2 border-slate-600 rounded-3xl text-lg text-slate-700 font-medium">
                      <div>
                        <div class="ml-5 mt-5 flex">Train Name</div>
                        <div class="ml-5 mt-1 flex">From</div>
                        <div class="ml-5 mt-1 flex">To</div>
                        <div class="ml-5 mt-1 flex">Date</div>
                        <div class="ml-5 mt-1 mb-5 flex">Train Type</div>
                      </div>
                      <div>
                        <div class="mt-5 flex">: {element.train_name}</div>
                        <div class="mt-1 flex">: {element.from_station}</div>
                        <div class="mt-1 flex">: {element.to_station}</div>
                        <div class="mt-1 flex">: {element.train_date}</div>
                        <div class="mt-1 mb-5 flex">: {element.train_type}</div>
                      </div>
                    </div>
                    <button onClick={() => {setElement(element);setShowModal(true)}} class="mt-5 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> </svg>
                    Cancel Ticket
                    </button>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div><br />
          </div>
        )
      })}
    </div>
  )
}

export default BookList