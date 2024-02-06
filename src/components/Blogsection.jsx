import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../Context/Tokencontext';
import Logoutbutton from '../Login/Logoutbutton';
import loadingimg from '../images/lg.gif'
import loadingsvg from '../images/ll.gif'


const BlogSection = () => {

    const [dataloading, setDataloading] = useState(false) //set loading page which makes when time elapsed for cloudinary
    
    const nav = useNavigate();
    
    
    const { decoded, setDecoded, getalldata, getverified } = useToken()
    
    
    useEffect(() => {
        getverified()
        getalldata()
        getallblogdata()
    }, [])


    


    const [blogSections, setBlogSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [img, setImg] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [tag, setTag] = useState('');
    const imageref = useRef();
    
    const getallblogdata=async() => {
        setDataloading(true)
        await axios.get('https://brojectbackend.onrender.com/blog').then((res) => {
            setBlogSections(res.data);
        });
        setDataloading(false)
    }

    const reloadAllDataUsingUseEffect = async () => {
        await axios.get('https://brojectbackend.onrender.com/blog').then((res) => {
            setBlogSections(res.data);
        });
    };

    const confirmCheck = (query) => {
        return window.confirm(query);
    };

    const editBlogItem = (id) => {

        if (newdatacheck) {
            const res = confirmCheck("The data written will be deleted(Addnew Data)")
            if (res) {
                setNewdatacheck(false)
                setEditItemId(id);
                const selectedItem = blogSections.find(item => item._id === id);
                setTitle(selectedItem.title);
                setSubtitle(selectedItem.subtitle);
                setImg(null);
                setContent(selectedItem.content);
                setDate(selectedItem.date);
                setTag(selectedItem.tag)
            }
        }
        else if (editItemId) {
                    const res = confirmCheck("The data will be overridden. Do you want to continue?");
                    if (res) {
                        setEditItemId(id);
                        const selectedItem = blogSections.find(item => item._id === id);
                        setTitle(selectedItem.title);
                        setSubtitle(selectedItem.subtitle);
                        setImg(null);
                        setContent(selectedItem.content);
                        setDate(selectedItem.date);
                        setTag(selectedItem.tag)

                    }
                } 
        else {
                setEditItemId(id);
                const selectedItem = blogSections.find(item => item._id === id);
                setTitle(selectedItem.title);
                setSubtitle(selectedItem.subtitle);
                setImg(null);
                setContent(selectedItem.content);
                setDate(selectedItem.date);
                setTag(selectedItem.tag)

                }

    };

    const deleteBlogItem = async (id) => {
        const res = confirmCheck("Do you want to delete this item?");
        if (res) {
            await axios.put(`https://brojectbackend.onrender.com/blog/delete/${id}`).then(() => {
                reloadAllDataUsingUseEffect();
            });
        }
    };

    const saveBlogItem = async () => {
        const res = confirmCheck("Do you want to save this item?");
        if (res) {
            setLoading(true);
            await axios.patch(`https://brojectbackend.onrender.com/blog/edititem/${editItemId}`, { title, subtitle, img, content, date ,tag})
                .then(() => {
                    reloadAllDataUsingUseEffect();
                    setEditItemId(null);
                    setTitle('');
                    setSubtitle('');
                    setImg('');
                    setContent('');
                    setDate('');
                    setTag('');

                });
            setLoading(false);
        }
    };

    const cancelEditBlogItem = () => {
        const res = confirmCheck("Do you want to cancel editing?");
        if (res) {
            setEditItemId(null);
            setTitle('');
            setSubtitle('');
            setImg('');
            setContent('');
            setDate('');
            setTag('');

        }
    };

    const imagetobase64andupload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const getbase64code = (file) => {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    setImg(reader.result);
                };
                reader.onerror = (err) => {
                    console.log(err);
                };
            };

            if (file.type.startsWith('image/')) {
                const maxSizeInBytes = 1 * 1024 * 1024; // Example limit: 5MB
                if (file.size <= maxSizeInBytes) {
                    getbase64code(file);
                } else {
                    const res = confirmCheck("You're attempting to upload an image that exceeds 5 MB in size. Are you sure you want to continue with the upload?");
                    if (res) {
                        getbase64code(file);
                    }
                }
            } else {
                const res = confirmCheck("This is not an image. Please upload an image file. Press 'CANCEL' to cancel the upload or 'OK' to upload it anyway.");
                if (res) {
                    getbase64code(file);
                }
            }
        }
    };

    //------------------------------Activity Add new section-----------------------------------------------

    const [newdatacheck, setNewdatacheck] = useState(false)


    const saveAddNewactivity = async () => {
        const res = confirmCheck("Do you want to save this file?")
        setLoading(true)
        if (res) {

            await axios.put('https://brojectbackend.onrender.com/blog/additem', { title, subtitle, img, content, date,tag })
                .then(res => {
                    console.log("second magic down here", res)
                    reloadAllDataUsingUseEffect()
                })
            setNewdatacheck(false)
            setTitle('');
            setSubtitle('');
            setImg('');
            setContent('');
            setDate('');
            setTag('');

            
        }
        setLoading(false)

    }

    function PressingAddData() {
        if (editItemId) {
            const res = confirmCheck("The data will be override(Edit data)")
            if (res) {
                setNewdatacheck(true)
                setEditItemId(null)
                setTitle('');
                setSubtitle('');
                setImg('');
                setContent('');
                setDate('');
                setTag('');

            }
        }
        else {
            setNewdatacheck(true)

        }
    }

    const cancelAddNewactivity = () => {
            const res = confirmCheck("do you want to cancel..?")
            if (res) {
                setNewdatacheck(false)
                reloadAllDataUsingUseEffect();
                setTitle('');
                setSubtitle('');
                setImg('');
                setContent('');
                setDate('');
                setTag('');

            }
        }

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    };
    

    return (
        <div>

            {dataloading ?
                <div className=' flex w-full justify-center items-center overflow-hidden absolute top-20'>

                    <img className='h-28' src={loadingimg}></img>
                </div>
                : <></>}

            <Logoutbutton />
            <div className="activity-section-header flex items-center justify-center h-20 bg-purple-950 mb-24">
                <h1 className="text-4xl font-sans text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    Blog Section
                </h1>
            </div>

            <div className="blog-controls mb-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl text-blue-950 font-bold">Blog Posts</h1>
                    <button className="bg-green-800 text-white py-1 px-3 rounded-md text-base" onClick={PressingAddData}>
                        Add Blog Post
                    </button>
                </div>
            </div>

            
            {newdatacheck ?
                <div className='mx-[5%] text-md'>
                    <div className='mb-[5vw]'>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Title'></input>
                        <input value={tag} onChange={(e) => setTag(e.target.value)} type="text" className='border-2 border-zinc-400 rounded-[2px] 'placeholder=' Enter Tag' ></input>
                        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Subtitle'></input>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} className='h-[13vw] w-full overflow-auto border-2 border-zinc-400'></textarea>
                        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className='border-2 border-zinc-400 rounded-[2px]'></input>

                        {img && (
                            <div className="uploaded-image">
                                <img src={img} alt="Uploaded" className="w-[200px] h-[200px] object-contain" />
                            </div>
                        )}
                        
                        <input className='hidden' onChange={(e) => imagetobase64andupload(e)} ref={imageref} type='file' />
                        <button className='bg-blue-900 border-[1px] text-white rounded-[5px] p-2 py-1 text-sm' onClick={() => imageref.current.click()}>Upload Image</button>
                        <button className='bg-green-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-green-950' onClick={saveAddNewactivity}>Save</button>
                        <button className='bg-slate-100 text-slate-800 w-24 h-8 rounded-[6px] text-md border-2 border-slate-800 hover:bg-red-800 hover:text-white' onClick={cancelAddNewactivity}>Cancel</button>
                    </div>
                </div>
                :
                <></>
            }







            {blogSections.map((blog, index) => (
                <div key={index} className="mx-[5%] text-md mb-5">
                    {editItemId === blog._id ? (
                        // <div>
                        //     <input value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Title'></input>
                        //     <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Subtitle'></input>
                        //     <textarea value={content} onChange={(e) => setContent(e.target.value)} className='h-[13vw] w-full overflow-auto border-2 border-zinc-400'></textarea>
                        //     <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className='border-2 border-zinc-400 rounded-[2px]'></input>
                        //     <input className='hidden' onChange={(e) => imagetobase64andupload(e)} ref={imageref} type='file' />
                        //     <button className='bg-blue-900 border-[1px] text-white rounded-[5px] p-2 py-1 text-sm' onClick={() => imageref.current.click()}>Upload Image</button>
                        //     <button className='bg-green-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-green-950' onClick={saveBlogItem}>Save</button>
                        //     <button className='bg-slate-100 text-slate-800 w-24 h-8 rounded-[6px] text-md border-2 border-slate-800 hover:bg-red-800 hover:text-white' onClick={cancelEditBlogItem}>Cancel</button>
                        // </div>
                        <div>
                            {loading ? <div className='flex w-full items-center justify-center'><img src={loadingsvg} className='size-20'></img></div> : null}

                            <input value={title} onChange={(e) => setTitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Title'></input>
                            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className='border-2 border-zinc-400 rounded-[2px] w-[20vw]' placeholder='Enter Subtitle'></input>
                            <input value={tag} onChange={(e) => setTag(e.target.value)} type="text" className='border-2 border-zinc-400 rounded-[2px] ' placeholder=' Enter Tag' ></input>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} className='h-[13vw] w-full overflow-auto border-2 border-zinc-400'></textarea>
                            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className='border-2 border-zinc-400 rounded-[2px]'></input>

                            {/* Display uploaded image */}
                            {img && (
                                <div className="uploaded-image">
                                    <img src={img} alt="Uploaded" className="w-[200px] h-[200px] object-contain" />
                                </div>
                            )}

                            <input className='hidden' onChange={(e) => imagetobase64andupload(e)} ref={imageref} type='file' />
                            <button className='bg-blue-900 border-[1px] text-white rounded-[5px] p-2 py-1 text-sm' onClick={() => imageref.current.click()}>Upload Image</button>
                            <button className='bg-green-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-green-950' onClick={saveBlogItem}>Save</button>
                            <button className='bg-slate-100 text-slate-800 w-24 h-8 rounded-[6px] text-md border-2 border-slate-800 hover:bg-red-800 hover:text-white' onClick={cancelEditBlogItem}>Cancel</button>
                        </div>

                    ) : (




                            // <div className="flex flex-col md:flex-row gap-4 h-[15vw] bg-zinc-100 ">
                            //     <div className="flex-none object-contain md:w-1/4 h-[15vw] w-[20vw] bg-green-100 flex justify-center items-center overflow-hidden">
                            //         <img className="w-auto h-auto" src={blog.img} alt="Blog Image" />
                            //     </div>
                            //     <div className="h-full md:w-3/4 overflow-auto">
                            //         <div className="flex flex-col md:flex-row justify-between gap-4 h-full">
                            //             <div>
                            //                 <h2 className="text-2xl font-semibold mb-1">{blog.title}</h2>
                            //                 <h3 className="text-xl font-medium mb-2">{blog.subtitle}</h3>
                            //                 <p className="text-gray-800">{blog.content}</p>
                            //             </div>
                            //             <div className="hidden md:block">
                            //                 <p className="text-gray-800 mb-1">{formatDate(blog.date)}</p>
                            //                 <a href={blog.link} className="text-red-950">{blog.link}</a>
                            //             </div>
                            //         </div>
                            //     </div>
                            //     <div className="flex justify-end gap-5">
                            //         <button className="bg-blue-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-blue-800">Edit</button>
                            //         <button className="bg-red-800 text-white w-24 h-8 rounded-[6px] text-md hover:bg-red-700">Delete</button>
                            //     </div>
                            // </div>

                            <div key={index}>
                                <div className='flex gap-20  bg-zinc-100'>
                                    <div className='flex-none object-contain  w-[20vw] bg-green-00 flex justify-center items-center overflow-hidden'>
                                        <img className='w-auto h-auto' src={blog.img} alt='Blog Image'></img>
                                    </div>
                                    <div className=' overflow-auto my-4'>
                                        <h2 className='font-bold text-orange-900 my-2'>{blog.tag}</h2>
                                        <h2 className='font-semibold my-2'>{blog.title}</h2>
                                        <h3 className='font-medium my-2'>{blog.subtitle}</h3>
                                        <p className='font-normal my-2'>{blog.content}</p>
                                    </div>
                                </div>
                                <div className='text-red-950'>
                                    <p>{formatDate(blog.date)}</p>
                                </div>
                                <div className='flex justify-end gap-5'>
                                    <button className='bg-blue-900 text-white w-24 h-8 rounded-[6px] text-md hover:bg-blue-800' onClick={() => editBlogItem(blog._id)}>Edit</button>
                                    <button className='bg-red-800 text-white w-24 h-8 rounded-[6px] text-md hover:bg-red-700' onClick={() => deleteBlogItem(blog._id)}>Delete</button>
                                </div>
                            </div>
                    
                    
                    
                    
                    )}
                </div>
            ))}
            



            {blogSections.length==0&&
            <div>
                    <div className='flex justify-center items-center w-lvw'>
                        <h1 className='m-0 p-0 text-red-950 text-[1.6vw]'>No Data To Show</h1>
                    </div>
            </div>}
        </div>
    );
};

export default BlogSection;
