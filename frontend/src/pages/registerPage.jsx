import React from 'react'
import RegForm from '../components/regForm'
import LogoPng from '../components/logoPng'
import './styles/registerPage.css'

const RegisterPage = () => {
  return (
    <div className="outerFrame">
      {/* logo */}
      <div className='logoSignUp'>
        <LogoPng widthValue={'75px'}/>
      </div>

      {/* form */}
      <div className="regFrame">

        <h3>Welcome! Let's create your account to get started.</h3>
        
        <RegForm />
        
        <div className="readMore">
            <a href="">See More</a>
        </div>
    </div>

      {/* footer */}
    </div>
  )
}

export default RegisterPage