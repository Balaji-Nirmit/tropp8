import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import UserProfile from './routes/user_profile'
import Layout from './components/layout'
import Login from './routes/login'
import Register from './routes/register'
import ProtectedRoute from './components/protectedRoute'
import { AuthProvider } from './store/contexts/useAuth'
import CreatePost from './routes/create_post'
import Home from './routes/home'
import Search from './routes/search'
import Setting from './routes/settings'
import Otp from './routes/otp'
import Layout2 from './components/layout2'

function App() {

  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout><ProtectedRoute><UserProfile /></ProtectedRoute></Layout>} path='/:username'/>
          <Route element={<Layout2><Login /></Layout2>} path='/login' />
          <Route element={<Layout2><Register /></Layout2>} path='/register'/>
          <Route element={<Layout><ProtectedRoute><CreatePost /></ProtectedRoute></Layout>} path='/create/post'/>
          <Route element={<Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>} path='/home'/>
          <Route element={<Layout><ProtectedRoute><Search /></ProtectedRoute></Layout>} path='/search' />
          <Route element={<Layout><ProtectedRoute><Setting /></ProtectedRoute></Layout>} path='/settings'/>
          <Route element={<Layout><ProtectedRoute><Otp /></ProtectedRoute></Layout>} path='/validation'/>
        </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
