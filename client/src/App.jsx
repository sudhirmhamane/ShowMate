import Navbar from './components/Navbar'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorites from './pages/Favorites'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'

const App = () => {

  const isAdminRoutes = useLocation().pathname.startsWith('/admin');
  return (
    <>
    <Toaster />
    {!isAdminRoutes && <Navbar />}
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/movies' element={<Movies />}/>
      <Route path='/movies/:id' element={<MovieDetails />}/>
      <Route path='/movies/:id/:date' element={<SeatLayout />}/>
      <Route path='/mybookings' element={<MyBookings />}/>
      <Route path='/favorites' element={<Favorites />}/>

      <Route path='/admin/*' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path='addShows' element={<AddShows />}/>
        <Route path='listShows' element={<ListShows />}/>
        <Route path='listBookings' element={<ListBookings />}/>
        
      </Route>

    </Routes>
    {!isAdminRoutes && <Footer />}
    </>
  )
}

export default App