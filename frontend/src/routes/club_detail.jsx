import { useState, useEffect } from "react";
import { get_club_details, get_user_profile_data, join_club, leave_club, toggleFollow } from "../api/endpoints";
import MidHome from "../components/midHome";
import { Link } from "react-router-dom";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import OverlayModal from "../components/overlayModal";

const ClubProfile = () => {
    const get_clubid_from_url = () => {
        const url_split = window.location.pathname.split('/')
        return url_split[url_split.length - 1]
    }

    const [getClubId, setClubId] = useState(get_clubid_from_url());

    useEffect(() => {
        setClubId(get_clubid_from_url());
    }, [])

    return (
        <>

            <div className="flex w-full h-screen">
                {/* Left Content Section */}
                <div className="flex flex-col w-full p-0 h-screen gap-5">
                    <ClubDetail clubId={getClubId} />
                    <ClubPost clubId={getClubId} />
                </div>
            </div>
        </>
    )
}
const ClubDetail = ({ clubId }) => {
    const [loading, setLoading] = useState(true);
    const [desc, setDesc] = useState('');
    const [clubName, setClubName] = useState('');
    const [clubOwner, setClubOwner] = useState('');
    const [clubCollege,setClubCollege] = useState('');
    const [followersCount, setFollowersCount] = useState(0);
    const [profileImage, setProfileImage] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [isMyClub, setIsMyClub] = useState(false);
    const [following, setFollowing] = useState(false);
    const [createdDate, setCreatedDate] = useState('');

    const [isOpenFollowers, setOpenFollowers] = useState(false);

    const handleToggleFollow = async () => {
        if(following){
            const data=await leave_club(clubId)
            setFollowersCount(followersCount - 1);
            setFollowing(false);
        }else{
            const data = await join_club(clubId)
            setFollowersCount(followersCount + 1);
            setFollowing(true);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_club_details(clubId)
                setClubName(data.user.name);
                setClubOwner(data.user.username);
                setDesc(data.user.description);
                setFollowersCount(data.user.follower_count);
                setProfileImage(data.user.profile_image_url);
                setIsMyClub(data.is_my_club);
                setFollowing(data.member_of_club);
                setBannerImage(data.user.banner_image_url);
                setCreatedDate(data.user.created_date);
                setClubCollege(`${data.user.institution.name} ${data.user.institution.city} ${data.user.institution.country}`);

            } catch (error) {
                console.log(error.response.data.error);
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    const openClosedFollower = () => {
        setOpenFollowers(!isOpenFollowers);
    }

    return (
        <>
            <div className="flex flex-col gap-30">
                <div className="w-full relative">
                    <img src={`${bannerImage}`} alt="profile image" className="h-[210px] w-full object-fill bg-gray-300"></img>
                    <div className="h-[220px] w-[180px] flex flex-col items-center gap-2 rounded-2xl p-1 overflow-hidden absolute top-[100px] left-[50px] bg-gray-50">
                        <img src={`${profileImage}`} className="rounded-2xl h-[180px] w-[180px]" alt="profile image"></img>
                        <h1 className="font-bold text-gray-600 text-lg">{clubName}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <div class="text-xl font-semibold flex items-center justify-center gap-2">
                            {followersCount? <button onClick={openClosedFollower} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg shadow-md hover:opacity-80 transition">Follower: {followersCount}</button>: "Follower: 0"}
                        </div>
                    </div>
                    <div>
                        <div class="text-md italic text-gray-500 flex gap-2">
                            <i class="fas fa-info-circle"></i>
                            {loading ? '-' : desc}
                        </div>
                        {clubOwner}
                        {clubCollege}
                        {createdDate}
                    </div>

                    <div className="flex items-center gap-4">

                        {isMyClub ? (
                            <Link to={`/settings`} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">
                                <i className="fas fa-edit"></i> Edit Profile
                            </Link>
                        ) : (
                            <button
                                onClick={handleToggleFollow}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${following
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                            >
                                {following ? <FaUserMinus size={18} /> : <FaUserPlus size={18} />}
                                {following ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {isOpenFollowers && <OverlayModal prop={clubId} title={'ClubMembers'} openCloseMethod={openClosedFollower} />}


        </>
    )
}

const ClubPost = ({ clubId }) => {
    return <>
        <div className="flex gap-2 px-8 border-t-1 border-gray-300">
            club post-{clubId}
        </div>
    </>
}
export default ClubProfile;