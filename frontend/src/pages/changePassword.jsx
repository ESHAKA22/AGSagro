import React from 'react'
import LogoPng from '../components/logoPng'
import ChangeForm from '../components/changeForm'
import './styles/changePassword.css'

const ChangePassword = () => {
  return (
    <div className='outerFrame'>
      {/* logo */}
      <div className='logoInChange'>
        <LogoPng widthValue={'75px'} />
      </div>

      {/* form */}
      <div className='changeFrame'>
        <h3>Change Your Password</h3>
        <ChangeForm />
        <a className="forgotLink" href="/login">Login</a>
      </div>
      
      {/* footer */}
    </div>
  )
}

export default ChangePassword