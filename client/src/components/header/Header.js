import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'


const Header = () => {
  return (
    <div className='header bg-light'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
            <Link className="logo" to="/">
                <h1 className='navbar-brand text-uppercase p-0 m-0' onClick={()=>window.scrollTo({top:0,  behavior: 'smooth'})}><span className='text-dark display-4'>F</span>RIENDS<span className='text-dark display-4'>B</span>OOK</h1>
            </Link>
            <Search />
            <Menu />
        </nav>
    </div>
  )
}

export default Header
