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
        console.log("data---------"+response)
        const original_Request = error.config
        if(error.response?.status===401 && !original_Request._retry){
            original_Request._retry=true;
            try{
                await refresh_token()
                return api(original_Request)
            }catch(refreshError){
                console.log("data-----"+response)
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
    const response = await api.get(`/get_user_profile/${username}/`)
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

export const get_user_post = async (username,cursorId)=>{
    const response = await api.get(`/get_user_posts/${username}/${cursorId}`)
    return response.data
}

export const toggleLike = async (postId) => {
    const response = await api.post(`/toggle_like/${postId}/`)
    return response.data
}

export const createPost = async (formData)=>{
    const response = await api.post('/create_post/',formData,{ headers: { "Content-Type": "multipart/form-data" } })
    return response.data
}

export const getPosts = async (cursorId)=>{
    const response = await api.get(`/get_posts/${cursorId}`)
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
    const response = await api.patch('/update_user_profile/', values, { headers: {'Content-Type': 'multipart/form-data'}})
    return response.data
}

export const getLikes = async (postId,cursorId)=>{
    const response =  await api.get(`/get_post_likes/${postId}/${cursorId}`)
    return response.data
}

// clubs
export const create_club = async (formData)=>{
    const response =  await api.post('/create_club/',formData,{headers:{'Content-Type':'multipart/form-data'}})
    return response.data
}

export const get_club_list = async (cursorId)=>{
    const response = await api.get(`/get_club_list/${cursorId}`)
    return response.data
}

export const get_club_details = async (clubId)=>{
    const response = await api.get(`/get_club_details/${clubId}`)
    return response.data
}

export const get_club_members = async (clubId,cursorId)=>{
    const response = await api.get(`/get_club_members/${clubId}/${cursorId}`)
    return response.data
}

export const join_club = async (clubId)=>{
    const response = await api.post(`/join_club/${clubId}/`)
    return response.data
}

export const leave_club = async (clubId)=>{
    const response = await api.post(`/leave_club/${clubId}/`)
    return response.data
}

// follower following
export const get_followers = async (username,cursorId)=>{
    const response =await api.get(`/get_followers/${username}/${cursorId}`)
    return response.data
}

export const get_followings = async (username,cursorId)=>{
    const response = await api.get(`/get_followings/${username}/${cursorId}`)
    return response.data
}

export const send_follow_request = async (username)=>{
    const response =await api.post(`/send_follow_request/${username}/`)
    return response.data
}

export const accept_follow_request = async (username)=>{
    const response =  await api.post(`/accept_follow_request/${username}/`)
    return response.data
}

export const reject_follow_request = async (username)=>{
    const response = await api.post(`/reject_follow_request/${username}/`)
    return response.data
}

export const cancel_follow_request = async (username)=>{
    const response = await api.post(`/cancel_follow_request/${username}/`)
    return response.data
}

export const unfollow_user = async (username)=>{
    const response = await api.post(`/unfollow_user/${username}/`)
    return response.data
}

export const get_follow_requests = async (cursorId)=>{
    const response = await api.get(`/get_follow_requests/${cursorId}`)
    return response.data
}

export const get_notifications = async (cursorId)=>{
    const response = await api.get(`/get_notifications/${cursorId}`)
    return response.data
}