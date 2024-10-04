import React, { useState, useEffect } from 'react';
import SidePanel from '../components/sidePanel';
import TableContent from '../components/tableContent';
import SearchBar from '../components/searchBar';
import PageTopic from '../components/pageTopic';
import './styles/layout.css';
// import './styles/dashboard.css';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const userActs = ['loyalty', 'view', 'edit', 'delete'];

  useEffect(() => {
    fetch('http://localhost:8070/api/clients')
      .then(response => response.json())
      .then(data => {
        const formattedCustomers = data.response.map(customer => ({
          id: customer.cid ? customer.cid.toString() : 'N/A',
          firstName: customer.firstName || 'N/A',
          lastName: customer.lastName || 'N/A',
          username: customer.userName || 'N/A',
          country: customer.country || 'N/A',
          nic: customer.nic ? customer.nic.toString() : 'N/A',
          mobile: customer.phone ? `+94${customer.phone}` : 'N/A',
          email: customer.email || 'N/A',
          address: customer.address || 'N/A',
          city: customer.city || 'N/A',
          postalCode: customer.zipCode ? customer.zipCode.toString() : 'N/A',
          imgPath: 'https://images.unsplash.com/photo-1502767089025-6572583495b0',
          isActive: true,
          isLoyalMember: false,
          regDate: customer.regDate || new Date().toISOString().split('T')[0],
          payMethod: customer.paymentMethods || 'N/A',
        }));
        setCustomers(formattedCustomers);
        setFilteredCustomers(formattedCustomers); // Set initial filtered customers
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const filterSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = customers.filter(customer =>
      customer.id.toLowerCase().includes(searchTerm) ||
      customer.username.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const dataForList = filteredCustomers.map(customer => [
    customer.id,
    customer.firstName + ' ' + customer.lastName,
    customer.country,
    customer.isActive,
    customer.isLoyalMember
  ]);

  return (
    <div className="layoutFrame">
      <div className="innerFrame">
        <SidePanel current={'dashboard'} />
      </div>
      <div className="innerFrame">
        <div className='mainBlock'>
          <PageTopic title={'dashboard'} />
          {/* <SearchBar filterSearch={filterSearch} /> */}
        </div>
        <div className='mainBlock'>
          <TableContent customerDataList={dataForList} userActs={userActs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
