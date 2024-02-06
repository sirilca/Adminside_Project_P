import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useToken } from '../Context/Tokencontext';
import { useNavigate } from 'react-router-dom';
import Logoutbutton from '../Login/Logoutbutton';
import loadingimg from '../images/lg.gif'

function HeroSection() {

    const [dataloading, setDataloading] = useState(false) //set loading page which makes when time elapsed for cloudinary
    
    
    const nav = useNavigate();
    

    const { decoded, setDecoded, getalldata, getverified } = useToken()
    
    
    useEffect(() => {
        getverified()
        getalldata()
        getallherosectiondata()
    }, [])
    
    
    
    
    const [description, setDescription] = useState('');
    const [mailingApi, setMailingApi] = useState('');
    const [descriptioncheck, setDescriptioncheck] = useState(false);
    const [mailingApicheck, setMailingApicheck] = useState(false);
    
    
    const getallherosectiondata= async () => {
        setDataloading(true)
        await axios.get('https://brojectbackend.onrender.com/herosection').then((res) => {
            setDescription(res.data.description);
            setMailingApi(res.data.MailingApi);
        });
        setDataloading(false)
    }
    


    const saveDescription = () => {
        const isConfirmed = window.confirm('Do you want to save this description?');
        if (isConfirmed) {
            axios.put('https://brojectbackend.onrender.com/herosection/description', { description }).then(res => console.log(res));
            setDescriptioncheck(false)
        }
    };

    const saveMailingApi = () => {
        const isConfirmed = window.confirm('Do you want to save this mailing API?');
        if (isConfirmed) {
            axios.put('https://brojectbackend.onrender.com/herosection/mailingApi', { mailingApi }).then(res => console.log(res));
            setMailingApicheck(false)
        }
    };
    
    const cancelMailingApi = () => {
        const isConfirmed = window.confirm('Do you want to cancel');
        if (isConfirmed) {
            setMailingApicheck(false)
        }
    };
    const cancelDescription = () => {
        const isConfirmed = window.confirm('Do you want to Cancel');
        if (isConfirmed) {
            setDescriptioncheck(false)
        }
    };

    return (
        <div>

            {dataloading ?
                <div className=' flex w-full justify-center items-center overflow-hidden absolute top-20'>

                    <img className='h-28' src={loadingimg}></img>
                </div>
                : <></>}

            <Logoutbutton />

            <div className="activity-section-header flex items-center justify-center h-20 bg-red-900 mb-24">
                <h1 className="text-4xl font-sans text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    Hero Section
                </h1>
            </div>



            <div className='mx-[5%]'>

            <h1 className='text-3xl text-blue-950 font-bold my-6 mx-4'>Description</h1>

            {!descriptioncheck?
                <div className='mb-8'>
                        <p className='w-full min-h-40 border-2 border-red-950 rounded-lg p-2 bg-zinc-300 '
                    >{description}</p>
                    <div className='flex justify-center'>
                        <button
                            className='mx-4 px-4 py-2 my-2 rounded-md bg-blue-900 text-white'
                            onClick={() => { setDescriptioncheck(true) }}
                        >
                            Edit Description
                        </button>
                    </div>
                </div>
                
                :
                
                <>
                    <div className='mb-8'>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full min-h-40 border-2 border-zinc-700 rounded-lg p-2 '
                        ></textarea>

                        <div className='flex justify-center'>
                            <button
                                className='mx-4 my-2 px-4 py-2 rounded-md bg-green-900 text-white'
                                onClick={saveDescription}> Save</button>
                            <button
                                className='mx-4 px-4 my-2 py-2 rounded-md bg-red-900 text-white'
                                onClick={cancelDescription}
                            > Cancel
                            </button>
                        </div>
                    </div>
                </>
            }
            <h1 className='text-3xl text-blue-950 font-bold my-6 mx-4'>Mailing API</h1>

            {!mailingApicheck?
                <div className='mb-8'>
                        <p className='w-full border-2 border-zinc-700 rounded-lg p-2 h-12 bg-zinc-300'  >{mailingApi}</p>
                    <div className='flex justify-center'>
                        <button
                            className='mx-4 px-4 py-2 my-2 rounded-md bg-blue-900 text-white'
                            onClick={() => { setMailingApicheck(true) }}
                        >
                            Edit Mailing Api
                        </button>
                    </div>
                </div>

                :

                <>
                    <div className='mb-8'>
                        <input
                            value={mailingApi}
                            onChange={(e) => setMailingApi(e.target.value)}
                            className='w-full border-2 border-red-700 rounded-lg p-2 h-12 '
                            placeholder='Enter Mailing API URL'
                        ></input>

                        <div className='flex justify-center'>
                            <button
                                className='mx-4 my-2 px-4 py-2 rounded-md bg-green-900 text-white'
                                onClick={saveMailingApi}> Save</button>
                            <button
                                className='mx-4 px-4 my-2 py-2 rounded-md bg-red-900 text-white'
                                onClick={cancelMailingApi}
                            > Cancel
                            </button>
                        </div>
                    </div>
                </>
            }



            </div>

        </div>
    );
}

export default HeroSection;
