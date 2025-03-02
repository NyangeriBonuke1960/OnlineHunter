import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div>
        <p>**************************************************</p>
        <h2>This page is unauthorized</h2>
        <h4>Return to <Link to='/'>homepage</Link></h4>
    </div>
  )
}

export default Unauthorized