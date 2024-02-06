import React, { useEffect, useRef, useState } from 'react'
import jsondat from '../test/main.json'
import Addnewdata from './Addnewdata'
import axios from "axios"
import { useToken } from '../../Context/Tokencontext';
import { useNavigate } from 'react-router-dom';
import Logoutbutton from '../../Login/Logoutbutton';
import loadingimg from '../../images/lg.gif'
import loadingsvg from '../../images/ll.gif'


function Biography() {


    const nav = useNavigate();


    const { decoded, setDecoded, getalldata, getverified } = useToken()


    useEffect(() => {
        getverified()
        getalldata()
        getallbiodata()
    }, [])

    const [dataloading, setDataloading] = useState(false) //set loading page which makes when time elapsed for cloudinary




    const [biodata, setBiodata] = useState(null) //contains biodata
    const [items, setItems] = useState([]) // contains all items array from server, if item then show all items


    const getallbiodata=async ()=>{
        setDataloading(true)
        await axios.get('https://brojectbackend.onrender.com/biography').then((res) => {
            // console.log(res.data)
            setBiodata(res.data.description)
            setItems(res.data.items)
            setDataloading(false)
        })
    }

    const [bioedit, setBioedit] = useState(true) //recheck when pressed cancel and save
    const [imagebase64code, setImagebase64code] = useState() //image uploaded converrted to base64 then only send to server
    const [linktext, setLinktext] = useState(null) //link we uploaded
    const [itemdescription, setItemdescription] = useState(null) // the desription of item we uploaded
    const [itemidcheck, setItemidcheck] = useState("nodata")
    //to check if the id we send ,when pressed edit..if same as in item._id proceeds to edit..when cancel pressed itemid to null thus making bac to normal way
    const [newdatacheck, setNewdatacheck] = useState() //check from other addnewdata.jsx if true will show addnewdata.jsx callback function when false is called back then new data box will be cacelled

    const [loading, setLoading] = useState(false) //set loading page which makes when time elapsed for cloudinary

    function setthedesciptionvalue(e){
        setItemdescription(e.target.value)
    }

    const reloadAllDataUsingUsEffect=(data)=>{

        setDataloading(true)
            axios.get('https://brojectbackend.onrender.com/biography').then((res) => {
                
                console.log(res.data)
                setBiodata(res.data.description)
                setItems(res.data.items)
            })
            
            if (data="jii"){
                axios.get('https://brojectbackend.onrender.com/biography').then((res) => {
                    console.log(res.data)
                    setBiodata(res.data.description)
                    setItems(res.data.items)
                })
            }

            setDataloading(false)
    }



    const uploadimageref = useRef(null)

    const confirmcheck = (query) => {
        const isconfirmed = window.confirm(query)
        if (isconfirmed) {
            return true
        }
        else {
            return false
        }
    }

    const handleuploadclick = () => {
        if (uploadimageref.current) {
            uploadimageref.current.click()
        }

    }

    const savebiography = (e) => {

        const isConfirmed = window.confirm('Do you want to save this file?');

        if (isConfirmed) {
            //save the file to db
            axios.put('https://brojectbackend.onrender.com/biography/description',{biodata}).then(res=>{console.log(res)})
            console.log('File saved successfully!');
            setBioedit(true)

        } else {

            console.log('Save operation canceled by user.');
            setBioedit(false)

        }
        console.log(biodata)

    }
    const cancelbiography = () => {
        const res = confirmcheck("do you want to cancel..?")
        if (res) {
            setBioedit(true)
            reloadAllDataUsingUsEffect()
        }
    }
    const cancellall = () => {
        if (itemdescription || linktext || imagebase64code) {
            const iscomfirmed = window.confirm("The data written will be deleted")

            if (iscomfirmed) {
                setItemidcheck("nodata") //if we put "" or null it pocess error as itemidcheck[0]._id pocess reading of undefined
                setImagebase64code(null)
                setLinktext(null)
                setItemdescription(null)
            }
        }
        else {
            setItemidcheck("nodata")
            setImagebase64code(null)
            setLinktext(null)
            setItemdescription(null)
        }
    }
    const saveoneitem = async () => {
        const res = confirmcheck("Do you want to save this file?")
        if (res) {
            setLoading(true)

            console.log(itemidcheck[0]._id +"is the id")
            console.log(itemdescription+"-"+linktext+"-"+imagebase64code)
            await axios.patch(`https://brojectbackend.onrender.com/biography/edititem/${itemidcheck[0]._id}`, 
                { itemdescription, imagebase64code, linktext })
                .then(res=>{
                    console.log("see the magic"+res)
                    reloadAllDataUsingUsEffect()
                })
            setItemidcheck("nodata")
            setItemdescription(null)
            setImagebase64code(null)
            setLinktext(null)
            setLoading(false)
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

    const edittheitems = (id) => {
    
        if (newdatacheck) {
            const res = confirmcheck("The data written will be deleted(Addnew Data)")
            if (res) {
                setNewdatacheck(false)

                let newitemarray = items.filter(item => item._id == id)
                console.log(newitemarray)
                setItemidcheck(() => {
                    return (newitemarray)
                })
                setImagebase64code(null)
                setItemdescription(newitemarray[0].description)
                setLinktext(newitemarray[0].link)
                console.log(itemidcheck)
            }
        }
            
        else if (itemdescription || linktext || imagebase64code) {
                    const iscomfirmed = window.confirm("The data written will be deleted")
                    
                    if (iscomfirmed) {                       
                        let newitemarray = items.filter(item => item._id == id)
                        setItemidcheck(() => {
                            return (newitemarray)
                        })                       
                        console.log(newitemarray[0].description)
                        setItemdescription(newitemarray[0].description)
                        setImagebase64code(null)
                        setLinktext(newitemarray[0].link)
                    }

                }
        else {
                    // this will make and save only the unique id into itemidcheck thus access all its components using itemidcheck[0]._id or other 
                    
                    let newitemarray = items.filter(item => item._id == id)
                    console.log(newitemarray)
                    setItemidcheck(() => {
                        return (newitemarray)
                    })
                    setImagebase64code(null)
                    setItemdescription(newitemarray[0].description)
                    setLinktext(newitemarray[0].link)
                    console.log(itemidcheck)
                }

            

    }


    const deletetheitems=(id)=>{
        const res=confirmcheck("Do you still want to delete this")
        if(res){
            //delete the code and run the window
            axios.put(`https://brojectbackend.onrender.com/biography/delete/${id}`).then(res=>{console.log(res)})
            console.log(id)
            reloadAllDataUsingUsEffect()
        }
    }

  //where send to addnewdata.jsx and retrieved
    const addNewdatacheck = (data) => {
        setNewdatacheck(data)
        
    }

    const loadingcheck = (data) => {
        if(data){  //we send true or false from there addnewdata.jsx
            setLoading(true)
        }
        else
        {
            setLoading(false)
        }
    }

    //for clash removal when edit pressed and withiout cancelling addnewdata pressed
    function PressingAddData() {
        console.log("length is ", itemidcheck[0]._id)
        if (itemidcheck[0]._id) {
            const res = confirmcheck("The data will be override(Edit data)")
            if (res) {
                setNewdatacheck(true)
                setItemidcheck("ayyoopoyallo")
                setItemdescription(null)
                setImagebase64code(null)
                setLinktext(null)
            }
        }
        else {
            setNewdatacheck(true)

        }
    }


    return (
        <div className=' overflow-hidden'>
            <Logoutbutton />



            <div className="activity-section-header flex items-center justify-center h-20 bg-green-900 mb-24">
                <h1 className="text-4xl font-sans text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    Biography
                </h1>
            </div>

            {dataloading?
            <div className=' flex w-full justify-center items-center overflow-hidden absolute top-20'>

                <img  className='h-28' src={loadingimg}></img>
            </div>
            :<></>}


            <h1 className='text-[2em] text-blue-950 font-bold'>Description</h1>



            {/* first part biography edit and save */}
            <div>
                {!bioedit ?
                    <>
                        <div className='  w-lvw flex flex-col justify-center items-center'>

                            <div className='p-7'>
                                <textarea 
                                value={biodata} onChange={(e) => { setBiodata(e.target.value) }} className=' w-[70vw] min-h-44 border-[2px] border-red-700 rounded-[.5em]'></textarea>
                            </div>
                            <div>
                                <button className='
                flex-none  px-[1.2rem] py-[.4rem] mx-8 rounded-[8px] bg-blue-950 text-white text-1xl font-bold '
                                    onClick={savebiography} >Save</button>

                                <button className='
                flex-none  px-[1.1rem] py-[.3rem] mx-8 border-[2px] rounded-[8px] border-blue-950 text-blue-950 text-1xl font-bold hover:bg-red-950 hover:text-white'
                                    onClick={cancelbiography} >Cancel</button>
                            </div>

                        </div>
                    </>
                    :
                    <div>

                        <div className='  flex flex-col items-center justify-evenly p-[20px] bg-green-100  h-auto lg:overflow-visible overflow-y-scroll'>
                            <p className='mx-[7vw] bg-slate-00'>{biodata}</p>
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={() => { setBioedit(false) }} className='m-4 px-[1.4rem] py-[.5rem] rounded-[8px] bg-black text-white flex-none text=2xl'>Edit</button>
                        </div>
                    </div>
                }
            </div>




            <div className='h-28 text-white flex items-center justify-between '>

                <h1 className='text-[2em] text-blue-950 font-bold'>Items</h1>
                <button className='mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-green-800 text-white flex-none text=2xl'
                    onClick={PressingAddData}>Add Data</button>
            </div>

            {newdatacheck ?
                <Addnewdata 
                newdatasendbackcheck={addNewdatacheck} 
                getalldata={reloadAllDataUsingUsEffect} 
                loadingcheck={loadingcheck}/> //will loads and a callback funtion from addnewdata.jsx which says when to loading be true or false
                : <></>
            }




            {/* second part --items-- edit and upload */}
            <div>
                <div className=' grid grid-cols-2 mx-12 my-8'>

                    {items ? <h1 className='font-bold'>Image</h1> : <></>}
                    {items ? <h1 className='font-bold'>Description</h1> : <></>}

                </div>



                {/* shows all items through map function as well as the one which was pressed edit*/}
                {items.length!==0 ? items.map(item => {
                    return (

                        <div key={item._id}>
                            {/* if the itemidcheck gives id as same coz we pressed edit it contain id of that particular item */}
                            {itemidcheck[0]._id == item._id ?
                                <>
                                    {loading ? <div className='flex w-full items-center justify-center'><img src={loadingsvg} className='size-20'></img></div> : null}


                                    <div className=' h-[24vw] border-2 border-red-00 mt-[3vw] mb-[.8vw] mx-5 overflow-hidden '>
                                        <div className='grid grid-cols-2 m-[1.5vw] mb-0 bg-orange-00'>

                                            <div className='flex flex-col'>

                                                <div className=' w-[28vw] h-[15vw] object-contain rounded-[8px] border-blue-100 border-2 overflow-hidden'>
                                                    <img src={imagebase64code ? imagebase64code : itemidcheck[0].image} className=' w-[28vw] h-[15vw] object-contain'></img>
                                                </div>
                                                <input ref={uploadimageref} type='file' className='hidden' onChange={(e) => { imagetobase64andupload(e) }} src={item.image}></input>
                                                <div className='flex justify-center w-[28vw]'>
                                                    <button onClick={handleuploadclick} className='border-2 border-rose-950 bg-green-200 my-[.6vw] px-[1vw] py-[.3vw] rounded-3xl text-[.9vw]' >Upload the Image</button>

                                                </div>


                                            </div>


                                            <div className=' m-0 flex items-start p-0'>
                                                <textarea className=' w-[44vw] min-h-[15vw]  max-h-[17vw] overflow-y-scroll rounded-[8px] p-1 border-blue-300 border-2' 
                                                value={itemdescription?itemdescription:"uu"} onChange={setthedesciptionvalue}></textarea>
                                            </div>

                                        </div>

                                        <div className=' mx-[1vw] h-[4vw] flex items-center' >
                                            <input type='text' onChange={(e) => setLinktext(e.target.value)} className='mx-[1vw] h-[1.5vw] border-2 border-slate-400 rounded-md w-[28vw]'
                                            value={linktext}></input>
                                            {/* <a href={item.links} target="blank" className=' text-blue-400  italic' >{item.links}</a> */}
                                        </div>
                                    </div>
                                    <div className=' flex justify-center '>
                                        <button
                                            className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[8px] bg-black text-white flex-none text-1xl'
                                            onClick={saveoneitem}>Save</button>
                                        <button
                                            className=' mx-8 px-[1.4rem] py-[.5rem] rounded-[10px] border-2 border-blue-950 bg-white text-black flex-none text-1xl hover:bg-red-900 hover:text-white'
                                            onClick={cancellall} >cancel</button>
                                    </div>
                                </>
                                //----------------------------------------------------------------------------------------------------------------------------------------- 

                                // the other all item in the items maps thorugh all items
                                :
                                <div>

                                    <div className=' h-[25vw] border-2 border-red-00 mt-[3vw] mb-[.8vw] mx-5  '>

                                        <div className='grid grid-cols-2 m-[1.5vw]'>
                                            <img className=' w-[28vw] h-[15vw]   object-contain rounded-[8px] border-blue-100 border-2'
                                                src={item.image}></img>
                                            <p className='w-[44vw] h-[15vw] overflow-y-scroll rounded-[8px] p-1 border-blue-100 border-2
                                            '>{item.description}</p>
                                        </div>



                                        <div className='flex items-center justify-between'>
                                            <div className=' m-[1vw] h-[4vw] flex items-center ' >
                                                <h1 className='mx-[1vw] font-bold'>Link</h1>
                                                <a href={item.link} target="blank" className=' text-blue-900 italic'
                                                >{item.link}</a>
                                            </div>

                                            <div className='mr-[4vw]'>
                                                <button onClick={() => { edittheitems(item._id) }} className=' mx-[1vw] px-[1.4rem] py-[.5rem] rounded-[8px] bg-slate-800 text-white flex-none '
                                                >Edit</button>
                                                <button onClick={() => { deletetheitems(item._id) }} className=' mx-[1vw] justify-self-end  px-[1.4rem] py-[.5rem] rounded-[8px] bg-red-900 text-white flex-none hover:bg-red-700'
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



        </div >
    )

    // return (
    //     <div className='overflow-hidden'>

    //         <div className='flex items-center justify-center h-20 bg-blue-950'>
    //             <h1 className='text-4xl font-sans text-red-100'>Biography</h1>
    //         </div>

    //         <h1 className='text-3xl text-blue-950 font-bold mt-6 mx-4'>Description</h1>

    //         {/* Biography Section */}
    //         <div className='mb-8'>
    //             {!bioedit ?
    //                 <div className='w-full max-w-4xl mx-auto flex flex-col items-center'>
    //                     <div className='p-4'>
    //                         <textarea
    //                             value={biodata}
    //                             onChange={(e) => { setBiodata(e.target.value) }}
    //                             className='w-full min-h-44 border-2 border-red-700 rounded-lg'></textarea>
    //                     </div>
    //                     <div className='flex justify-center space-x-4'>
    //                         <button
    //                             className='px-6 py-2 rounded-lg bg-blue-950 text-white font-bold'
    //                             onClick={savebiography}>
    //                             Save
    //                         </button>
    //                         <button
    //                             className='px-6 py-2 rounded-lg border-2 border-blue-950 text-blue-950 font-bold hover:bg-red-950 hover:text-white'
    //                             onClick={cancelbiography}>
    //                             Cancel
    //                         </button>
    //                     </div>
    //                 </div>
    //                 :
    //                 <div className='flex flex-col items-center p-8 bg-green-100'>
    //                     <p className='w-full max-w-4xl bg-slate-00 text-center p-4'>{biodata}</p>
    //                     <button
    //                         onClick={() => { setBioedit(false) }}
    //                         className='my-4 px-6 py-2 rounded-lg bg-black text-white text-2xl'>
    //                         Edit
    //                     </button>
    //                 </div>
    //             }
    //         </div>

    //         {/* Items Section */}
    //         <div className='flex items-center justify-between mb-8'>
    //             <h1 className='text-3xl text-blue-950 font-bold mx-4'>Items</h1>
    //             <button
    //                 className='px-6 py-2 rounded-lg bg-green-800 text-white text-2xl mr-4'
    //                 onClick={() => { setNewdatacheck(true) }}>
    //                 Add Data
    //             </button>
    //         </div>

    //         {loading && <div className='w-full text-center text-red-950 text-2xl font-bold'>Loading...</div>}

    //         {newdatacheck ?
    //             <Addnewdata
    //                 newdatasendbackcheck={addNewdatacheck}
    //                 getalldata={reloadAllDataUsingUsEffect}
    //                 loadingcheck={loadingcheck} />
    //             :
    //             null
    //         }

    //         <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mx-4'>

    //             {items.length !== 0 ? items.map(item => (
    //                 <div key={item._id} className='border-2 border-red-00 mb-8'>
    //                     {itemidcheck[0]._id === item._id ? (
    //                         <>
    //                             <div className='grid grid-cols-1'>
    //                                 <div className='flex flex-col items-center p-4'>
    //                                     <div className='w-full h-60 bg-gray-200 rounded-lg overflow-hidden'>
    //                                         <img
    //                                             src={imagebase64code ? imagebase64code : itemidcheck[0].image}
    //                                             className='w-full h-full object-contain'
    //                                             alt='Item Image' />
    //                                     </div>
    //                                     <input
    //                                         ref={uploadimageref}
    //                                         type='file'
    //                                         className='hidden'
    //                                         onChange={(e) => { imagetobase64andupload(e) }}
    //                                         src={item.image} />
    //                                     <button
    //                                         onClick={handleuploadclick}
    //                                         className='border-2 border-rose-950 bg-green-200 my-2 px-4 py-1 rounded-lg text-sm'>Upload Image</button>
    //                                 </div>
    //                                 <div className='p-4'>
    //                                     <textarea
    //                                         className='w-full min-h-40 border-2 border-blue-300 rounded-lg p-2'
    //                                         value={itemdescription ? itemdescription : "uu"}
    //                                         onChange={setthedesciptionvalue} />
    //                                 </div>
    //                             </div>
    //                             <div className='flex justify-center'>
    //                                 <button
    //                                     className='mx-4 px-6 py-2 rounded-lg bg-black text-white text-2xl'
    //                                     onClick={saveoneitem}>Save</button>
    //                                 <button
    //                                     className='mx-4 px-6 py-2 rounded-lg border-2 border-blue-950 bg-white text-black text-2xl hover:bg-red-900 hover:text-white'
    //                                     onClick={cancellall}>Cancel</button>
    //                             </div>
    //                         </>
    //                     ) : (
    //                         <div className='p-4'>
    //                             <div className='w-full h-60 bg-gray-200 rounded-lg overflow-hidden'>
    //                                 <img
    //                                     src={item.image}
    //                                     className='w-full h-full object-c'
    //                                     alt='Item Image' />
    //                             </div>
    //                             <p className='w-full min-h-40 border-2 border-blue-300 rounded-lg p-2 mt-2 overflow-auto'>{item.description}</p>
    //                             <div className='flex justify-between items-center mt-2'>
    //                                 <div className='flex items-center'>
    //                                     <h1 className='font-bold mr-2'>Link:</h1>
    //                                     <a
    //                                         href={item.link}
    //                                         target="_blank"
    //                                         rel="noopener noreferrer"
    //                                         className='text-blue-900 italic'>{item.link}</a>
    //                                 </div>
    //                                 <div>
    //                                     <button
    //                                         onClick={() => { edittheitems(item._id) }}
    //                                         className='px-4 py-1 rounded-lg bg-slate-800 text-white mx-4'>
    //                                         Edit
    //                                     </button>
    //                                     <button
    //                                         onClick={() => { deletetheitems(item._id) }}
    //                                         className='px-4 py-1 rounded-lg bg-red-900 text-white hover:bg-red-700'>
    //                                         Delete
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )}
    //                 </div>
    //             )) : (
    //                 <div className='flex justify-center items-center w-full'>
    //                     <h1 className='text-red-950 text-2xl'>No Data To Show</h1>
    //                 </div>
    //             )}

    //         </div>

    //     </div>
    // );

    

    






}

export default Biography