import Left from "../components/left";
import Right from "../components/right";
import SearchBar from "../components/searchbar";


const Layout=({children})=>{
    return (
        <>
        <div className="flex h-full w-full">
            <Left></Left>
            <div className="w-[77%]">
                <SearchBar></SearchBar>
                <div className="flex relative top-[60px] left-[30%]">
                    <div className="w-[70%] p-8">{children}</div>
                    <Right></Right>
                </div>
            </div>
        </div>
        
        </>
    )
}
export default Layout;