import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
const Auth = () => {
  return (
    <div>
        <>
        <div className='flex px-[70px] py-[50px]'>
            <div className="w-[800px]">
                <ul className=''>
                    <li className='text-8xl'>We're here to <br/> increase your <br/> Productivity</li>
                    <li className='py-[50px]'>Let's Track you work more organise and easily using the<br/> Tasks Dashboard with many of the latest features in managing work every day.</li>
                    <li className='flex justify-center w-[500px]'>
                        <Link to='/Login'><button className='px-[10px] py-[8px] bg-blue-300 border-blue-300 rounded-md'>Login</button></Link>
                        <Link to='/Register'><button className='px-[10px] mx-[20px] py-[8px] bg-blue-300 border-blue-300 rounded-md'>Register</button></Link>
                    </li>
                </ul>
            </div>
            <div className='w-[600px]'>
                <img src="src\assets\login_photo.jpg" alt="" />
            </div>
        </div>
        </>
    </div>
  )
}

export default Auth