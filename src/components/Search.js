import React,{useState} from 'react'
import records from '../records.json';
function Records(props) {
  const [data,setData] = useState({});
  const [results, setResults] = useState([]);
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    Search(value);
    setData({...data,[name]:value});
  }
    const Search =async(value)=>{
      if(value!==""){
        const results=records.stations.filter((element)=>{
        return element && element && element.stnCity && element.stnCity.toLowerCase().includes(value);
      });
      console.log(results);
      setResults(results);
      }else{
        setResults([]);
      } 
    }
    const handleClick=(name,value)=>{
      setData({...data,[name]:value});
    }
    const handleSubmit=(e)=>{
      e.preventDefault();
      props.setData1(data);
      props.handleBooking();
    }
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder='from' name='from' onChange={handleChange} value={data.from}/>
        {
          data.from && results.slice(0,5).map((user)=>{
                return(
                  <div className="stationCodes" onClick={()=>{handleClick("from",user.stnCode)}}>
                    <h4>{user.stnName}</h4>
                    <h4>{user.stnCode}</h4>
                  </div>
                )
              })
        }
        <input placeholder='to' name='to' onChange={handleChange} value={data.to}/>
        {
          data.to && results.slice(0,5).map((user)=>{
                return(
                  <div className="stationCodes" onClick={()=>{handleClick("to",user.stnCode)}}>
                    <h4>{user.stnName}</h4>
                    <h4>{user.stnCode}</h4>
                  </div>
                )
              })
        }
        <button type='submit'>Search</button>
      </form>
    </div>
  )
}

export default Records