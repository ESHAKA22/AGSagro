import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from '../components/sidePanel';
import TableContent from '../components/tableContent';
import SearchBar from '../components/searchBar';
import PageTopic from '../components/pageTopic';
import './styles/layout.css';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    // Fetch customer data from the backend
    fetch('http://localhost:8070/api/clients')
      .then(response => response.json())
      .then(data => {
        // Transform the data as needed
        const transformedData = data.response.map(customer => ({
          id: customer.cid,
          firstName: customer.firstName,
          lastName: customer.lastName,
          country: customer.country,
          isActive: customer.isActive,
          isLoyalMember: customer.isLoyalMember,
          // Add username if it exists in the data
          username: customer.username || '', 
        }));
        setCustomers(transformedData);
        setFilteredCustomers(transformedData); // Initialize filteredCustomers with all data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleViewCustomer = (customerId) => {
    navigate(`/customer/view/${customerId}`);
  };

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
    `${customer.firstName} ${customer.lastName}`,
    customer.country,
    customer.isActive ? 'Active' : 'Inactive',
    customer.isLoyalMember ? 'Yes' : 'No',
    <button key={customer.id} onClick={() => handleViewCustomer(customer.id)}>View</button>
  ]);

  return (
    <div className="layoutFrame">
      <div className="innerFrame">
        <SidePanel current={'view accounts'} />
      </div>
      <div className="innerFrame">
        <div className='mainBlock'>
          <PageTopic title={'view accounts'} />
          {/* <SearchBar filterSearch={filterSearch} /> */}
        </div>
        <div className='mainBlock'>
          <TableContent customerDataList={dataForList} userActs={['view']} />
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
