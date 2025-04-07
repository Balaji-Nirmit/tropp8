import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { get_club_list } from "../api/endpoints";
import Loader from "../components/loader";
import ClubCard from "../components/club_card";
import { NavLink } from "react-router-dom";

const Clubs = () => {
    const [clubs, setClubs] = useState([])
    const [loading, setLoading] = useState(false)
    const [nextPageId, setNextPageId] = useState('');
    const [fetching, setFetching] = useState(false); // Prevent duplicate API calls
    const { ref, inView } = useInView({ threshold: 0.8 })
    const fetchData = async () => {
        if (nextPageId == null || fetching) return;
        setFetching(true);
        setLoading(true);
        try {
            const data = await get_club_list(nextPageId)
            setClubs(prevData => [...prevData, ...data.results]);
            setNextPageId(data.next ? `?${data.next.split('?')[1]}` : null);
        } catch (error) {
            console.error("Error fetching Clubs", error);
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
            <div className="flex gap-4 justify-start border-b-1 border-b-gray-300 p-2">
                <NavLink
                    to="/clubs"
                    className={({ isActive }) =>
                        `flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${isActive ? "text-purple-500 font-bold" : "text-gray-500 hover:text-purple-500"
                        }`
                    }
                >
                    <p>Clubs</p>
                </NavLink>

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${isActive ? "text-purple-500 font-bold" : "text-gray-500 hover:text-purple-500"
                        }`
                    }
                >
                    <p>My Clubs</p>
                </NavLink>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full py-2">
                {clubs.map((item, index) => <ClubCard club={item} key={item.id}></ClubCard>)}
                {clubs.map((item, index) => <ClubCard club={item} key={item.id}></ClubCard>)}
                {clubs.map((item, index) => <ClubCard club={item} key={item.id}></ClubCard>)}
            </div>

            {loading && <Loader />}
            <div ref={ref} style={{ height: "20px" }}></div>
        </>
    )
}
export default Clubs;