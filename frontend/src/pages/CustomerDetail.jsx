import { useState, useEffect, useRef } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10000000) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadError(null);
      await api.post(`/customers/${id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchCustomer();
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <h3>Interaction Timeline</h3>
            <div className="timeline-placeholder">
              {/* Combine file uploads as events in the timeline */}
              {customer.attachments && customer.attachments.map((file) => (
                <div className="timeline-item" key={`timeline-${file._id}`}>
                  <span className="timeline-date">{new Date(file.uploadedAt).toLocaleString()}</span>
                  <p>Uploaded document: <strong>{file.originalName}</strong></p>
                </div>
              ))}
              <div className="timeline-item">
                <span className="timeline-date">{new Date(customer.createdAt).toLocaleString()}</span>
                <p>Added to the system.</p>
              </div>
            </div>
          </div>

          <div className="files-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Files & Documents</h3>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
                />
                <button className="add-contact-btn" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
            
            {uploadError && <p className="error-msg">{uploadError}</p>}
            
            <div className="files-list">
              {customer.attachments && customer.attachments.length > 0 ? (
                customer.attachments.map(file => (
                  <div className="file-item" key={file._id}>
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <div>
                        <strong>{file.originalName}</strong>
                        <div className="file-meta">
                          {formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="file-actions">
                      <a href={`http://localhost:5000/api/customers/${customer._id}/files/${file._id}/view`} target="_blank" rel="noopener noreferrer" className="btn-link">Open</a>
                      <a href={`http://localhost:5000/api/customers/${customer._id}/files/${file._id}/download`} className="btn-link">Download</a>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#777', fontStyle: 'italic' }}>No files attached yet.</p>
              )}
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
