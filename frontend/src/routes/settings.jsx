import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout, update_user } from "../api/endpoints"

const Setting = () => {

    const storage = JSON.parse(localStorage.getItem('userData'))

    const [username, setUsername] = useState(storage ? storage.username : '')
    const [email, setEmail] = useState(storage ? storage.email : '')
    const [firstName, setFirstName] = useState(storage ? storage.first_name : '')
    const [lastName, setLastName] = useState(storage ? storage.last_name : '')
    const [bio, setBio] = useState(storage ? storage.bio : '')
    const [profileImage, setProfileImage] = useState(storage ? storage.profile_image : '')

    const nav=useNavigate()

    const handleLogout = async () => {
        try {
            await logout();
            nav('/login')
        } catch {
            alert ('error logging out')
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await update_user({"username":username, "profile_image": profileImage, "email":email, "first_name":firstName, "last_name":lastName, "bio":bio})
            localStorage.setItem("userData", JSON.stringify({"username":username, "email":email, "first_name":firstName, "last_name":lastName, "bio":bio}))
            alert('successfully updated')
        } catch {
            alert('error updating details')
        }
    }
    return (
        <>
            <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                <label>Profile Picture</label>
               
                <input onChange={(e) => setProfileImage(e.target.files[0])} type='file' />


                <label>Username</label>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type='text' />


                <label>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' />


                <label>First Name</label>
                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type='text' />


                <label>Last Name</label>
                <input onChange={(e) => setLastName(e.target.value)} value={lastName} type='text' />


                <label>Bio</label>
                <input onChange={(e) => setBio(e.target.value)} value={bio} type='text' />

                <button type='submit'>update</button>
            </form>
            <button onClick={handleLogout} >Logout</button>
        </>
    )
}
export default Setting;