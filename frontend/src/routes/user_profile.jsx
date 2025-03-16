import { useState,useEffect } from "react";
import { get_user_post, get_user_profile_data, toggleFollow } from "../api/endpoints";
import { constants } from "../constants/constants";
import PostCard from "../components/postCard";
import Loader from "../components/loader";

const UserProfile=()=>{
    const get_username_from_url=()=>{
        const url_split=window.location.pathname.split('/')
        return url_split[url_split.length-1]
    }

    const [getUserName,setUserName]=useState(get_username_from_url());

    useEffect(()=>{
        setUserName(get_username_from_url());
    },[])

    return(
        <>
        <UserDetail userName={getUserName} />
        <UserPost userName={getUserName} />
        </>
    )
}
const UserDetail=({userName})=>{
    const [loading,setLoading]=useState(true);
    const [bio,setBio]=useState('');
    const [followersCount,setFollowersCount]=useState(0);
    const [followingCount,setFollowingCount]=useState(0);
    const [registrationNumber,setRegistrationNumber]=useState('');
    const [profileImage,setProfileImage]=useState('');
    const [isOurProfile,setIsOurProfile]=useState(false);
    const [following,setFollowing]=useState(false);

    const handleToggleFollow=async ()=>{
        const data=await toggleFollow(userName)
        if(data.now_following){
            setFollowersCount(followersCount+1);
            setFollowing(true);
        }
        else{
            setFollowersCount(followersCount-1);
            setFollowing(false);
        }

    }
    

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const data=await get_user_profile_data(userName);
                console.log(data)
                setBio(data.bio);
                setFollowersCount(data.follower_count);
                setFollowingCount(data.following_count);  
                setRegistrationNumber(data.registration);
                setProfileImage(data.profile_image);
                setIsOurProfile(data.is_our_profile);
                setFollowing(data.following);

            }catch(error){
                console.log(error.response.data.error);
            }finally{
                setLoading(false);
            }
        }
        fetchData()
    },[])

    return (
        <>
        <h1>@{userName}</h1>
        <div className="flex gap-2">
            <div className="h-[100px] w-[100px] rounded-full overflow-hidden">
            <img src={`${constants.SERVER_URL+profileImage}`} alt="profile image"></img>
            </div>
            <div>
                <div>Following: {loading?'-':followingCount}</div>
                <div>Followers: {loading?'-':followersCount}</div>
                <div>Registration Number: {loading?'-':registrationNumber}</div>
                <div>bio: {loading?'-':bio}</div>
            </div>
            {isOurProfile?<button>edit</button>: <button onClick={handleToggleFollow}>{following?"unfollow":"follow"}</button>}
        </div>
        
        </>
    )
}

const UserPost=({userName})=>{
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const posts = await get_user_post(userName)
                setPosts(posts)
            } catch {
                alert('error getting users posts')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return <>
       <div className="flex gap-2 ">
            {loading? <Loader></Loader>: posts.map((item)=>{ return <PostCard prop={item} key={item.id}></PostCard>})}
        </div>
        </>
}
export default UserProfile;