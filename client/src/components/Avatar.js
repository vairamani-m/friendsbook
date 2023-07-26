import React from 'react'
import { useSelector } from 'react-redux'

const Avatar = ({ srcImg, size }) => {
    const { theme } = useSelector(state => state)
  return (
      <img src={srcImg} alt="avatar" className={size} style={{ filter: `${theme ? 'invert(1)' : 'invert(0)'}`}} />
  )
}

export default Avatar
