import { useState, useEffect } from "react";
import { accept_follow_request, cancel_follow_request, get_user_profile_data, reject_follow_request, send_follow_request, toggleFollow, unfollow_user } from "../api/endpoints";
import MidHome from "../components/midHome";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import OverlayModal from "../components/overlayModal";

const UserProfile = () => {
    const get_username_from_url = () => {
        const url_split = window.location.pathname.split("/");
        return url_split[url_split.length - 1];
    };

    const [getUserName, setUserName] = useState(get_username_from_url());
    const [userData, setUserData] = useState(null); // Set initial value as null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserName(get_username_from_url());
    }, []);

    useEffect(() => {
        if (!getUserName) return; // Prevent fetching when username is not available

        const fetchData = async () => {
            try {
                const data = await get_user_profile_data(getUserName);
                console.log("Fetched Data:", data);
                setUserData(data);
            } catch (error) {
                console.log(error.response?.data?.error || "Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getUserName]); // Fetch data when `getUserName` changes

    return (
        <div className="flex w-full h-screen">
            <div className="flex flex-col w-full p-0 h-screen gap-5">
                {!loading && userData && <UserDetail userName={getUserName} data={userData}/>}
                {!loading && userData && <UserPost userName={getUserName} data={userData} />}
            </div>
        </div>
    );
}
const UserDetail = ({ userName,data }) => {
    const [bio, setBio] = useState(data.user.bio);
    const [followersCount, setFollowersCount] = useState(data.user.follower_count);
    const [followingCount, setFollowingCount] = useState(data.user.following_count);
    const [registrationNumber, setRegistrationNumber] = useState(data.user.registration);
    const [profileImage, setProfileImage] = useState(data.user.profile_image);
    const [bannerImage, setBannerImage] = useState(data.user.banner_image);
    const [isOurProfile, setIsOurProfile] = useState(data.is_our_profile);
    const [following, setFollowing] = useState(data.is_follower);
    const [requested,setRequested]  = useState(data.is_follow_request);
    const [requestedToMe,setRequestedToMe] = useState(data.is_requested_me);

    const [isOpenFollowers, setOpenFollowers] = useState(false);
    const [isOpenFollowing, setOpenFollowing] = useState(false);

    const handleToggleFollow = async () => {
        if(following){
            const response = await unfollow_user(userName)
            setFollowersCount(followersCount-1)
            setFollowing(false)
        }else{
            if(data.user.isDirectFollow){
                const response = await send_follow_request(userName)
                setFollowersCount(followersCount+1)
                setFollowing(true)
            }else{
                if(requested){
                    const response = await cancel_follow_request(userName)
                    setRequested(false)
                }else{
                    const response = await send_follow_request(userName)
                    setRequested(true)
                }
            }

        }
    }

    const acceptFollow = async () =>{
        const response = await accept_follow_request(userName)
        setRequestedToMe(false)
    }

    const rejectFollow = async () =>{
        const response = await reject_follow_request(userName)
        setRequestedToMe(false)
    }

    const openClosedFollower = () => {
        setOpenFollowers(!isOpenFollowers);
    }
    const openClosedFollowing = () => {
        setOpenFollowing(!isOpenFollowing);
    }

    return (
        <>
            <div className="flex flex-col gap-30">
                <div className="w-full relative">
                    <img src={`${bannerImage}`} alt="profile image" className="h-[210px] w-full object-fill bg-gray-300"></img>
                    <div className="h-[220px] w-[180px] flex flex-col items-center gap-2 rounded-2xl p-1 overflow-hidden absolute top-[100px] left-[50px] bg-gray-50">
                        <img src={`${profileImage}`} className="rounded-2xl h-[180px] w-[180px]" alt="profile image"></img>
                        <h1 className="font-bold text-gray-600 text-lg">@{userName}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <div className="text-xl font-semibold flex items-center justify-center gap-2">
                            {followingCount? <button onClick={openClosedFollowing} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg shadow-md hover:opacity-80 transition">Following: {followingCount}</button>: "Following: 0"}
                        </div>
                        <div className="text-xl font-semibold flex items-center justify-center gap-2">
                            {followersCount? <button onClick={openClosedFollower} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg shadow-md hover:opacity-80 transition">Follower: {followersCount}</button>: "Follower: 0"}
                        </div>
                    </div>
                    <div>
                        <div className="text-md italic text-gray-500 flex gap-2">
                            <i className="fas fa-info-circle"></i>
                            {bio}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        {isOurProfile ? (
                            <Link to={`/settings`} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">
                                <i className="fas fa-edit"></i> Edit Profile
                            </Link>
                        ) : (
                            <button
                                onClick={handleToggleFollow}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${following
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : requested?"bg-red-500 text-white hover:bg-red-600":"bg-green-500 text-white hover:bg-green-600"
                                    }`}
                            >
                                {following ? <FaUserMinus size={18} /> : <FaUserPlus size={18} />}
                                {following ? "Unfollow" : requested?"Cancel Request":"Follow"}
                            </button>
                        )}
                    </div>
                    {requestedToMe && <div>
                        <button onClick={acceptFollow}>Accept</button>
                        <button onClick={rejectFollow}>Reject</button>
                    </div>}

                </div>
            </div>

            {isOpenFollowers && <OverlayModal prop={userName} title={'Followers'} openCloseMethod={openClosedFollower} />}
            {isOpenFollowing && <OverlayModal prop={userName} title={'Followings'} openCloseMethod={openClosedFollowing} />}


        </>
    )
}

const UserPost = ({ userName,data}) => {
    console.log('data-'+data)
    return <>
        <div className="flex gap-2 px-8 border-t-1 border-gray-300">

            {(!data.is_follower  && !data.user.isDirectFollow && !data.is_our_profile) && <span>Private Account</span>}
            {(data.is_follower || data.is_our_profile || data.user.isDirectFollow) &&  <MidHome specificUserProfile={userName} />}
        </div>
    </>
}
export default UserProfile;