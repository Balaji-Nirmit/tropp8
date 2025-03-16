import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/endpoints";

const Register = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [registration, setRegistration] = useState('');
    const nav = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            try {
                await register(username, email, firstname, lastname, password, registration);
                nav('/login')
            } catch {
                alert('Invalid data')
            }
        }
    }

    const handleNavigate = () => {
        nav('/login');
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600  p-4">
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Register</h1>
                    <p className="text-center text-gray-500 mt-2">
                        Create a new account by filling in the details below.
                    </p>

                    <form onSubmit={handleRegister} className="mt-6">
                        <div className="flex flex-col gap-4">
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Username"
                                required
                            />
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            <div className="flex gap-4">
                                <input
                                    className="border border-gray-300 px-4 py-3 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    type="text"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                    required
                                />
                                <input
                                    className="border border-gray-300 px-4 py-3 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                    type="text"
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            <input
                                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                type="text"
                                onChange={(e) => setRegistration(e.target.value)}
                                placeholder="Registration Number"
                                required
                            />

                            <button
                                type="submit"
                                className="py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4 text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={handleNavigate}
                            className="text-purple-600 hover:underline font-medium"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Register;