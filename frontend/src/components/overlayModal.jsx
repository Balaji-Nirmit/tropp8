import { useEffect, useState } from "react"
import HorizontalBar from "./horizontalBar"
import { useInView } from "react-intersection-observer"
import { get_club_members, get_followers, get_followings, getLikes } from "../api/endpoints"
import Loader from "./loader"
import { IoCloseCircle } from "react-icons/io5";


const OverlayModal = ({prop,openCloseMethod,title}) => {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [nextPageId, setNextPageId] = useState('')
    const { ref, inView } = useInView({ threshold: 0.8 })

    const fetchData = async () => {
        if (nextPageId == null || fetching) return; // Stop if there's no next page or already fetching
        setFetching(true); // Prevent multiple API calls
        setLoading(true);

        try {
            let data;
            if(title==='Followers'){
                data=await get_followers(prop,nextPageId)
            }
            else if(title==='Followings'){
                data=await get_followings(prop,nextPageId)
            }
            else if (title==='Likes'){
                data=await getLikes(prop,nextPageId)
            }
            else if(title==='ClubMembers'){
                data=await get_club_members(prop,nextPageId)
            }
            setAccounts(prevAccounts => [...prevAccounts, ...data.results]);
            setNextPageId(data.next ? `?${data.next.split('?')[1]}` : null);
        } catch (error) {
            console.error("Error fetching posts", error);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }

    useEffect(() => {
        if (inView) {
            fetchData();
        }
    }, [inView])


    return (
        <>
            <div className="fixed z-10 top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.5)] sm:flex sm:justify-center sm:items-center">
                <div className="w-screen h-screen sm:w-[350px] sm:h-[300px] bg-white rounded-2xl p-2 flex flex-col gap-2 overflow-y-scroll">
                    <div className="flex justify-between border-b-2 border-b-gray-400">
                        <h2 className="text-gray-400 ">{title}</h2>
                        <button onClick={openCloseMethod} className="text-red-500 text-2xl cursor-pointer"><IoCloseCircle /></button>
                    </div>
                    {accounts.map((item, index) => (<HorizontalBar key={index} data={{ name: item.username, img: item.profile_image?item.profile_image:'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/3/1741292742-bpthumb.png' }}></HorizontalBar>
                    ))}
                    {loading && <Loader />}
                    <div ref={ref} style={{ height: "20px" }}></div>
                </div>
            </div>
        </>
    )
}
export default OverlayModal