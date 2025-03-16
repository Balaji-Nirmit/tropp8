import axios from 'axios';
import { constants } from '../constants/constants';


const api=axios.create({
    baseURL: constants.SERVER_URL,
    withCredentials:true,
})

api.interceptors.response.use(
    (response)=>response,
    // this is to pass through successful responses
    async error =>{
        const original_Request = error.config
        if(error.response?.status===401 && !original_Request._retry){
            original_Request._retry=true;
            try{
                await refresh_token()
                return api(original_Request)
            }catch(refreshError){
                window.location.href='/login'
                // if refresh fails redirect to login
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
// the above interceptor is to refresh the token if it expires

export const get_user_profile_data = async (username)=>{
    const response = await api.get(`/user_data/${username}/`)
    return response.data
}

const refresh_token = async ()=>{
    const response =await api.post('/token/refresh/')
    return response.data
}

export const login = async (username, password)=>{
    const response =await api.post('/token/',{username,password})
    return response.data
}

export const register = async (username, email, firstname,lastname, password,registration)=>{
    const response =await api.post('/register/',{username:username,email:email,first_name:firstname,last_name:lastname,password:password,registration:registration})
    return response.data
}

export const get_auth = async ()=>{
    const response =await api.get('/authenticated/')
    return response.data
}

export const toggleFollow= async (username)=>{
    const response =await api.post('/toggle_follow/',{username})
    return response.data
}

export const get_user_post = async (username)=>{
    const response = await api.get(`/posts/${username}/`)
    return response.data
}

export const toggleLike = async (id) => {
    const response = await api.post('/toggleLike/', {id})
    return response.data
}

export const createPost = async (formData)=>{
    const response = await api.post('/create_post/',formData,{ headers: { "Content-Type": "multipart/form-data" } })
    return response.data
}

export const getPosts = async (num)=>{
    const response = await api.get(`/get_posts/?page=${num}`)
    return response.data
}

export const search_user =  async (query)=>{
    const response = await api.get(`/search/?query=${query}`)
    return response.data
}

export const logout = async ()=>{
    const response = await api.post('/logout/')
    return response.data
}

export const update_user = async (values) => {
    const response = await api.patch('/update_user/', values, { headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
}

export const get_followers = async (username)=>{
    const response =await api.get(`/user_data/${username}/followerlist`)
    return response.data
}

export const get_followings = async (username)=>{
    const response = await api.get(`/user_data/${username}/followinglist`)
    return response.data
}

export const getLikes = async (postid)=>{
    const response =  await api.get(`/postlikes/${postid}`)
    return response.data
}