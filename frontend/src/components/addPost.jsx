import { useState } from "react";
import { createPost } from "../api/endpoints";
import { IoCloseCircle } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { AiOutlineCamera } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative, Mousewheel, Pagination } from 'swiper/modules';


const AddPost = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    const imageHandle = (e) => {
        setImages([...images, e.target.files[0]]); // Spread the FileList into an array
    };

    const handleCreation = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("description", description);
        images.forEach((image) => formData.append("image_files", image));
        try {
            await createPost(formData);
            openCloseModal()
        } catch {
            alert("Error creating post");
        }
    };
    const openCloseModal = () => {
        setIsOpen(!isOpen)
        setImages(!isOpen ? [] : images)
    }
    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
      };

    return (
        <>
            <button
                onClick={openCloseModal}
                className="w-full text-center text-lg font-semibold text-gray-700 
  relative group hover:text-purple-600 transition-all duration-300 cursor-pointer">

                <span className="flex items-center justify-center gap-3">
                    <FaPlus className="text-xl text-purple-500 group-hover:text-pink-500 transition-all duration-300" />
                    Add Post
                </span>

                {/* Underline Animation */}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-500 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>


            {/* overlay modal */}
            {isOpen && (
                <div className="fixed z-10 top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.5)] sm:flex sm:justify-center sm:items-center">
                    <div className="w-screen h-screen sm:w-[600px] sm:h-[500px] bg-white rounded-2xl p-2">
                        <form onSubmit={handleCreation} encType="multipart/form-data" className="h-full">
                            <div className="flex flex-col h-full gap-2 relative">
                                <div className="flex justify-between">
                                    <h2 className="text-gray-500 text-2xl font-bold">Add Post</h2>
                                    <button onClick={openCloseModal} className="text-red-500 text-2xl cursor-pointer"><IoCloseCircle /></button>
                                </div>
                                <textarea type="text"
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's in your mind..."
                                    required
                                    className="w-full p-2 border-2 border-gray-300 rounded-lg"
                                />
                                <div className="">

                                    <Swiper
                                        modules={[Pagination, Mousewheel, EffectCreative]}
                                        effect={'creative'}
                                        creativeEffect={{
                                            prev: {
                                                shadow: true,
                                                translate: [0, 0, -400],
                                            },
                                            next: {
                                                translate: ['100%', 0, 0],
                                            },
                                        }}
                                        direction="horizontal"
                                        mousewheel={true}
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        pagination={{
                                            dynamicBullets: true,
                                            clickable: true,
                                        }}
                                        onSlideChange={() => console.log("slide change")}
                                        onSwiper={(swiper) => console.log(swiper)}
                                        className="w-[460px] h-[300px] rounded-2xl cursor-pointer shadow-sm"
                                    >
                                        {images.map((image, index) => (
                                            <SwiperSlide
                                                key={index}
                                                className="w-[460px] h-[300px] overflow-hidden rounded-2xl bg-cover bg-center relative"
                                            >
                                                <div className="flex gap-2 justify-end absolute top-0 right-0 z-11">
                                                    <button onClick={()=>handleRemoveImage(index)} className="cursor-pointer text-2xl"><IoCloseCircle className="text-red-500" /></button>
                                                    <button className="cursor-pointer text-2xl"><MdEdit /></button>
                                                </div>
                                                <img
                                                    src={URL.createObjectURL(image)} alt="preview"
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                <div className="flex w-full justify-between items-center absolute bottom-0 border-t-1 border-t-gray-200 py-2">
                                    <label
                                        htmlFor="fileInput"
                                        className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition-transform shadow-lg"
                                    >
                                        <AiOutlineCamera size={26} className="animate-bounce" />
                                        Images!
                                    </label>
                                    <input
                                        id="fileInput"
                                        type="file" onChange={imageHandle}
                                        accept="image/*"
                                        multiple
                                        required
                                        className="hidden"
                                    />
                                    <button type="submit" className="p-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-all duration-300">Add Post</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </>
    )

}
export default AddPost;