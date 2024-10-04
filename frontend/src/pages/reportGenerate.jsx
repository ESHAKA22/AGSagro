import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import SidePanel from '../components/sidePanel';
import TableContent from '../components/tableContent';
import PageTopic from '../components/pageTopic';
import './styles/layout.css';

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    borderBottom: '2pt solid #4CAF50',
    paddingBottom: 5,
  },
  totalBox: {
    border: '1pt solid #4CAF50',
    padding: 6,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    border: '1pt solid #ddd',
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: 10,
    color: '#555',
  },
  gridItemTitle: {
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 10,
  },
  gridItemContent: {
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    margin: 5,
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#555',
  },
});

// Define the PDF Document component
const CustomerPDFDocument = ({ customers }) => {
  const totalCustomers = customers.length;
  const pages = [];

  for (let i = 0; i < customers.length; i += 4) {
    const pageCustomers = customers.slice(i, i + 4);
    pages.push(
      <Page key={i} style={styles.page}>
        <Text style={styles.header}>Customer Details</Text>
        <View style={styles.totalBox}>
          <Text>Total Registered Customers: {totalCustomers}</Text>
        </View>
        <View style={styles.gridContainer}>
          {pageCustomers.map(customer => (
            <View key={customer.id} style={styles.gridItem}>
              <Text style={styles.gridItemTitle}>ID:</Text>
              <Text style={styles.gridItemContent}>{customer.id}</Text>
              
              <Text style={styles.gridItemTitle}>Name:</Text>
              <Text style={styles.gridItemContent}>{`${customer.firstName} ${customer.lastName}`}</Text>
              
              <Text style={styles.gridItemTitle}>Country:</Text>
              <Text style={styles.gridItemContent}>{customer.country}</Text>
              
              <Text style={styles.gridItemTitle}>Address:</Text>
              <Text style={styles.gridItemContent}>{customer.address}</Text>
              
              <Text style={styles.gridItemTitle}>City:</Text>
              <Text style={styles.gridItemContent}>{customer.city}</Text>
              
              <Text style={styles.gridItemTitle}>Email:</Text>
              <Text style={styles.gridItemContent}>{customer.email}</Text>
              
              <Text style={styles.gridItemTitle}>Payment Methods:</Text>
              <Text style={styles.gridItemContent}>{customer.paymentMethods}</Text>
              
              <Text style={styles.gridItemTitle}>Phone:</Text>
              <Text style={styles.gridItemContent}>{customer.phone}</Text>
              
              <Text style={styles.gridItemTitle}>NIC:</Text>
              <Text style={styles.gridItemContent}>{customer.nic}</Text>
              
              <Text style={styles.gridItemTitle}>Zip Code:</Text>
              <Text style={styles.gridItemContent}>{customer.zipCode}</Text>
              
              <Text style={styles.gridItemTitle}>Username:</Text>
              <Text style={styles.gridItemContent}>{customer.userName}</Text>
              
              <Text style={styles.gridItemTitle}>Registration Date:</Text>
              <Text style={styles.gridItemContent}>{new Date(customer.regDate).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text>Generated Date: {new Date().toLocaleDateString()}</Text>
          <Text>Prepared by Customer Account Manager</Text>
        </View>
      </Page>
    );
  }

  return (
    <Document>
      {pages}
    </Document>
  );
};

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8070/api/clients')
      .then(response => response.json())
      .then(data => {
        const transformedData = data.response.map(customer => ({
          id: customer.cid,
          firstName: customer.firstName,
          lastName: customer.lastName,
          country: customer.country,
          address: customer.address,
          city: customer.city,
          email: customer.email,
          paymentMethods: customer.paymentMethods,
          phone: customer.phone,
          nic: customer.nic,
          zipCode: customer.zipCode,
          userName: customer.userName,
          regDate: customer.regDate,
        }));
        setCustomers(transformedData);
        setFilteredCustomers(transformedData);
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
      customer.id.toString().toLowerCase().includes(searchTerm) ||
      customer.userName.toLowerCase().includes(searchTerm)
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
        <SidePanel current={'Report'} />
      </div>
      <div className="innerFrame">
        <div className='mainBlock'>
          <div className='topicField'>
            <PageTopic title={'Report'} />
            <div className="downloadSection">
              <PDFDownloadLink
                document={<CustomerPDFDocument customers={filteredCustomers} />}
                fileName="Customer_Details.pdf"
              >
                {({ loading }) => (
                  <button className="downloadButton">
                    {loading ? 'Loading document...' : 'Download PDF Document'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
        <div className='mainBlock'>
          <TableContent customerDataList={dataForList} userActs={['view']} />
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
