import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const tokencontext = createContext()
const useToken = () => {
  return useContext(tokencontext)
}



function Tokencontext({children}) {
  
  const nav = useNavigate()
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState(null)


  const getalldata=(token)=>{
    console.log("hiii")
  }
//-------------------------------------------imp security part---------------------------------------

  const getverified= async ()=>{
    await axios.get('https://brojectbackend.onrender.com/verifytoken',{withCredentials:true}).then(res=>{
      // console.log("--------------------",res.data)

      if(res.data.message==="success"){
        setDecoded(res.data.message)
        // console.log(res.data.message)
        setError(null)
      }

      else if (res.data==='error'){
        setError('error')
        // console.log(res.data)
        setDecoded(null)
        nav('/login')
      }

    })

  }

  const logoutsection=async ()=>{
    await axios.get('https://brojectbackend.onrender.com/logout', { withCredentials: true }).then(res => {
      console.log(res.data)
      nav('/login')
    }
    )
  }

  return (
    <tokencontext.Provider value={{
      decoded, setDecoded, getalldata, getverified, error, setError, logoutsection
    }}>
      {children}
    </tokencontext.Provider>

  )
}

export {Tokencontext,useToken}