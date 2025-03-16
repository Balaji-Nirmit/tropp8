import {Navigate} from 'react-router-dom';
import { useAuth } from '../store/contexts/useAuth';
import Loader from './loader';

const ProtectedRoute=({children})=>{
    const {auth,authLoading}=useAuth();
    if(authLoading){
        return <Loader></Loader>
    }
    if(auth){
        return children
    }else{
        return <Navigate to='/login'></Navigate>
    }
}

export default ProtectedRoute;