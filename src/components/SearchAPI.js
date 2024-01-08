import React,{useState} from 'react'

function SearchAPI({setResults}) {
  const [data, setData] = useState({});

  // const API=`http://localhost:5000/https://indian-railway-api.cyclic.app/trains/betweenStations/?from=${data.from}&to=${data.to}`;
  const API = `http://localhost:5000/trains-between-stations?from=${data.from}&to=${data.to}`;
  const fecthAPIdata=async()=>{
    try{
      const res=await fetch(API);
      const results=await res.json();
      console.log(results);
      // setResults(results);
    }catch(error){
      console.log(error);
    }
  }
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setData({...data,[name]:value});
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    fecthAPIdata();
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <input name='from' placeholder='from' onChange={handleChange} value={data.from}/>
      <input name='to' placeholder='to' onChange={handleChange} value={data.to}/>
      <button type='submit'>Search</button>
      </form>
    </div>
  )
}

export default SearchAPI