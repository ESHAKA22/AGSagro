import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenNib, faTrash, faCircleRight, faAngleLeft, faAngleRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './styles/tableContent.css';
import Axios from 'axios';
import './styles/searchBar.css';
import { useNavigate } from 'react-router-dom';

// Table Pagination component
const TablePagination = ({ currentIndex, totalIndex, paginationFunction }) => {
  const paginBtns = [];
  for (let i = 0; i < totalIndex; i++) {
    paginBtns.push(
      <div
        key={i}
        className={`${i === currentIndex ? 'activePagination' : ''} paginButton`}
        onClick={() => paginationFunction(i + 1)}
      >
        {i + 1}
      </div>
    );
  }
  return (
    <div className="pagination">
      <div>
        <FontAwesomeIcon
          className="paginationIcons"
          icon={faAngleLeft}
          onClick={() => paginationFunction('<')}
        />
      </div>
      {paginBtns}
      <div>
        <FontAwesomeIcon
          className="paginationIcons"
          icon={faAngleRight}
          onClick={() => paginationFunction('>')}
        />
      </div>
    </div>
  );
};

// Table Actions component
const TableActions = ({ withLoyalty, checkLoyalty, actions, customerID, handleDelete }) => {
  const actionContent = actions
    .map((action) => {
      if (withLoyalty && action === 'loyalty' && checkLoyalty) {
        return {
          text: 'Loyalty Customer',
          icon: faCircleRight,
          idValue: 'loyalty',
          urlPath: `/loyalty/customer/${customerID}`,
          isLink: true,
        };
      } else if (action === 'view') {
        return {
          text: 'View',
          icon: faEye,
          idValue: 'view',
          urlPath: `/customer/view/${customerID}`,
          isLink: true,
        };
      } else if (action === 'edit') {
        return {
          text: 'Edit',
          icon: faPenNib,
          idValue: 'edit',
          urlPath: `/customer/edit/${customerID}`,
          isLink: true,
        };
      } else if (action === 'delete') {
        return {
          text: 'Delete',
          icon: faTrash,
          idValue: 'delete',
          onClick: () => handleDelete(customerID),
          isLink: false,
        };
      } else if (action === 'approve') {
        return {
          text: 'Approve',
          icon: faThumbsUp,
          idValue: 'allow',
          onClick: () => handleDelete(customerID), 
          isLink: false,
        }
      } else if (action === 'reject') {
        return {
          text: 'Reject',
          icon: faThumbsDown,
          idValue: 'deny',
          onClick: () => handleDelete(customerID),
          isLink: false,
        }
      } else {
        return null;
      }
    })
    .filter((content) => content !== null);

  return (
    <td>
      {actionContent.map((content, index) => (
        content.isLink ? (
          <a href={content.urlPath} key={index}>
            <div id={content.idValue} className="tableAction">
              <FontAwesomeIcon icon={content.icon} />
              <p>{content.text}</p>
            </div>
          </a>
        ) : (
          <div
            key={index}
            id={content.idValue}
            className="tableAction"
            onClick={content.onClick}
          >
            <FontAwesomeIcon icon={content.icon} />
            <p>{content.text}</p>
          </div>
        )
      ))}
    </td>
  );
};

const TableRow = ({ rowContent, actions, handleDelete }) => {
  return (
    <tr>
      <td>{rowContent[0]}</td>
      <td>{rowContent[1]}</td>
      <td>{rowContent[2]}</td>
      <td>{rowContent[3] ? 'active' : 'inactive'}</td>
      <TableActions
        withLoyalty={true}
        checkLoyalty={rowContent[4]}
        actions={actions}
        customerID={rowContent[0]}
        handleDelete={handleDelete}
      />
    </tr>
  );
};

const TableContent = ({ customerDataList, userActs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const topics = ['Customer ID', 'Name', 'Country', 'Status', 'Actions'];
  const maxRows = 7;
  
  const filteredData = customerDataList.filter(customer =>
    customer[0]?.toString().includes(searchTerm) || customer[1]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredData.length / maxRows);
  const activeRows = filteredData.slice(
    currentPage * maxRows - maxRows,
    currentPage * maxRows
  );

  const handlePagination = (direction) => {
    if (direction === '>' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === '<' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (!isNaN(direction)) {
      setCurrentPage(parseInt(direction, 10));
    }
  };

  const handleDelete = (customerId) => {
    const payload = {
      cid: customerId,
    };
    Axios.post('http://localhost:8070/api/deleteclient', payload)
      .then((response) => {
        alert('Successfully deleted');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleLogoutButtonClick = () =>{
    navigate('/login')
  }

  return (
    <div className="tableBlock">
      {/* search box */}
      <div className='userOpt'>
        <div className="searchBox">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
            className="searchInput"
          />
        </div>
        
          {/* <button className="logoutBtn" onClick={handleLogoutButtonClick}>Log Out</button> */}
        
      </div>
      
      <table>
        <thead>
          <tr>
            {topics.map((topic, index) => (
              <th key={index}>{topic}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeRows.map((customer, index) => (
            <TableRow
              key={index}
              rowContent={customer}
              actions={userActs}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
      <div className="tableAddings">
        <p className="resultCount">
          Showing{' '}
          <span>{currentPage * maxRows - maxRows + 1}</span> to{' '}
          <span>
            {filteredData.length > currentPage * maxRows
              ? currentPage * maxRows
              : filteredData.length}
          </span>{' '}
          of <span>{filteredData.length}</span> results{' '}
        </p>
        <TablePagination
          currentIndex={currentPage - 1}
          totalIndex={totalPages}
          paginationFunction={handlePagination}
        />
      </div>
    </div>
  );
};

export default TableContent;
