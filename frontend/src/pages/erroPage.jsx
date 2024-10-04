import React from 'react'
import './styles/errorPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'
const ErrorPage = () => {
  return (
    <div className='errorFrame'>
        <div className='content'>
            <FontAwesomeIcon className='icon' icon={faFaceFrown} />
            <div className='textContent'>
                <h3>Oops :(</h3>
                <p>Something went wrong !</p>
            </div>
        </div>
        <a href="/">Home</a>
    </div>
  )
}

export default ErrorPage


{/* <FontAwesomeIcon icon={faFaceFrown} /> */}