import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToken } from '../Context/Tokencontext';
import Logoutbutton from '../Login/Logoutbutton';




function Aboutsection() {

    //-------------------------------Data from server section-----------------------------------------
    const [aboutdescription, setAboutdescription] = useState(null)
    const [timestamp, setTimestamp] = useState([])

    const nav = useNavigate();


    const { decoded, setDecoded, getalldata, getverified } = useToken()


    useEffect(() => {
        getverified()
        getalldata()
    }, [])

    
    useEffect(() => {
        axios.get('https://brojectbackend.onrender.com/aboutsection').then((res) => {
            // console.log(res.data)
            setAboutdescription(res.data.description)
            setTimestamp(res.data.timestamp)
        })
    }, [])



    const reloadAllDataUsingUseEffect = async (data) => {

        await axios.get('https://brojectbackend.onrender.com/aboutsection').then((res) => {
            // console.log(res.data)
            setAboutdescription(res.data.description)
            setTimestamp(res.data.timestamp)
        })

    }
    //-------------------------------description section-----------------------------------------

    const [descritpioncheck, setDesriptioncheck] = useState(true)

    const confirmcheck = (query) => {
        const isconfirmed = window.confirm(query)
        if (isconfirmed) {
            return true
        }
        else {
            return false
        }
    }

    const saveaboutdescription = () => {
        const isConfirmed = confirmcheck('Do you want to save this file?');

        if (isConfirmed) {
            axios.put('https://brojectbackend.onrender.com/aboutsection/description', { aboutdescription }).then(res => { console.log(res) })
            console.log('File saved successfully!');
            setDesriptioncheck(true)

        } else {

            console.log('Save operation canceled by user.');
            setDesriptioncheck(false)

        }

    }

    const cancelaboutdescription = () => {
        const res = confirmcheck("do you want to cancel..?")
        if (res) {
            setDesriptioncheck(true)
            reloadAllDataUsingUseEffect()
        }
    }

    //------------------------------Timestamp Add new section-----------------------------------------------

    const [newdatacheck, setNewdatacheck] = useState(false)

    const [date, setDate] = useState(null) //should be null
    const [designation, setDesgination] = useState(null)
    const [company, setCompany] = useState(null)
    const [content, setContent] = useState(null)

    const savenewtimestamp = async () => {
        const res = confirmcheck("Do you want to save this file?")
        if (res) {

            await axios.put('https://brojectbackend.onrender.com/aboutsection/addtimestamp', { date, content, company, designation })
                .then(res => {
                    console.log("second magic down here", res)
                    reloadAllDataUsingUseEffect()
                })
            setNewdatacheck(false)
            setDate(null)
            setCompany(null)
            setDesgination(null)
            setContent(null)
        }

    }

    const cancelnewtimestamp = () => {
        if (date || content || company || designation) {
            const res = confirmcheck("The data written will be deleted")
            if (res) {
                setDate(null)
                setCompany(null)
                setDesgination(null)
                setContent(null)
                setNewdatacheck(false)
            }

        }
        else {
            setDate(null)
            setCompany(null)
            setDesgination(null)
            setContent(null)
            setNewdatacheck(false)
        }

    }
    //-------------------------------Timestamp edit N save section---------------------------------------------
    const [UniqueEditId, setUniqueEditId] = useState("nodata")

    const SaveEditedTimestamp = async (id) => 
        {
            const res = confirmcheck("Do you want to save this file?")
            if (res) {
                console.log(UniqueEditId[0]._id + "is the id")
                await axios.patch(`https://brojectbackend.onrender.com/aboutsection/editTimestamp/${UniqueEditId[0]._id}`,
                    { date, content, company, designation })
                    .then(res => {
                        console.log("see the magic" + res.data)
                        reloadAllDataUsingUseEffect()
                    })


                setUniqueEditId("backtonodata")
                setDate(null)
                setCompany(null)
                setDesgination(null)
                setContent(null)
            }
        }

    const canceleditedtimestamp = () => {
        const res = confirmcheck("Cancel Saving")
        if (res) {
            setUniqueEditId("backtonodata")
            setDate(null)
            setCompany(null)
            setDesgination(null)
            setContent(null)
        }
    }
    //-------------------------------Show all timestamp section N Edit ---------------------------------------------

    const edittimestamp = (id) => {
        if (newdatacheck) {
            const res = confirmcheck("The data written will be deleted(Addnew Data)")
            if (res) {
                setNewdatacheck(false)

                let newitemarray = timestamp.filter(item => item._id == id)
                console.log(newitemarray)
                setUniqueEditId(() => { return (newitemarray) })
                setDate(newitemarray[0].Date)
                setCompany(newitemarray[0].Designation)
                setDesgination(newitemarray[0].Company)
                setContent(newitemarray[0].Content)
            }
        }

        else if (date || content || company || designation) {
                        const res = confirmcheck("The data written will be deleted")
                        if (res) {
                            let newitemarray = timestamp.filter(item => item._id == id)
                            console.log(newitemarray)
                            setUniqueEditId(() => { return (newitemarray) })
                            setDate(newitemarray[0].Date)
                            setCompany(newitemarray[0].Designation)
                            setDesgination(newitemarray[0].Company)
                            setContent(newitemarray[0].Content)
                        }
                    }
         else {
                        let newitemarray = timestamp.filter(item => item._id == id)
                        console.log(newitemarray)
                        setUniqueEditId(() => { return (newitemarray) })
                        setDate(newitemarray[0].Date)
                        setCompany(newitemarray[0].Designation)
                        setDesgination(newitemarray[0].Company)
                        setContent(newitemarray[0].Content)
                    }
                    

            


    }

    const deletetimestamp = async (id) => {
        const res = confirmcheck("Do you still want to delete this")
        if (res) {
            await axios.put(`https://brojectbackend.onrender.com/aboutsection/deletetimestamp/${id}`).then(res => { console.log(res) })
            console.log(id)
            reloadAllDataUsingUseEffect()
        }
    }

    //make more effective to remove conflits btw edit and add button
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
            <Logoutbutton />
            {/* ---------------------------------------description section ---------------------------------------------*/}

            <div className="activity-section-header flex items-center justify-center h-20 bg-yellow-900 mb-24">
                <h1 className="text-4xl font-sans text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    About Section
                </h1>
            </div>


            <h1 className='text-3xl text-blue-950 font-bold mt-6 mx-4'>Description</h1>

            <div className='mb-8'>
                {descritpioncheck ?
                    <div>
                        <div className='  flex flex-col items-center justify-evenly p-[20px] bg-green-100  h-auto lg:overflow-visible overflow-y-scroll'>
                            <p className='mx-[7vw] bg-slate-00'>{aboutdescription}</p>
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={() => { setDesriptioncheck(false) }} className='flex-none  px-[1.2rem] py-[.4rem] mx-8 my-4 rounded-[8px] bg-blue-950 text-white text-1xl font-bold'>Edit</button>
                        </div>
                    </div>

                    :

                    <>
                        <div className='  w-lvw flex flex-col justify-center items-center'>

                            <div className='p-7'>
                                <textarea
                                    value={aboutdescription} onChange={(e) => { setAboutdescription(e.target.value) }} className=' w-[70vw] min-h-44 border-[2px] border-red-700 rounded-[.5em]'></textarea>
                            </div>
                            <div>
                                <button
                                    className='flex-none  px-[1.2rem] py-[.4rem] mx-8 rounded-[8px] bg-blue-950 text-white text-1xl font-bold '
                                    onClick={saveaboutdescription} >Save</button>

                                <button
                                    className='flex-none  px-[1.1rem] py-[.3rem] mx-8 border-[2px] rounded-[8px] border-blue-950 text-blue-950 text-1xl font-bold hover:bg-red-950 hover:text-white'
                                    onClick={cancelaboutdescription} >Cancel</button>
                            </div>

                        </div>
                    </>
                }
            </div>


            {/* ---------------------------------------Timestamp section ---------------------------------------------*/}



            <div className='h-28 text-white flex items-center justify-between '>

                <h1 className='text-[2em] text-blue-950 font-bold  mt-6 mx-4'>Timestamps</h1>
                <button className='mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-green-800 text-white flex-none text=2xl'
                    onClick={PressingAddData}>Add Data</button>
            </div>

            {/* --------------------------NEWDATA ADD section ----------------------*/}
            {newdatacheck ?
                <>

                    <div className='flex mx-[9vw] my-[2%] gap-[2vw]'>
                        <div className=' w-[30%] border-1 font-mono font-medium border-red-950  flex flex-col justify-between  h-[18vw] bg-blue-00'>
                            <h1>Date</h1>
                            <input type='text' onChange={(e) => { setDate(e.target.value) }} className='w-[100%] border-[.2vw] border-zinc-400 rounded-[4px]'></input>
                            <h1>Designation</h1>
                            <input type='text' onChange={(e) => { setDesgination(e.target.value) }} className='w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px]'></input>
                            <h1>Company</h1>
                            <input type='text' onChange={(e) => { setCompany(e.target.value) }} className='w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px] '></input>
                        </div>

                        <div className=' w-[70%]  flex flex-col justify-between h-[18vw] bg-blue-00 overflow-hidden font-mono font-medium'>
                            <h1 className=''>Content</h1>
                            <textarea onChange={(e) => { setContent(e.target.value) }}
                                className=' w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px] min-h-[14.8vw] max-h-[15vw]' />
                        </div>
                    </div>

                    <div className=' flex justify-center my-[2%]'>
                        <button
                            className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-black text-white flex-none text=2xl'
                            onClick={savenewtimestamp}>Save</button>
                        <button
                            className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[10px] border-2 border-blue-950 bg-white text-black flex-none text=2xl hover:bg-red-900 hover:text-white'
                            onClick={cancelnewtimestamp}>cancel</button>
                    </div>

                </>
                :
                <></>}

            {/* --------------------------Edit Timestamp Section ----------------------*/}


            {timestamp.length !== 0 ? timestamp.map(item => {
                return (
                    <div key={item._id}>
                        {/* ------------------------Picking only the selected one(when pressed edited)------------------------- */}
                        {UniqueEditId[0]._id == item._id ?
                            <div>
                                <div className='flex mx-[9vw] my-[2%] gap-[2vw]'>
                                    <div className=' w-[30%] border-1 font-mono font-medium border-red-950  flex flex-col justify-between  h-[18vw] bg-blue-00'>
                                        <h1>Date</h1>
                                        <input type='text' value={date} onChange={(e) => { setDate(e.target.value) }} className='w-[100%] border-[.2vw] border-zinc-400 rounded-[4px]'></input>
                                        <h1>Designation</h1>
                                        <input type='text' value={designation} onChange={(e) => { setDesgination(e.target.value) }} className='w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px]'></input>
                                        <h1>Company</h1>
                                        <input type='text' value={company} onChange={(e) => { setCompany(e.target.value) }} className='w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px] '></input>
                                    </div>

                                    <div className=' w-[70%]  flex flex-col justify-between h-[18vw] bg-blue-00 overflow-hidden font-mono font-medium'>
                                        <h1 className=''>Content</h1>
                                        <textarea onChange={(e) => { setContent(e.target.value) }} value={content}
                                            className=' w-[100%] border-[.2vw]  border-zinc-400 rounded-[4px] min-h-[14.8vw] max-h-[15vw]' />
                                    </div>
                                </div>

                                <div className=' flex justify-center my-[2%]'>
                                    <button
                                        className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-black text-white flex-none text=2xl'
                                        onClick={SaveEditedTimestamp}>Save</button>
                                    <button
                                        className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[10px] border-2 border-blue-950 bg-white text-black flex-none text=2xl hover:bg-red-900 hover:text-white'
                                        onClick={canceleditedtimestamp}>cancel</button>
                                </div>

                            </div>

                            :
                            //  ---------------------------SHOWING ALL TIMESTAMP AS MAP--------------------------- 
                            <div>
                                <div className=' mb-[5.8vw]  mx-[9vw] '>

                                    <div className='flex flex-col items-center justify-between'>

                                        <div className="flex items-center gap-10 justify-between bg-green-00 w-full">
                                            <div className="w-3/12 bg-blue-00">
                                                <div className="text-xl font-semibold my-3 ">{item.Date}</div>
                                                <div className="text-lg font-medium">{item.Designation}</div>
                                                <div className="text-sm ">{item.Company}</div>
                                            </div>
                                            <div className="w-9/12 text-justify ">{item.Content}</div>
                                        </div>

                                        <div className='my-2  w-full flex justify-end'>
                                            <button onClick={() => { edittimestamp(item._id) }} className=' mx-[1vw] px-[1.4rem] py-[.5rem] rounded-[8px] bg-slate-800 text-white flex-none '
                                            >Edit</button>
                                            <button onClick={() => { deletetimestamp(item._id) }} className=' mx-[1vw] justify-self-end  px-[1.4rem] py-[.5rem] rounded-[8px] bg-red-900 text-white flex-none hover:bg-red-700'
                                            >Delete</button>
                                        </div>

                                    </div>



                                </div>


                            </div>

                        }


                    </div>
                )
            })




                :




                <>
                    <div className='flex justify-center items-center w-lvw'>
                        <h1 className='m-0 p-0 text-red-950 text-[1.6vw]'>No Data To Show</h1>
                    </div>
                </>
            }



        </div>
    )
}

export default Aboutsection