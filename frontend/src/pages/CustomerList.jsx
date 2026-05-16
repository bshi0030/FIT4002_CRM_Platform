import React from 'react';
import '../styles/CustomerList.css'

function CustomerList({ setCurrentPage }) {
  return (
    <div className="customer-list-container">
      <h1>Customers</h1>
      <div className="customer-list-content">
          <button 
            className="customer-profile-btn"
            onClick={() => setCurrentPage("customer-profile")}
          >
            View Customer Profile
          </button>
      </div>
    </div>
  );
}

export default CustomerList;
