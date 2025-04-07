import { Link } from "react-router-dom";

const ClubCard=({club})=>{
    return (
        <>
        <div className="shadow-md h-[300px] w-[340px] rounded-2xl p-2 flex flex-col gap-10 items-center">
            <div className="relative">
                <img src={`${club.banner_image_url}`} className="rounded-2xl"></img>
                <div className="p-1 absolute top-[40px] left-[33%] rounded-full bg-white">
                    <img src={`${club.profile_image_url}`} className="w-[100px] h-[100px] rounded-full object-fill"></img>
                </div>
            </div>
            <div className="flex flex-col gap-1 items-center">
                <h2 className="text-gray-500 font-bold text-2xl">{club.name}</h2>
                <p className="text-gray-500">{club.description}</p>
                {club.institution? <p className="text-wrap">{`${club.institution.name}, ${club.institution.city}, ${club.institution.country}`}</p>:<p></p>}
                <Link to={`/club/${club.id}`} className="px-6 py-2 text-purple-600 border-2 border-purple-600 rounded-4xl font-semibold transition-all duration-300 ease-in-out hover:bg-purple-600 hover:text-white hover:shadow-lg">View Club</Link>
            </div>
        </div>
        </>
    )
}
export default ClubCard;