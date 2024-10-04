import React, { useState, useEffect } from 'react';
import SidePanel from '../components/sidePanel';
import PageTopic from '../components/pageTopic';
import Axios from 'axios';
import './styles/layout.css';
import './styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Fetch loyalty data
        const loyaltiesResponse = await Axios.get('http://localhost:8070/api/loyalties');
        // Fetch client data
        const clientsResponse = await Axios.get('http://localhost:8070/api/clients');
        
        // Log data to debug
        console.log('Loyalties Response:', loyaltiesResponse.data.response);
        console.log('Clients Response:', clientsResponse.data.response);

        // Process the data
        const dataWithRegDate = loyaltiesResponse.data.response.map(loyalty => {
          const client = clientsResponse.data.response.find(client => client.cid === loyalty.cid);
          return {
            ...loyalty,
            regDate: client?.regDate ? new Date(client.regDate).toLocaleDateString() : 'N/A'
          };
        });

        setCustomers(dataWithRegDate);
        setFilteredCustomers(dataWithRegDate);
        setLoading(false);
      } catch (error) {
        console.error('Axios Error: ', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filterSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = customers.filter(customer =>
      customer.loyaltyId.toString().toLowerCase().includes(searchTerm) ||
      customer.cusName.toLowerCase().includes(searchTerm) ||
      customer.cid.toString().toLowerCase().includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  };

  const handleStatusChange = async (loyaltyId, newStatus) => {
    try {
      await Axios.post('http://localhost:8070/api/updateloyalty', {
        loyaltyId: loyaltyId,
        status: newStatus,
      });

      const updatedCustomers = customers.map(customer =>
        customer.loyaltyId === loyaltyId ? { ...customer, status: newStatus } : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
    } catch (error) {
      console.error('Failed to update status: ', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogoutButtonClick = () =>{
    navigate('/login')
  }

  return (
    <div className="layoutFrame">
      <div className="innerFrame">
        <SidePanel current={'loyaltyTable'} />
      </div>
      
      <div className="innerFrame">
        <div className="loyalBox">
          <PageTopic title={'Loyalty Table'} />

          {/* <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={filterSearch}
            className="searchBar"
          /> */}

<div className='userOpt'>
            <div className="searchBox">
            <input
                type="text"
                value={searchTerm}
                onChange={filterSearch}
                placeholder="Search..."
                className="searchInput"
            />
            </div>
        
          {/* <button className="logoutBtn" onClick={handleLogoutButtonClick}>Log Out</button> */}
        
        </div>

        </div>
        
        <div className="loyalBox">
          
          {filteredCustomers.length === 0 ? (
            <div>No customers found</div>
          ) : (
            <table className="loyaltyTable">
              <thead>
                <tr>
                  <th>Loyalty ID</th>
                  <th>Name</th>
                  <th>CID</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.loyaltyId}>
                    <td>{customer.loyaltyId}</td>
                    <td>{customer.cusName}</td>
                    <td>{customer.cid}</td>
                    <td>{customer.regDate}</td>
                    <td>{customer.status}</td>
                    <td>
                      <button className='allow btnAct' onClick={() => handleStatusChange(customer.loyaltyId, 'approved')} disabled={customer.status === 'approved'} >
                        <FontAwesomeIcon icon={faThumbsUp}/>
                      </button>
                      <button className='deny btnAct' onClick={() => handleStatusChange(customer.loyaltyId, 'rejected')} disabled={customer.status === 'rejected'} >
                        <FontAwesomeIcon icon={faThumbsDown} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
