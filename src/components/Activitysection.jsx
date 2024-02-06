import React, { useEffect, useRef, useState } from 'react';
import activity from './test/main.json'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../Context/Tokencontext';
import Logoutbutton from '../Login/Logoutbutton';
import loadingimg from '../images/lg.gif'
import loadingsvg from '../images/ll.gif'

const ActivitySection = () => {



    const [dataloading, setDataloading] = useState(false) //set loading page which makes when time elapsed for cloudinary
    
    
    const { getalldata, getverified} = useToken()
    
    
    useEffect(() => {
        getverified()
        getalldata()
        getallactivity()
    }, [])
    
    
    

    
    
    //----------------------------------get all data-------------------------------
    const [activitySections, setActivitySection] = useState([])
    
    
    
    const getallactivity=async ()=>{
        setDataloading(true)
        await axios.get('https://brojectbackend.onrender.com/activity').then((res) => {
            console.log(res.data)
            setActivitySection(res.data)
            
        })
        setDataloading(false)


    }

    const reloadAllDataUsingUseEffect = async () => {

        await axios.get('https://brojectbackend.onrender.com/activity').then((res) => {
            setActivitySection(res.data)
        })

    }
    const [UniqueEditId, setUniqueEditId] = useState("nodata")
    const imageref = useRef()

    const [link, setLink] = useState()
    const [img, setImg] = useState()
    const [content, setContent] = useState()

    const confirmcheck = (query) => {
        const isconfirmed = window.confirm(query)
        if (isconfirmed) {
            return true
        }
        else {
            return false
        }
    }

    const editactivity = (id) => {

        if (newdatacheck) {
            const res = confirmcheck("The data written will be deleted(Addnew Data)")
            if (res) {
                setNewdatacheck(false)

                let newitemarray = activitySections.filter(item => item._id == id)
                console.log(newitemarray)
                setUniqueEditId(newitemarray)
                setLink(newitemarray[0].link)
                setImg(null)
                setContent(newitemarray[0].content)
            }
        }
        else if (link || content || img) {
                    const res = confirmcheck("The data written will be deleted")
                    if (res) {
                        let newitemarray = activitySections.filter(item => item._id == id)
                        console.log(newitemarray)
                        setUniqueEditId(newitemarray)
                        setLink(newitemarray[0].link)
                        setImg(null)
                        setContent(newitemarray[0].content)
                    }
                }

        else {
                    let newitemarray = activitySections.filter(item => item._id == id)
                    console.log(newitemarray)
                    setUniqueEditId(newitemarray)
                    setLink(newitemarray[0].link)
                    setImg(null)
                    setContent(newitemarray[0].content)
                }

    }

    const deleteactivity = async (id) => {

        const res = confirmcheck("Do you still want to delete this")
        if (res) {
            await axios.put(`https://brojectbackend.onrender.com/activity/delete/${id}`).then(res => {
                console.log(res)
                console.log(id)
                reloadAllDataUsingUseEffect()
            })

        }

    }

    const saveactivity = async () => {
        const res = confirmcheck("Do you want to save this file?")
        setLoading(true)
        if (res) {
            await axios.patch(`https://brojectbackend.onrender.com/activity/edititem/${UniqueEditId[0]._id}`, { img, link, content })
                .then(res => {
                    console.log("second magic down here", res)
                    reloadAllDataUsingUseEffect()
                })
            setUniqueEditId("sks")
            setLink(null)
            setImg(null)
            setContent(null)
        }
        setLoading(false)

    }
    const cancelactivity = () => {
        const res = confirmcheck("do you want to cancel..?")
        if (res) {
            setUniqueEditId("nodataagain")
            reloadAllDataUsingUseEffect()
            setLink(null)
            setImg(null)
            setContent(null)
        }
    }

    const imagetobase64andupload = (e) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        if (file) {
            const getbase64code = (file) => {

                var reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = () => {
                    console.log(reader.result)
                    setImg(reader.result)
                }
                reader.onerror = (err) => {
                    console.log(err)
                }

            }



            if (file.type.startsWith('image/')) {
                const maxSizeInBytes = 1 * 1024 * 1024; // Example limit: 5MB
                if (file.size <= maxSizeInBytes) {
                    getbase64code(file)
                }
                else {
                    const res = confirmcheck("You're attempting to upload an image that exceeds 5 MB in size. Are you sure you want to continue with the upload?")
                    if (res) {
                        getbase64code(file)
                    }
                    else {
                        // setImg(null)
                    }
                }

            }
            else {
                const res = confirmcheck("This is not an image. Please upload an image file. Press 'CANCEL' to cancel the upload or 'OK' to upload it anyway.")
                if (res) {
                    getbase64code(file)
                }
                else {
                    // setImg(null)
                }
            }


        }
    }

    //------------------------------Activity Add new section-----------------------------------------------

    const [newdatacheck, setNewdatacheck] = useState(false)


    const cancelAddNewactivity = () => {
        const res = confirmcheck("do you want to cancel..?")
        if (res) {
            setNewdatacheck(false)
            reloadAllDataUsingUseEffect()
            setLink(null)
            setImg(null)
            setContent(null)
        }
    }

    const saveAddNewactivity = async () => {
        const res = confirmcheck("Do you want to save this file?")
        setLoading(true)
        if (res) {

            await axios.put('https://brojectbackend.onrender.com/activity/addactivity', { img, link, content })
                .then(res => {
                    console.log("second magic down here", res)
                    reloadAllDataUsingUseEffect()
                })
            setNewdatacheck(false)
            setLink(null)
            setImg(null)
            setContent(null)
        }
        setLoading(false)

    }

    //------------------------------Loading Time-----------------------------------------------
    const [loading, setLoading] = useState(false)
    //------------------------------------------------
    function PressingAddData() {
        console.log("length is ", UniqueEditId[0]._id)
        if (UniqueEditId[0]._id) {
            const res = confirmcheck("The data will be override(Edit data)")
            if (res) {
                setNewdatacheck(true)
                setUniqueEditId("ayyoopoyallo")
                setLink(null)
                setImg(null)
                setContent(null)
            }
        }
        else {
            setNewdatacheck(true)

        }
    }

    return (
        <div>

            {dataloading ?
                <div className=' flex w-full justify-center items-center overflow-hidden absolute top-20'>

                    <img className='h-28' src={loadingimg}></img>
                </div>
                : <></>}



            <Logoutbutton/>

            <div className="activity-section-header flex items-center justify-center h-20 bg-blue-900 mb-24">
                <h1 className="text-4xl font-sans text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    Activity Section
                </h1>
            </div>


            <div className="activity-controls mb-12">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl text-blue-950 font-bold">Activities</h1>
                    <button className="bg-green-800 text-white py-1 px-3 rounded-md text-base" onClick={PressingAddData}>
                        Add Data
                    </button>
                </div>
            </div>


            {/* --------------------------NEWDATA ADD section ----------------------*/}




            {newdatacheck ?
                <div className='mx-[5%]  text-md'>


                    <div className='mb-[5vw]'>

                        <div className='flex gap-20  h-[14vw]  bg-zinc-100'>
                            <div className=' flex-none object-contain h-[13vw] w-[20vw] bg-green-100 flex justify-center items-center overflow-hidden'>
                                <img className='w-auto h-auto' src={img}></img>
                            </div>
                            <textarea onChange={(e) => { setContent(e.target.value) }} className='h-[13vw] w-full  overflow-auto border-2 border-zinc-400' />
                        </div>

                        <div className=' flex w-full justify-between' >
                            <div>
                                <input onChange={(e) => { setLink(e.target.value) }} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter The Link '></input>
                            </div>
                            <input className='hidden' onChange={(e) => imagetobase64andupload(e)} ref={imageref} type='file' /> {/*hidden files*/}
                            <button className='bg-blue-900 border-[1px] text-white rounded-[5px] p-2 py-1 text-sm'
                                onClick={() => imageref.current.click()}>Upload Image</button>
                        </div>


                        <div className='flex justify-end gap-5 mt-4'>
                            <button className=' bg-green-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-green-950'
                                onClick={saveAddNewactivity}>Save</button>
                            <button className=' bg-slate-100 text-slate-800 w-24 h-8 rounded-[6px] text-md border-2 border-slate-800 hover:bg-red-800 hover:text-white'
                                onClick={cancelAddNewactivity}>Cancel</button>
                        </div>


                    </div>
                </div>
                :
                <></>}





            {/* --------------------------Edit Activities Section ----------------------*/}
            <div className=' mx-[5%]  text-md'>
                {activitySections.length !== 0 ? activitySections.map((i, key) => {

                    return (

                        <div key={key}>
                            {/* ------------------------Picking only the selected one(when pressed edited)------------------------- */}
                            {

                                UniqueEditId[0]._id === i._id ?
                                    <div className='mb-[5vw]'>
                                        {loading ? <div className='flex w-full items-center justify-center'><img src={loadingsvg} className='size-20'></img></div> : null}


                                        <div className='flex gap-20  h-[14vw]  bg-zinc-100'>
                                            <div className=' flex-none object-contain h-[13vw] w-[20vw] bg-green-100 flex justify-center items-center overflow-hidden'>
                                                <img className='w-auto h-auto' src={UniqueEditId[0].img}></img>
                                            </div>
                                            <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className='h-[13vw] w-full  overflow-auto border-2 border-zinc-400' />
                                        </div>

                                        <div className=' flex w-full justify-between' >
                                            <div>
                                                <input value={link} onChange={(e) => { setLink(e.target.value) }} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter The Link '></input>
                                            </div>
                                            <input className='hidden' onChange={(e) => imagetobase64andupload(e)} ref={imageref} type='file' /> {/*hidden files*/}
                                            <button className='bg-blue-900 border-[1px] text-white rounded-[5px] p-2 py-1 text-sm'
                                                onClick={() => imageref.current.click()}>Upload Image</button>
                                        </div>


                                        <div className='flex justify-end gap-5 mt-4'>
                                            <button className=' bg-green-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-green-950'
                                                onClick={saveactivity}>Save</button>
                                            <button className=' bg-slate-100 text-slate-800 w-24 h-8 rounded-[6px] text-md border-2 border-slate-800 hover:bg-red-800 hover:text-white'
                                                onClick={cancelactivity}>Cancel</button>
                                        </div>


                                    </div>
                                    :
                                    //  ---------------------------SHOWING ALL Activites AS MAP--------------------------- 
                                    <div className='mb-[5vw] flex flex-col'>

                                        <div className='flex md:gap-20 gap-10 md:flex-row flex-col justify-center items-center bg-zinc-100'>
                                            <div className=' flex-none object-contain md:h-[13vw] md:w-[20vw] w-44 h-32 bg-green-100 flex justify-center items-center overflow-hidden'>
                                                <img className='w-auto h-auto' src={i.img}></img>
                                            </div>

                                            <div className=' overflow-auto'>
                                                <p >{i.content}</p>
                                            </div>


                                        </div>

                                        <div>
                                            <a href={i.link}>{i.link}</a>
                                        </div>

                                        <div className='flex justify-end gap-5'>
                                            <button className=' bg-slate-800 text-white w-24 h-8 rounded-[6px] text-md hover:bg-zinc-950'
                                                onClick={() => editactivity(i._id)}>Edit</button>
                                            <button className=' bg-red-800 text-white w-24 h-8 rounded-[6px] text-md hover:bg-red-700'
                                                onClick={() => deleteactivity(i._id)}>Delete</button>
                                        </div>


                                    </div>



                            }

                        </div>
                    )
                })
                    :
                    <div>
                        <div className='flex justify-center items-center w-full'>
                            <h1 className='m-0 p-0 text-red-950 text-[1.6vw]'>No Data To Show</h1>
                        </div>
                    </div>
                }
            </div>


        </div>

        
    );
};

export default ActivitySection;
