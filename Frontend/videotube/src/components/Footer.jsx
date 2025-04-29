import React from 'react'
import { FaFacebookSquare, FaInstagram, FaTwitterSquare, FaLinkedin  } from "react-icons/fa";

function Footer() {
  return (
    <div>
      <div className='w-full h-[30vh] bg-gray-950'>
        <div className='flex items-center mx-20 justify-between h-full'>
          <div className='flex flex-col gap-4 w-1/3'>
            <h1 className='text-3xl text-yellow-500 font-bold'>Videotube</h1>
            <p className='text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit quidem harum accusamus voluptatibus.</p>
          </div>
          <div>
            <ul>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold'>About</li>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold'>Contact</li>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold'>Privacy Policy</li>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold'>Terms of Service</li>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold'>Help</li>
            </ul>
          </div>
          <div>
            <ul>
              <li className='text-gray-400 hover:text-yellow-500 cursor-pointer text-lg font-semibold flex items-center gap-2'>
              <FaFacebookSquare />
                Facebook</li>
              <li className='text-gray-400 hover:text-yellow-500 flex items-center gap-2 cursor-pointer text-lg font-semibold'><FaTwitterSquare /> Twitter</li>
              <li className='text-gray-400 hover:text-yellow-500 flex items-center gap-2 cursor-pointer text-lg font-semibold'><FaInstagram /> Instagram</li>
              <li className='text-gray-400 hover:text-yellow-500 flex items-center gap-2 cursor-pointer text-lg font-semibold'> <FaLinkedin /> LinkedIn</li>
            </ul>
          </div>
          
        </div>
        <p className='bg-gray-950 flex justify-center items-center pb-6 text-gray-500'>© {new Date().getFullYear()} Videotube. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer