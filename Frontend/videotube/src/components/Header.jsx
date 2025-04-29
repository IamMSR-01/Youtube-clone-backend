import React from 'react'

function Header() {
  return (
    <div className='bg-gray-800 text-white p-4 flex justify-between items-center px-20'>
      <div className='flex items-center'>
        <h1 className="text-3xl font-bold justify-center text-center text-yellow-500"><a href="/">VideoTube</a></h1>
      </div>
      <div>
        <ul className='flex space-x-10 ml-4 font-medium text-lg'>
          <li className='cursor-pointer hover:text-yellow-500'>Home</li>
          <li className='cursor-pointer hover:text-yellow-500'>About</li>
          <li className='cursor-pointer hover:text-yellow-500'>Contact</li>
          <li className='cursor-pointer hover:text-yellow-500'>Profile</li>
          <li className='cursor-pointer hover:text-yellow-500'>Login</li>
        </ul>
      </div>
    </div>
  )
}

export default Header