// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie'
import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { useToken } from '../Context/Tokencontext';
const Login = () => {

    const { decoded, setDecoded, getalldata, getverified,error }=useToken()

    const nav=useNavigate()
    const cookies = new Cookies()
    useEffect(() => {
        console.log(error+"-----------------"+decoded)
        // getverified()
        const jwt=cookies.get('jwt')
        if(jwt){
            nav('/home')
        }
        // if(!error){
        //     // getalldata()
        //     nav('/home')
        // }
        // else if(decoded){
        // }
    }, [])


    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('')



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://brojectbackend.onrender.com/api/login', { name, password }, );
            setResponse(response.data)
            console.log("login place \n"+response.data.token)
            if(response.data.message ==='Login successful'){
                // cookies.set('jwt',response.data.token,{httpOnly:true})
                localStorage.setItem('jwt', response.data.token);
                nav('/home')
            }

        } catch (error) {
            
            console.error('Login failed:', error); // Handle error response
        }
    }


    return (
        <div className="flex justify-center items-center h-screen">
            {/* {decoded?<>{decoded.userId}</>:<></>} */}
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input type="text" id="name" required autoComplete="username" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input type="password" autoComplete="current-password" id="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
                    </div>
                    {response.success == 1 ?
                        <div className='text-green-900'>{response.message}</div>
                        :
                        <div className='text-red-700'>{response.message}</div>
                    }
                </form>
            </div>
        </div>
    );
};

export default Login;
