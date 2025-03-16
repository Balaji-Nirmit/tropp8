import { FaSearch } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";

const SearchBar = () => {
    return (
        <>
            <div className="w-[77%] bg-white border-b-1 h-[60px] border-b-gray-300 fixed top-0 right-0 z-2 flex justify-between px-8 items-center">
                <div className="flex items-center w-[50%]">
                    <FaSearch className="text-gray-500 text-lg mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-4 justify-center items-center">
                    <span className="text-gray-500 bg-gray-100 rounded-2xl p-2 cursor-pointer hover:text-purple-500 transition-all duration-300"><CiShoppingCart /></span>
                    <span className="text-gray-500 cursor-pointer hover:text-purple-500 transition-all duration-300">Lorem</span>
                </div>
            </div>
        </>
    )
}
export default SearchBar