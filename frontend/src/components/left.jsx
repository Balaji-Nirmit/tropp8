import { MdOutlineInsertPhoto } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { FaForumbee } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbBrandBlogger } from "react-icons/tb";
import { constants } from "../constants/constants";
import { Link } from 'react-router-dom';

const Left = () => {
    const data = JSON.parse(localStorage.getItem('userData'))
    return (
        <>
            <div className="w-[23%] h-full overflow-y-auto border-r-1 border-r-gray-300 fixed top-0 left-0">
                <div className="bg-gradient-to-tl from-gray-800 to-gray-500 h-[60%] w-full pt-12 relative">
                    <div className="flex flex-col items-center pt-10">
                        <img className="h-[60px]" src="https://mythemestore.com/beehive-preview/wp-content/themes/beehive/assets/images/logo-icon.svg" />
                        <h1 className="text-white text-3xl font-bold">Trop8</h1>
                        <span className="text-white">welcomes u</span>
                    </div>
                    <div className="absolute bg-white h-[290px] w-[250px] top-60 left-10 rounded-lg shadow-md z-2 flex flex-col justify-center items-center gap-2">
                        <div className="rounded-full h-[120px] w-[120px] border-1 border-gray-300 p-1">
                            <img src={`${constants.SERVER_URL}/media/${data.profile_image}`} className='h-full w-full object-fill rounded-full'></img>
                        </div>
                        <Link to={`/${data.username}`}>
                            <p className='text-2xl font-bold text-gray-600'>@{data.username}</p>
                        </Link>
                        <p className="text-gray-400 py-2 border-t-1 border-gray-300">{data.bio}</p>
                    </div>
                    <div className="absolute bg-white h-[290px] w-[220px] top-63 left-14 shadow-2xl z-1 rounded-lg"></div>
                </div>
                <div className="bg-gray-100 h-[60%] flex justify-center items-center">
                    <div className="grid grid-cols-2 gap-8">
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><IoHomeOutline /><p>Home</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><MdOutlineInsertPhoto /><p>Album</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><BsPeople /><p>Group</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><FaForumbee /><p>Forum</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><FaRegMessage /><p>Messages</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><CiShop /><p>Shop</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><RiAdvertisementLine /><p>Adverts</p></span>
                        <span className="flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300"><TbBrandBlogger /><p>Blogs</p></span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Left;