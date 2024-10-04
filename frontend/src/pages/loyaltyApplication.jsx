import React from 'react'
import LogoPng from '../components/logoPng'
import LoyaltyForm from '../components/loyaltyForm'
import './styles/loyaltyApplication.css'
import { useNavigate, useParams } from 'react-router-dom';

const LoyaltyApplication = () => {

  const { customerId } = useParams();
  const navigate = useNavigate()

  return (
    <div className="outerFrame">
        {/* logo png */}
        <div className="logoInLoyalty">
            <LogoPng widthValue={'75px'}/>
        </div>
        
        {/* loyalty form */}
        <div className="loyaltyBlock">
          <h3>Become a <br/><span>loyalty member</span></h3>
          <LoyaltyForm customerId={customerId} />
          
        </div>

    </div>
  )
}

export default LoyaltyApplication