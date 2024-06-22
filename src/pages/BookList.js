import { React, useState, useEffect } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { updateDoc, doc, getDoc, arrayRemove } from "firebase/firestore";
import Navbar from '../components/Navbar';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, ListGroup } from 'flowbite-react';
import Alert from "../components/Alert"
import DialogBox from '../components/DialogBox';

function BookList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [booklist, setBooklist] = useState([1]);
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
      if(list.bookings) setBooklist(list.bookings);
    }
    if (user) {
      setList();
    };
  }, [user])
  const handleCancel = async (element) => {
    const userBookList = doc(db, "booklist", user.uid);
    const listSnapshot = await getDoc(userBookList);
    const list = listSnapshot.data();
    const mapIndex = list.bookings.findIndex((map) => (map.from === element.from && map.to === element.to && map.date === element.date));
    console.log(mapIndex);
    await updateDoc(userBookList, { bookings: arrayRemove(list.bookings[mapIndex]) });
    window.location.reload();
    window.alert("Ticket Cancelled Successfully");
  }
  return (
    <div>
      <Alert alert={alert}/>
      {showModal && <DialogBox setShowModal={setShowModal} element={element1} action={handleCancel} msg={"Are you sure you want to cancel the Ticket?"}/>}
      <Navbar navbar={[["Home", "/"], ["Search Train", "/searchtrain"], ["About Us", "/#aboutUs"]]} />
      {booklist && <h1 class="mt-5 mb-10 text-3xl font-bold">Book List</h1>}
      {booklist && booklist.map(element => {
        return (
          <div>
            <div>
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
                      if (!element.booked) { return <button onClick={() => { navigate("/payment", { state: element }) }} class="absolute right-16 text-white bg-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-4 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">PAY NOW</button>; }
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
                    <button onClick={() => {window.scrollTo({top:0});setElement(element);setShowModal(true)}} class="mt-5 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md">
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
      {booklist.length==0 && 
      <div className="flex flex-col bg-slate-100 w-screen h-screen  items-center">
<h1 className='my-8 text-3xl font-bold'>Book List is Empty</h1>      
        <div className="image w-1/4">

<svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H7.63C7.94 21.74 8.21 21.42 8.42 21.06C8.79 20.46 9 19.75 9 19C9 16.79 7.21 15 5 15C4.06 15 3.19 15.33 2.5 15.88V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path opacity="0.4" d="M2.5 12.4098V7.83986C2.5 6.64986 3.23 5.58982 4.34 5.16982L12.28 2.16982C13.52 1.69982 14.85 2.61985 14.85 3.94985V7.74983" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.5608 13.9702V16.0302C22.5608 16.5802 22.1208 17.0302 21.5608 17.0502H19.6008C18.5208 17.0502 17.5308 16.2602 17.4408 15.1802C17.3808 14.5502 17.6208 13.9602 18.0408 13.5502C18.4108 13.1702 18.9208 12.9502 19.4808 12.9502H21.5608C22.1208 12.9702 22.5608 13.4202 22.5608 13.9702Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path opacity="0.4" d="M7 12H14" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 19C9 19.75 8.79 20.46 8.42 21.06C8.21 21.42 7.94 21.74 7.63 22C6.93 22.63 6.01 23 5 23C3.54 23 2.27 22.22 1.58 21.06C1.21 20.46 1 19.75 1 19C1 17.74 1.58 16.61 2.5 15.88C3.19 15.33 4.06 15 5 15C7.21 15 9 16.79 9 19Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.06922 20.0402L3.94922 17.9302" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.04969 17.96L3.92969 20.0699" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </div>
</div>
      }
    </div>
  )
}

export default BookList