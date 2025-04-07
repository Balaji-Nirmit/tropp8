import { Link, useNavigate } from "react-router-dom";

const LandingPage=()=>{
    const nav =useNavigate();

    return (
        <>
        <Link to={'/login'}>login</Link>
        </>
    )
}
export default LandingPage;