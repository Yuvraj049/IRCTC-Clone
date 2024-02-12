import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import records from '../records.json';
import stations from '../stations.json';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

function SearchTrain() {
  const [alert, setAlert] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

  const [data, setData] = useState({});
  const [results_from, setResults_from] = useState([]);
  const [results_to, setResults_to] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [booklist, setBooklist] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    Search(name, value);
    setData({ ...data, [name]: value });
  }
  const Search = async (name, value) => {
    if (value !== "") {
      const results = stations.stations.filter((element) => {
        return element && element.station && element.station.toLowerCase().startsWith(value.trim().toLowerCase());
      });
      console.log(results);
      if (name === 'from') {
        setResults_from(results);
      } else {
        setResults_to(results);
      }
    } else {
      setResults_from([]);
      setResults_to([]);
    }
  }
  const handleClick = (name, value) => {
    setData({ ...data, [name]: value });
    setResults_from([]);
    setResults_to([]);
  }

  const [isSearchEmpty, setIsSearchEmpty] = useState(false)
  const handleSearch = async (e) => {
    e.preventDefault();
    const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${data.from}&toStationCode=${data.to}&dateOfJourney=${data.date}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
      }
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      if (result.data.length==0) {
        setData({ from: "", to: "", date: "" });
        showAlert("Search Results Not Found", "danger");
      }
      setSearchResults(result.data);
    } catch (error) {
      console.error(error);
    }
    // console.log(data);
    // const results = records.data.filter((element) => {
    //   if (element.from === data.from && element.to === data.to && element.train_date === formatDate(data.date)) {
    //     return element;
    //   }
    // });
    // if (results.length == 0) {
    //   setData({ from: "", to: "", date: "" });
    //   showAlert("Search Results Not Found", "danger")
    // }
    // console.log(results);
  }

  //format date
  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  const renderIfinBookList = (element) => {
    console.log(element);
    if (isMatched(element)) {
      return (
        <button class="mt-5 py-2 px-4 inline-flex items-center gap-x-2 text-sm text-blue-900 font-semibold rounded-lg border-2  border-slate-600 bg-blue-300 text-white  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"> <path fill-rule="evenodd" d="M15 8c0 .982-.472 1.854-1.202 2.402a2.995 2.995 0 0 1-.848 2.547 2.995 2.995 0 0 1-2.548.849A2.996 2.996 0 0 1 8 15a2.996 2.996 0 0 1-2.402-1.202 2.995 2.995 0 0 1-2.547-.848 2.995 2.995 0 0 1-.849-2.548A2.996 2.996 0 0 1 1 8c0-.982.472-1.854 1.202-2.402a2.995 2.995 0 0 1 .848-2.547 2.995 2.995 0 0 1 2.548-.849A2.995 2.995 0 0 1 8 1c.982 0 1.854.472 2.402 1.202a2.995 2.995 0 0 1 2.547.848c.695.695.978 1.645.849 2.548A2.996 2.996 0 0 1 15 8Zm-3.291-2.843a.75.75 0 0 1 .135 1.052l-4.25 5.5a.75.75 0 0 1-1.151.043l-2.25-2.5a.75.75 0 1 1 1.114-1.004l1.65 1.832 3.7-4.789a.75.75 0 0 1 1.052-.134Z" clip-rule="evenodd" /> </svg>
          Book Listed
        </button>
      )
    } else {
      return (
        <button onClick={() => { handleAddBooking(element) }} class="mt-5 py-2 px-4 inline-flex items-center gap-x-2 text-sm text-blue-900 hover:bg-blue-900 hover:text-white font-semibold rounded-lg border-2  border-slate-600 bg-blue-300 text-white  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"> <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" /> </svg>
          Add to Book List
        </button>
      )
    }
  }
  const isMatched = (element) => {
    if (booklist) {
      return booklist.some((element1) => {
        return (element1.from === element.from && element1.to === element.to && element.train_date === element1.train_date && element.train_number === element1.train_number)
      })
    }
  }
  const handleAddBooking = async (data) => {
    const userBookList = doc(db, "booklist", user.uid);
    const newFields = {
      from_station: data.from_station_name, to_station: data.to_station_name, train_type: data.train_type, train_number: data.train_number, train_name: data.train_name,
      from: data.from, to: data.to, train_date: data.train_date, booked: false
    };
    console.log(newFields);
    await updateDoc(userBookList, { bookings: arrayUnion(newFields) });
    window.scrollTo({ top: 0 });
    showAlert("Train Book Listed", "success");
  }
  const dayExist = (element, day) => {
    if (element.run_days.includes(day)) {
      return "mr-5";
    } else { return "mr-5 opacity-60"; }
  }
  return (
    <div>
      <Alert alert={alert} />
      <Navbar navbar={[["Home", "/"], ["Book List", "/booklist"], ["About Us", "/#aboutUs"]]} />
      <h1 class="mt-5 text-3xl font-bold mb-20">Search your Journey</h1>
      <div>
        <form onSubmit={handleSearch}>
          <div class="w-1/4 m-auto">
            <label for="from" class="flex mb-1 text-xl font-medium text-slate-700"> From: </label>
            <input autocomplete="off" type="text" name='from' onChange={handleChange} value={data.from} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white text-center px-3 text-lg text-slate-800 outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          {
            data.from && results_from.slice(0, 20).map((user) => {
              return (
                <div className="w-1/4 m-auto bg-gray-300 mt-2 rounded-xl cursor-pointer text-left pl-5 py-2" onClick={() => { handleClick("from", user.code) }}>
                  <h4>{user.station} - {user.state}</h4>
                </div>
              )
            })
          }
          <div class="w-12 h-7 m-auto mt-7 mb-1 bg-blue-900 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-7 h-7 m-auto bg-gray-100 cl-white rounded-xl"> <path fill-rule="evenodd" d="M13.78 10.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V5.75a.75.75 0 0 1 1.5 0v5.69l.97-.97a.75.75 0 0 1 1.06 0ZM2.22 5.53a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v5.69a.75.75 0 0 1-1.5 0V4.56l-.97.97a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" /> </svg>
          </div>
          <div class="w-1/4 m-auto">
            <label for="to" class="flex mb-1 text-xl font-medium text-slate-700"> To: </label>
            <input autocomplete="off" type="text" name='to' onChange={handleChange} value={data.to} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white text-center px-3 text-lg text-slate-800 outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          {
            data.to && results_to.slice(0, 20).map((user) => {
              return (
                <div className="w-1/4 m-auto bg-gray-300 mt-2 rounded-xl cursor-pointer text-left pl-5 py-2" onClick={() => { handleClick("to", user.code) }}>
                  <h4>{user.station}</h4><h4>{user.state}</h4>
                </div>
              )
            })
          }
          <div class="w-1/6 m-auto mt-10">
            <label for="date" class="flex mb-1 text-xl font-medium text-slate-700"> Date: </label>
            <input type="date" name='date' onChange={handleChange} value={data.date} min={today} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          <button type="submit" class="mt-5 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"> <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /> </svg>
            Search
          </button>
        </form>
        {
          searchResults.slice(0, 20).map((element) => {
            return (
              <div className="w-3/4 py-4 px-4 bg-blue-300 m-auto mt-4 text-sm font-medium text-slate-800 rounded-3xl">
                <div className='text-black text-lg'>{element.train_name}</div>

                <div className='mt-3'>Runs on:</div>
                <div className='flex justify-center font-bold mt-1'>
                  <div className={dayExist(element, 'Mon')}>M</div>
                  <div className={dayExist(element, 'Wed')}>T</div>
                  <div className={dayExist(element, 'Tue')}>W</div>
                  <div className={dayExist(element, 'Thu')}>T</div>
                  <div className={dayExist(element, 'Fri')}>F</div>
                  <div className={dayExist(element, 'Sat')}>S</div>
                  <div className={dayExist(element, 'Sun')}>S</div>
                </div>
                <div className='mt-5 relative border-1 h-5'>
                  <div className='absolute'>From : {element.from_station_name}</div>
                  <div className='absolute right-0'>To: {element.to_station_name}</div>
                </div>
                <div className='mt-5 relative border-1 h-5'>
                  <div className='absolute'>Date : {element.train_date}</div>
                  <div className='absolute right-0'>Train Number: {element.train_number}</div>
                </div>
                {renderIfinBookList(element)}
              </div>
            )
          })
        }
        {/* {isSearchEmpty?(
          <h1>Empty</h1>
        ):(<></>) */}
        {/* } */}
      </div><div class="mt-32"></div>
    </div>
  )
}

export default SearchTrain