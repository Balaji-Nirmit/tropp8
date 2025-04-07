import { useState } from "react";
import { create_club } from "../api/endpoints";

const CreateClub=()=>{
    
    const [name, setName] = useState('');
    const [institutionName, setInstitutionName] = useState("");
    const [desc, setDesc] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const institutions = [{name:'VIT Bhopal University'},{name:'IISc Bangalore'}]
    const handleUpdate = async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", desc);
            formData.append("institution_name", institutionName);
    
            if (profileImage) formData.append("profile_image", profileImage);
            if (bannerImage) formData.append("banner_image", bannerImage);
    
            try {
                const response = await create_club(formData);
    
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

                <label>name</label>
                <input onChange={(e) => setName(e.target.value)}  type="text" />

                <select onChange={(e) => setInstitutionName(e.target.value)}>
                    <option value="">Select a college</option>
                    {institutions.map((inst,index) => (
                    <option key={index} value={inst.name}>{inst.name}</option>
                    ))}
                </select>

                <label>Bio</label>
                <input onChange={(e) => setDesc(e.target.value)} type="text" />

                <button type="submit">Update</button>
            </form>
        </>
    )
}
export default CreateClub;