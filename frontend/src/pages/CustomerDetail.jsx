import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './Customers.css';
import AddCustomerModal from '../components/AddCustomerModal';

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch customer details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleCustomerUpdated = () => {
    fetchCustomer();
  };

  if (loading) return <div className="loading-msg">Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!customer) return <div className="error-msg">Customer not found.</div>;

  return (
    <div className="customer-detail-page">
      <div className="customer-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <Link to="/customers" className="back-link">← Back to Customers</Link>
          <h1 style={{ marginTop: '10px' }}>Customer Profile</h1>
        </div>
        <button className="add-contact-btn" onClick={() => setIsEditModalOpen(true)}>
          Edit Customer
        </button>
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

      {isEditModalOpen && (
        <AddCustomerModal 
          onClose={() => setIsEditModalOpen(false)} 
          onAdd={handleCustomerUpdated}
          initialData={customer}
        />
      )}
    </div>
  );
};

export default CustomerDetail;
