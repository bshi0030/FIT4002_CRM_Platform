import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './Customers.css';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await api.get(`/customers/${id}`);
        setCustomer(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch customer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <div className="loading-msg">Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!customer) return <div className="error-msg">Customer not found.</div>;

  return (
    <div className="customer-detail-page">
      <div className="customer-detail-header">
        <Link to="/customers" className="back-link">← Back to Customers</Link>
        <h1>Customer Profile</h1>
      </div>

      <div className="customer-profile-container">
        <div className="profile-sidebar">
          {customer.companyLogo ? (
            <img src={`http://localhost:5000${customer.companyLogo}`} alt={`${customer.company} logo`} className="profile-logo" />
          ) : (
            <div className="profile-logo-placeholder">🏢</div>
          )}
          <h2>{customer.fullName}</h2>
          <p className="profile-designation">{customer.designation}</p>
          <p className="profile-company">{customer.company}</p>
          
          <div className="profile-contact-info">
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Department:</strong> {customer.department}</p>
            <p><strong>Address:</strong> {customer.address}</p>
          </div>
        </div>

        <div className="profile-main-content">
          <div className="timeline-section">
            <h3>Interaction Timeline (Placeholder)</h3>
            <div className="timeline-placeholder">
              <div className="timeline-item">
                <span className="timeline-date">Today</span>
                <p>Sent introduction email to {customer.fullName}.</p>
              </div>
              <div className="timeline-item">
                <span className="timeline-date">Yesterday</span>
                <p>Added to the system.</p>
              </div>
            </div>
          </div>

          <div className="files-section">
            <h3>Files & Notes (Placeholder)</h3>
            <div className="files-placeholder">
              <div className="file-item">
                <span>📄 Proposal_v1.pdf</span>
              </div>
              <div className="file-item">
                <span>📝 Note: Client is interested in Q3 implementation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
