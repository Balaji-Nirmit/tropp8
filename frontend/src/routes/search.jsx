import { useState } from "react";
import { search_user } from "../api/endpoints";
import Loader from "../components/loader";

const Search =()=>{
    const [userdata,setUserData]=useState([])
    const [loading,setLoading]=useState(true)
    const search=async(query)=>{
        try{
            const data = await search_user(query)
            setUserData(data)
        }catch{
            setUserData('no user Found')
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
        <p>
        search
        </p>

        <input type="text" onChange={(e)=>search(e.target.value)} placeholder="search" ></input>    

        <div className="flex flex-col gap-2 ">
            {loading? <Loader></Loader> : userdata.map((item)=>{ return <div className="border-2"  key={item.username}>{item.username}</div>})}
        </div>    
        </>
        
    )
}
export default Search;