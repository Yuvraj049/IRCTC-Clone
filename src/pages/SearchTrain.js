import {React,useState,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {onAuthStateChanged} from "firebase/auth";
import {auth,db} from "../firebase-config";
import {updateDoc,doc,getDoc,arrayUnion} from "firebase/firestore";
import records from '../records.json';

function SearchTrain() {
    const navigate=useNavigate();
    const [user, setUser] = useState(null); 
    useEffect(()=>{
      onAuthStateChanged(auth,(currentUser)=>{
        if(!currentUser){
          navigate("/");
        }
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
    
    const [data,setData] = useState({});
    const [results, setResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [booklist, setBooklist] = useState([]);

    const handleChange=(e)=>{
      const name=e.target.name;
      const value=e.target.value;
      Search(name,value);
      setData({...data,[name]:value});
    }
    const Search =async(name,value)=>{
      if(value!==""){
        if(name==='from'){
        const results=records.data.filter((element)=>{
        return element && element.from_station_name && element.from_station_name.toLowerCase().includes(value.toLowerCase());
      });
      console.log(results);
      setResults(results);
      }
      if(name==='to'){
      const results=records.data.filter((element)=>{
      return element && element.to_station_name && element.to_station_name.toLowerCase().includes(value.toLowerCase());
      });
      console.log(results);
      setResults(results);
      }
      }else{
        setResults([]);
      } 
    }
    const handleClick=(name,value)=>{
      setData({...data,[name]:value});
    }
    const handleSearch=(e)=>{
      e.preventDefault();
      const results=records.data.filter((element)=>{
        if(element.from === data.from && element.to === data.to && element.train_date===formatDate(data.date)){
          return element;
        }
      });
      console.log(results);
      setSearchResults(results);
    }

    //format date
    const formatDate=(date)=>{
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    }
    const renderIfinBookList=(element)=>{
      console.log(element)
      if(isMatched(element)){
        return(
          <button>Book Listed</button>
        )
      }else{
        return(
          <button onClick={()=>{handleAddBooking(data)}}>Add to BookList</button>
        )
      }
    }
    const isMatched=(element)=>{
      if(booklist){
        return booklist.some((element1)=>{
          return (element1.from===element.from && element1.to===element.to && element.train_date===formatDate(element1.date))})
      }
    }
    const handleAddBooking=async(data)=>{
      const userBookList = doc(db,"booklist",user.uid);
      const newFields={from:data.from,to:data.to,date:data.date,booked:false};
      console.log(newFields);
      await updateDoc(userBookList,{bookings:arrayUnion(newFields)});
      alert("Ticket Added")
    }
  return (
    <div>
        <h2>Search Train</h2>
        <h4>{user?.email}</h4>
        <Link to="/profile">Profile</Link><br />
        <Link to="/booklist">BookList</Link>
        <Link to={"/#aboutUs"}>About Us</Link>
        <div>
      <form onSubmit={handleSearch}>
        <input placeholder='from' name='from' onChange={handleChange} value={data.from}/>
        {
          data.from && results.slice(0,2).map((user)=>{
                return(
                  <div className="stationCodes" onClick={()=>{handleClick("from",user.from)}}>
                    <h4>{user.from_station_name}</h4>
                    <h4>{user.from}</h4>
                  </div>
                )
              })
        }
        <input placeholder='to' name='to' onChange={handleChange} value={data.to}/>
        {
          data.to && results.slice(0,2).map((user)=>{
                return(
                  <div className="stationCodes" onClick={()=>{handleClick("to",user.to)}}>
                    <h4>{user.to_station_name}</h4>
                    <h4>{user.to}</h4>
                  </div>
                )
              })
        }
        <input type="date" name='date' onChange={handleChange} value={data.date}/>
        <button type='submit'>Search</button>
      </form>
      {
          searchResults.map((element)=>{
            return(
              <div className="stationCodes">
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