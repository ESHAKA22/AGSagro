import React from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom for internal navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome icons
import { faTachometerAlt, faUser, faUsers, faClipboardList, faTable, faShoppingCart, faFileAlt, faSignOutAlt, faBoxes } from '@fortawesome/free-solid-svg-icons'; // Import the inventory icon (faBoxes)
import './styles/sidePanel.css';

const SidePanel = ({ current }) => {
  const topics = [
    { name: 'dashboard', value: '/dashboard', icon: faTachometerAlt },
    { name: 'view accounts', value: '/customers', icon: faUser },
    { name: 'update accounts', value: '/update', icon: faUsers },
    { name: 'customer account list', value: '/customers', icon: faClipboardList },
    { name: 'loyalty table', value: '/loyaltyTable', icon: faTable },
    { name: 'orders', value: '/orders', icon: faShoppingCart }, // Added Orders button
    { name: 'inventory', value: '/inventory', icon: faBoxes }, // Added Inventory button
    { name: 'Report', value: '/ReportGenerate', icon: faFileAlt },
    { name: 'log out', value: '/login', icon: faSignOutAlt }
  ];

  return (
    <div className='sidePanel'>
      {topics.map((content, index) => (
        <Link 
          key={index}
          to={content.value} 
          className={`${current === content.name ? 'current' : ''} sideBlock`}
        >
          <FontAwesomeIcon icon={content.icon} className="icon" /> {/* Icon display */}
          <p>{content.name}</p>
        </Link>
      ))}
    </div>
  );
}

export default SidePanel;
