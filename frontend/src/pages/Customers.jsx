import { useState, useEffect } from 'react';
import api from '../services/api';
import AddCustomerModal from '../components/AddCustomerModal';
import EmailComposer from '../components/EmailComposer';
import '../styles/EmailComposer.css';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Customers.css';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailModalData, setEmailModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await api.get('/customers');
      setCustomers(res.data);
      if (showLoading) setError(null);
    } catch (err) {
      console.error(err);
      if (showLoading) setError('Failed to load customers.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInteraction = async (customer, type) => {
    if (type === 'Email') {
      setEmailModalData(customer);
      return;
    }

    try {
      await api.post(`/customers/${customer._id}/interactions`, {
        type: type,
        details: `Initiated ${type} contact from Customer List`
      });
      
      fetchCustomers(false); // Silent refresh to avoid unmounting DOM
    } catch (err) {
      console.error(`Failed to log ${type} interaction`, err);
    }
  };

  const handleEmailSent = async (data) => {
    if (!emailModalData) return;
    try {
      await api.post(`/customers/${emailModalData._id}/interactions`, {
        type: 'Email',
        details: `Sent Email - Subject: ${data.desc}`
      });
      fetchCustomers(false);
    } catch (err) {
      console.error("Failed to log email interaction", err);
    }
  };

  const handleCustomerAdded = () => {
    fetchCustomers(); // Refresh the list
  };

  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return 'Today';
    }
    
    return date.toLocaleDateString();
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
                        <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${cust.companyLogo}`} alt="logo" className="contact-avatar" />
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
                      <span>{formatActivityDate(cust.interactions && cust.interactions.length > 0 ? cust.interactions[cust.interactions.length - 1].date : cust.createdAt)}</span>
                      <span className="activity-icons">
                        <span style={{cursor: 'pointer'}} title="Email Customer" onClick={() => handleInteraction(cust, 'Email')}>✉️</span>
                        {' '}
                        <a href={`tel:${cust.phone}`} style={{cursor: 'pointer', textDecoration: 'none', color: 'inherit'}} title="Call Customer" onClick={() => handleInteraction(cust, 'Call')}>📞</a>
                      </span>
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

      {emailModalData && (
        <div className="modal-overlay">
          <EmailComposer 
            customerEmail={emailModalData.email}
            onClose={() => setEmailModalData(null)}
            onEmailSent={handleEmailSent}
          />
        </div>
      )}
    </div>
  );
};

export default Customers;
