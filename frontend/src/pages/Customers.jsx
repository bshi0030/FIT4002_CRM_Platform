import { useState, useEffect } from 'react';
import api from '../services/api';
import AddCustomerModal from '../components/AddCustomerModal';
import { Link } from 'react-router-dom';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerAdded = () => {
    fetchCustomers(); // Refresh the list
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1>Customers</h1>
        <button className="add-contact-btn" onClick={() => setIsModalOpen(true)}>
          + Add Contact
        </button>
      </div>

      <div className="customer-list-container">
        <div className="customer-list-header">
          <div>
            <h2>Customer List</h2>
            <p>Total {customers.length}</p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <span>🔍</span>
          </div>
        </div>

        {loading ? (
          <p className="loading-msg">Loading customers...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Pipeline Stage</th>
                <th>Assignee</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id}>
                  <td>
                    <Link to={`/customers/${cust._id}`} className="contact-cell">
                      {cust.companyLogo ? (
                        <img src={`http://localhost:5000${cust.companyLogo}`} alt="logo" className="contact-avatar" />
                      ) : (
                        <div className="contact-avatar-placeholder">👤</div>
                      )}
                      <div className="contact-info">
                        <span className="contact-name">{cust.fullName}</span>
                        <span className="contact-email">{cust.email}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div className="company-name">{cust.company}</div>
                  </td>
                  <td>
                    <div className="designation">{cust.designation}</div>
                  </td>
                  <td>
                    <span className="badge contact-made">Contact Made</span>
                  </td>
                  <td>
                    <div className="assignee-cell">
                      <div className="contact-avatar-placeholder small">👤</div>
                      <span>You</span>
                    </div>
                  </td>
                  <td>
                    <div className="last-activity">
                      <span>Today</span>
                      <span className="activity-icons">✉️ 📞</span>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <AddCustomerModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleCustomerAdded} 
        />
      )}
    </div>
  );
};

export default Customers;
