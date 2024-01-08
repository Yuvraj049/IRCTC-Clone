import './App.css'
import {  BrowserRouter,Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserProfile from './pages/UserProfile'
import SearchTrain from './pages/SearchTrain'
import BookList from './pages/BookList'
import NoPage from './pages/NoPage'
import Payment from './pages/Payment'

function App(){
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/searchtrain' element={<SearchTrain/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/booklist' element={<BookList/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='*' element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
