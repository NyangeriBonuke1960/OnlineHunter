import React, { useState } from 'react'
import './navbar.css'
import { CiSearch } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
import { VscGitCompare } from "react-icons/vsc";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState('false')

  return (
    <div className='navbar'>
      <div className='search-div'>
        <input type='text' placeholder='Search' />
        <CiSearch className='search' />
      </div>
      
      <div className='account-compare-div'>
        <div className='account-div'>
          <VscAccount className='account-icon' onClick={() => setIsOpen(!isOpen)} />
          <div className={`pop-hide ${isOpen ? 'show' : ''}`}>
            <p>My Account</p>
            <p>My Account</p>
            <p>My Account</p>
            <p>My Account</p>
            <p>My Account</p>
          </div>
        </div>

        <div className='compare-div'>
          <VscGitCompare />
        </div>
      </div>
    </div>
  )
}

export default Navbar