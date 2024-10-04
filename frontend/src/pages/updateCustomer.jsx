import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/layout.css';
import SidePanel from '../components/sidePanel';
import TableContent from '../components/tableContent';
import SearchBar from '../components/searchBar';
import PageTopic from '../components/pageTopic';

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        }));
        setCustomers(transformedData);
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

  const handleEditCustomer = (customerId) => {
    navigate(`/customer/edit/${customerId}`);
  };

  const dataForList = customers.map(customer => [
    customer.id,
    customer.firstName + ' ' + customer.lastName,
    customer.country,
    customer.isActive,
    customer.isLoyalMember,
    <button onClick={() => handleEditCustomer(customer.id)}>Edit</button>
  ]);

  return (
    <div className="layoutFrame">
      <div className="innerFrame">
        <SidePanel current={'update accounts'} />
      </div>
      <div className="innerFrame">
        <div className='mainBlock'>
          <PageTopic title={'update accounts'} />
          {/* <SearchBar filterSearch={() => {}} /> */}
        </div>
        <div className='mainBlock'>
          <TableContent customerDataList={dataForList} userActs={['edit']} />
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomer;
