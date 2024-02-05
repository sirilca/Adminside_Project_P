import React from 'react'
import { useToken } from '../Context/Tokencontext'
import { useNavigate } from 'react-router-dom'

function Logoutbutton() {

    const {  logoutsection } = useToken()
    const nav=useNavigate()
    const goback=()=>{
      nav(-1)
    }
  return (
    <div>
          <div className='absolute right-4 top-2'>
        <button className='bg-gradient-to-r from-zinc-500 via-zinc-900 to-zinc-500 text-white font-semibold px-4 m-4 py-2 rounded-md shadow-md hover:shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'
          onClick={goback}
        >Go Back</button>
              <button className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  onClick={logoutsection}>          logout
              </button>
          </div>
    </div>
  )
}

export default Logoutbutton