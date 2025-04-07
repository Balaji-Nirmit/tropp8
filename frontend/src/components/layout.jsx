import Left from "../components/left";
import SearchBar from "../components/searchbar";


const Layout=({children})=>{
    return (
        <>
        <div className="flex h-full w-full">
            <Left></Left>
            <div className="w-[77%]">
                <SearchBar></SearchBar>
                <div className="flex relative top-[60px] left-[30%] bg-gray-50">
                    {children}
                </div>
            </div>
        </div>
        
        </>
    )
}
export default Layout;