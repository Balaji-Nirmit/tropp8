import { createContext, useContext, useEffect, useState } from "react";
import { get_auth, login } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

const AuthContext =  createContext();

export const AuthProvider=({children})=>{

    const [auth,setAuth]=useState(false);
    const [authLoading,setAuthLoading]=useState(true);
    const nav=useNavigate()

    const check_auth=async ()=>{
        try{
            await get_auth()
            setAuth(true)
        }catch(error){
            setAuth(false)
        }finally{
            setAuthLoading(false)
        }
    }

    const auth_login=async (username,password)=>{
        const data=await login(username,password)
        if(data.success){
            setAuth(true)
            const userdata={
                'username':data.user.username,
                'bio':data.user.bio,
                'email':data.user.email,
                'first_name':data.user.first_name,
                'last_name':data.user.last_name,
                'profile_image':data.user.profile_image,
                'banner_image':data.user.banner_image,
                'is_active':data.user.isActive,
                'isEmailVerified':data.user.isEmailVerified,
                'isAccountVerified':data.user.isAccountVerified,
                'isDirectFollow':data.user.isDirectFollow,
                'created_at':data.user.created_at,
            }
            localStorage.setItem('userData',JSON.stringify(userdata))
            nav('/home')
        }else{
            alert('wrong password/username')
        }
    }

    useEffect(()=>{
        check_auth()
    },[window.location.pathname])

    return (
        <>
        <AuthContext.Provider value={{auth,authLoading,auth_login}}>
            {children}
        </AuthContext.Provider>
        </>
    )
}

export const useAuth=()=>useContext(AuthContext)