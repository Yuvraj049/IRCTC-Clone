import React,{useState} from 'react'

function Search({setResults}) {
  const [search, setSearch] = useState([]);
  const API="https://jsonplaceholder.typicode.com/users";

  const fecthAPIdata=async(value)=>{
    try{
      const res=await fetch(API);
      const data=await res.json();
      const results=data.filter((user)=>{
        return value && user && user.name && user.name.toLowerCase().includes(value);
      });
      setResults(results);
      console.log(results);
    }catch(error){
      console.log(error);
    }
  }
  const handleChange=(value)=>{
    setSearch(value);
    fecthAPIdata(value);
  }
  return (
    <div>
      <input placeholder='search here' onChange={(e)=>{handleChange(e.target.value)}}/><button onClick={()=>{fecthAPIdata(search)}}>Search</button>
    </div>
  )
}

export default Search