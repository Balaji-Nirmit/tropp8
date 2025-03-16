import { useState } from "react";
const Otp = () => {
    const handleValidation=()=>{
        
    }
   
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800">OTP Validation</h1>
                    <p className="text-center text-gray-500 mt-2">
                        Enter the OTP
                    </p>

                    <form onSubmit={handleValidation} className="mt-6">
                        <div className="flex flex-col gap-4">
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="text"
                                placeholder="Username"
                                required
                            />
                            <button
                                type="submit"
                                className="py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-all duration-300"
                            >
                                Verify
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Otp;