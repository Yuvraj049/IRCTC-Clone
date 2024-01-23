import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import records from '../records.json';
import stations from '../stations.json';
import Navbar from '../components/Navbar';

function SearchTrain() {
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
          return element && element.state && element.state.toLowerCase().startsWith(value.trim().toLowerCase());
        });
        console.log(results);
        if (name === 'from') {
          setResults_from(results);
        }else{
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
  const handleSearch = (e) => {
    e.preventDefault();
    const results = records.data.filter((element) => {
      if (element.from === data.from && element.to === data.to && element.train_date === formatDate(data.date)) {
        return element;
      }
    });
    console.log(results);
    setSearchResults(results);
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
        <button>Book Listed</button>
      )
    } else {
      return (
        <button onClick={() => { handleAddBooking(element) }}>Add to BookList</button>
      )
    }
  }
  const isMatched = (element) => {
    console.log(element);
    if (booklist) {
      return booklist.some((element1) => {
        console.log(element1);
        return (element1.from === element.from && element1.to === element.to && element.train_date === element1.train_date)
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
    alert("Ticket Added")
  }
  return (
    <div>

      <Navbar navbar={[["Home", "/"], ["Book List", "/booklist"], ["About Us", "/#aboutUs"]]} />
      <h1 class="mt-5 text-3xl font-bold mb-20">Search your Journey</h1>
      <div>
        <form onSubmit={handleSearch}>
          {/* <input placeholder='from' name='from' onChange={handleChange} value={data.from}/> */}
          <div class="w-1/4 m-auto">
            <label for="from" class="flex mb-1 text-xl font-medium text-slate-700"> From: </label>
            <input autocomplete="off" type="text" name='from' onChange={handleChange} value={data.from} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white text-center px-3 text-lg text-slate-800 outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          {
            data.from && results_from.slice(0, 2).map((user) => {
              return (
                <div className="stationCodes" onClick={() => { handleClick("from", user.code) }}>
                  <h4>{user.code}</h4>
                  <h4>{user.state}</h4>
                </div>
              )
            })
          }
          <div class="w-12 h-7 m-auto mt-7 mb-1 bg-blue-900 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-7 h-7 m-auto bg-gray-100 cl-white rounded-xl"> <path fill-rule="evenodd" d="M13.78 10.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V5.75a.75.75 0 0 1 1.5 0v5.69l.97-.97a.75.75 0 0 1 1.06 0ZM2.22 5.53a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v5.69a.75.75 0 0 1-1.5 0V4.56l-.97.97a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" /> </svg>
          </div>
          {/* <input placeholder='to' name='to' onChange={handleChange} value={data.to} /> */}
          <div class="w-1/4 m-auto">
            <label for="to" class="flex mb-1 text-xl font-medium text-slate-700"> To: </label>
            <input autocomplete="off" type="text" name='to' onChange={handleChange} value={data.to} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white text-center px-3 text-lg text-slate-800 outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          {
            data.to && results_to.slice(0, 2).map((user) => {
              return (
                <div className="stationCodes" onClick={() => { handleClick("to", user.code) }}>
                  <h4>{user.code}</h4>
                  <h4>{user.state}</h4>
                </div>
              )
            })
          }
          <div class="w-1/6 m-auto mt-10">
            <label for="date" class="flex mb-1 text-xl font-medium text-slate-700"> Date: </label>
            <input type="date" name='date' onChange={handleChange} value={data.date} required class="w-full rounded-md border-2 border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
          </div>
          {/* <input type="date" name='date' onChange={handleChange} value={data.date} /> */}
          <button type="submit" class="mt-5 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"> <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /> </svg> 
            Search
          </button>
          {/* <button type='submit'>Search</button> */}
          
        </form>
        {
          searchResults.map((element) => {
            return (
              <div className="stationCodes">
                <h4>{element.train_number}</h4>
                <h4>{element.from_station_name}</h4>
                <h4>{element.to_station_name}</h4>
                <h4>{element.train_date}</h4>
                {renderIfinBookList(element)}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SearchTrain