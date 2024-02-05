import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

function Addnewdata({ newdatasendbackcheck ,getalldata,loadingcheck}) {
    const uploadimageref = useRef()
    const [imagebase64code, setImagebase64code] = useState() //image uploaded converrted to base64 then only send to server
    const [linktext, setLinktext] = useState(null) //link we uploaded
    const [itemdescription, setItemdescription] = useState(null) // the desription of item we uploaded
    const [loading,setLoading]=useState(false)
    
    const handleuploadclick = () => {
        if (uploadimageref) {
            uploadimageref.current.click()
        }
    }
    const confirmcheck = (query) => {
        const isconfirmed = window.confirm(query)
        if (isconfirmed) {
            return true
        }
        else {
            return false
        }
    }
    const imagetobase64andupload = (e) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        if (file) {

            const confirmfunction = (query) => {
                const isConfirmed = window.confirm(query)
                if (isConfirmed) {
                    return true
                }
                else {
                    return false
                }
            }
            const getbase64code = (file) => {

                var reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = () => {
                    console.log(reader.result)
                    setImagebase64code(reader.result)
                }
                reader.onerror = (err) => {
                    console.log(err)
                }

            }



            if (file.type.startsWith('image/')) {
                const maxSizeInBytes = 5 * 1024 * 1024; // Example limit: 10MB
                if (file.size <= maxSizeInBytes) {
                    getbase64code(file)
                }
                else {
                    const res = confirmfunction("You're attempting to upload an image that exceeds 5 MB in size. Are you sure you want to continue with the upload?")
                    if (res) {
                        getbase64code(file)
                    }
                    else {

                    }
                }

            }
            else {
                const res = confirmfunction("This is not an image. Please upload an image file. Press 'CANCEL' to cancel the upload or 'OK' to upload it anyway.")
                if (res) {
                    getbase64code(file)
                }
                else {

                }
            }


        }
    }

    const cancellall = () => {
        if (itemdescription || linktext || imagebase64code) {
            const res = confirmcheck("The data written will be deleted")
            if (res) {
                setLinktext(null)
                setImagebase64code(null)
                setItemdescription(null)
                newdatasendbackcheck(null)
            }

        }
        else {
            newdatasendbackcheck(null)
            setImagebase64code(null)
            setItemdescription(null)
            newdatasendbackcheck(null)
        }

    }
    const saveoneitem = async () => {
        setLoading(true) //will be loading true until the axios.put come back with the data
        const res = confirmcheck("Do you want to save this file?")
        if (res) {
            //upload to db
            await axios.put('https://brojectbackend.onrender.com/biography/additem',{itemdescription,imagebase64code,linktext})
            .then(res=>{
                console.log("second magic down here",res)
                getalldata("jii")
            })
            setImagebase64code(null)
            setItemdescription(null)
            newdatasendbackcheck(null)
        }
        setLoading(false)
        loadingcheck(false)
        
    }

    if (loading){
        newdatasendbackcheck(null)
        console.log("hiiii")
        loadingcheck(true)
    }

    return (
        <div className=''>
            <div className=''>


                <div className=' h-[24vw] border-2 border-red-00 mb-[.8vw] mx-5 overflow-hidden '>
                    <div className='grid grid-cols-2 m-[1.5vw] mb-0 bg-orange-00'>

                        <div className='flex flex-col'>

                            <div className=' w-[28vw] h-[15vw] object-contain rounded-[8px] border-blue-100 border-2 overflow-hidden'>
                                <img src={imagebase64code} className=' w-[28vw] h-[15vw] object-contain'></img>
                            </div>
                            <input ref={uploadimageref} type='file' className='hidden' onChange={(e) => { imagetobase64andupload(e) }} ></input>
                            <div className='flex justify-center w-[28vw]'>
                                <button onClick={handleuploadclick} className='border-2 border-rose-950 bg-green-200 my-[.6vw] px-[1vw] py-[.3vw] rounded-3xl text-[.9vw]' >Upload the Image</button>

                            </div>


                        </div>


                        <div className=' m-0 flex items-start p-0'>
                            <textarea className=' w-[44vw] min-h-[15vw]  max-h-[17vw] overflow-y-scroll rounded-[8px] p-1 border-blue-300 border-2' onChange={e => setItemdescription(e.target.value)}></textarea>
                        </div>

                    </div>

                    <div className=' mx-[1vw] h-[4vw] flex items-center' >
                        <input type='text' onChange={(e) => setLinktext(e.target.value)} className='mx-[1vw] h-[1.5vw] border-2 border-slate-400 rounded-md w-[28vw]'  ></input>
                    </div>
                </div>
                <div className=' flex justify-center '>
                    <button
                        className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-black text-white flex-none text=2xl'
                        onClick={saveoneitem}>Save</button>
                    <button
                        className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[10px] border-2 border-blue-950 bg-white text-black flex-none text=2xl hover:bg-red-900 hover:text-white'
                        onClick={cancellall} >cancel</button>
                </div>

            </div>
        </div>
    )

    // return (
    //     <div className=''>
    //         <div className=''>
    //             <div className='border border-red-300 mb-4 mx-4 lg:mx-auto lg:w-3/4 xl:w-1/2'>

    //                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
    //                     <div className='flex flex-col'>
    //                         <div className='w-full h-48 md:h-64 overflow-hidden rounded-lg border border-blue-100'>
    //                             <img src={imagebase64code} alt="Item Image" className='w-full h-full object-cover'></img>
    //                         </div>
    //                         <input
    //                             ref={uploadimageref}
    //                             type='file'
    //                             className='hidden'
    //                             onChange={(e) => { imagetobase64andupload(e) }} />
    //                         <div className='flex justify-center'>
    //                             <button
    //                                 onClick={handleuploadclick}
    //                                 className='border border-rose-950 bg-green-200 my-2 px-4 py-1 rounded-lg text-xs md:text-sm'>
    //                                 Upload Image
    //                             </button>
    //                         </div>
    //                     </div>

    //                     <div className='flex items-start'>
    //                         <textarea
    //                             className='w-full min-h-48 md:min-h-64 max-h-72 overflow-y-auto rounded-lg p-2 border border-blue-300'
    //                             onChange={e => setItemdescription(e.target.value)}>
    //                         </textarea>
    //                     </div>
    //                 </div>

    //                 <div className='flex items-center p-4'>
    //                     <input
    //                         type='text'
    //                         onChange={(e) => setLinktext(e.target.value)}
    //                         className='mx-2 h-6 border border-slate-400 rounded-md w-full md:w-2/3' />
    //                 </div>
    //             </div>

    //             <div className='flex justify-center'>
    //                 <button
    //                     className='mx-8 px-6 py-2 rounded-lg bg-black text-white text-2xl'
    //                     onClick={saveoneitem}>
    //                     Save
    //                 </button>
    //                 <button
    //                     className='mx-8 px-6 py-2 rounded-lg border-2 border-blue-950 bg-white text-black text-2xl hover:bg-red-900 hover:text-white'
    //                     onClick={cancellall}>
    //                     Cancel
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );



}

export default Addnewdata