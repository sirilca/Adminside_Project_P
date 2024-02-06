import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';


const tokencontext = createContext()
const useToken = () => {
  return useContext(tokencontext)
}



function Tokencontext({children}) {
  
  const nav = useNavigate()
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState(null)
  const cookies = new Cookies()

  const getalldata=(token)=>{
    console.log("Hii admin")
  }
//-------------------------------------------imp security part---------------------------------------

  const getverified= async ()=>{
    // await axios.get('https://brojectbackend.onrender.com/verifytoken',{withCredentials:true}).then(res=>{ //old change
      // console.log("--------------------",res.data)
    // const jwttoken = cookies.get('jwt')
    let jwttoken = localStorage.getItem('jwt');
    // console.log("token cookie area \n"+jwttoken)
    if(!jwttoken){
      nav('/')
    }
    else{
      await axios.post('https://brojectbackend.onrender.com/verifytoken',null, {
        headers: {
          Authorization: jwttoken
        }} ).then(res => {
        
        if(res.data.message==="success"){
          setDecoded(res.data.message)
          // console.log(res.data.message)
          setError(null)
        }
        
        else if (res.data==='error'){
          setError('error')
          cookies.remove('jwt')
          // console.log("error  ion verification ")
          setDecoded(null)
          nav('/login')
        }
        
      })

      
    }
  }


  return (
    <tokencontext.Provider value={{
      decoded, setDecoded, getalldata, getverified, error, setError,
    }}>
      {children}
    </tokencontext.Provider>

  )
}

export {Tokencontext,useToken}