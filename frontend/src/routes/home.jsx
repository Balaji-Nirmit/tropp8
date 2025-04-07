import AddPost from "../components/addPost"
import MidHome from "../components/midHome"

const Home=()=>{
    return (
        <>
            <AddPost />
            <MidHome specificUserProfile={null}/>
        </>
    )
}
export default Home