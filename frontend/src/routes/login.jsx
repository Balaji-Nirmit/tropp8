import { useState } from "react";
import { useAuth } from "../store/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { auth_login } = useAuth();
    const nav = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault();
        auth_login(username, password)

    }
    const handleNavigate = () => {
        nav('/register');
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800">Welcome</h1>
                    <p className="text-center text-gray-500 mt-2">
                        Enter your details to log in.
                    </p>

                    <form onSubmit={handleLogin} className="mt-6">
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
                            <button
                                type="submit"
                                className="py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-all duration-300"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4 text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={handleNavigate}
                            className="text-purple-600 cursor-pointer hover:underline font-medium"
                        >
                            Sign up here
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;