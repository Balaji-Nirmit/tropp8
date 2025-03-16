import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Navbar=()=>{
    const nav=useNavigate();
    
    const handleNavigateUser= () =>{
        const username=JSON.parse(localStorage.getItem('userData'))['username']
        nav(`/${username}`)
        window.location.reload()
    }

    return (
        <>
        <nav className="flex justify-between items-center bg-blue-400 text-2xl p-2">
            <span>Heading</span>
            <span onClick={handleNavigateUser}><CgProfile /></span>
        </nav>
        </>
    )
}
export default Navbar