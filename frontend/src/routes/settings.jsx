import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { update_user } from "../api/endpoints";

const Setting = () => {
    const storage = JSON.parse(localStorage.getItem("userData"));

    const [username, setUsername] = useState(storage ? storage.username : "");
    const [firstName, setFirstName] = useState(storage ? storage.first_name : "");
    const [lastName, setLastName] = useState(storage ? storage.last_name : "");
    const [bio, setBio] = useState(storage ? storage.bio : "");
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);

    const nav = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("bio", bio);

        if (profileImage) formData.append("profile_image", profileImage);
        if (bannerImage) formData.append("banner_image", bannerImage);

        try {
            const response = await update_user(formData);

            // Store file names in localStorage
            storage.bio=response.user.bio
            storage.first_name=response.user.first_name
            storage.last_name=response.user.last_name
            storage.banner_image=response.user.banner_image
            storage.profile_image=response.user.profile_image

            localStorage.setItem("userData", JSON.stringify(storage));

            alert("Successfully updated!");
        } catch (error) {
            alert("Error updating details.");
            console.error("Update Error:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleUpdate} className="flex flex-col gap-2" encType="multipart/form-data">
                <label>Profile Picture</label>
                <input onChange={(e) => setProfileImage(e.target.files[0])} type="file" />

                <label>Banner Image</label>
                <input onChange={(e) => setBannerImage(e.target.files[0])} type="file" />

                <label>Username</label>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" />

                <label>First Name</label>
                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" />

                <label>Last Name</label>
                <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" />

                <label>Bio</label>
                <input onChange={(e) => setBio(e.target.value)} value={bio} type="text" />

                <button type="submit">Update</button>
            </form>
        </>
    );
};

export default Setting;
