import { useState } from "react";
import { createPost } from "../api/endpoints";

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const imageHandle = (e) => {
        setImages([...images,e.target.files[0]]); // Spread the FileList into an array
    };

    const handleCreation = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("description", description);
        images.forEach((image) => formData.append("image_files", image));
        try {
            await createPost(formData);
        } catch {
            alert("Error creating post");
        }
    };

    return (
        <>
            <form onSubmit={handleCreation} encType="multipart/form-data">
                <input 
                    type="text" 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Description" 
                />
                <input 
                    type="file" 
                    onChange={imageHandle} 
                    accept="image/*" 
                    multiple 
                    required 
                />
                <button type="submit">Create</button>
            </form>
        </>
    );
};

export default CreatePost;
