import { useState, useEffect } from "react";
import "../styles/SalesPipeline.css";
import DealCard from "../components/DealCard";
import { getDeals, createDeal, updateDealStage, markDealOutcome, getDealLogs } from "../api/deals";

const STAGES = [
  { name: "Qualified", dot: "#A4A4A4" },
  { name: "Contact Made", dot: "#F5C518" },
  { name: "Demo Scheduled", dot: "#4DC9C9" },
  { name: "Proposal Made", dot: "#F5A623" },
  { name: "Negotiation", dot: "#C0392B" },
];

const INITIAL_FORM = {
  name: "", company: "", price: "",
  priority: "Medium", probability: 20,
  assignee: "", customer: ""
};

function SalesPipeline() {
  const [deals, setDeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    getDeals()
      .then(data => { setDeals(data); setLoading(false); })
      .catch(err => { console.error(err); setError('Failed to load deals'); setLoading(false); });
  }, []);

  const handleAddLead = () => setShowModal(true);
  const handleCloseModal = () => { setShowModal(false); setForm(INITIAL_FORM); };
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.company || !form.price) return;
    try {
      const newDeal = await createDeal({
        name: form.name, company: form.company, price: form.price,
        priority: form.priority, probability: Number(form.probability),
        assignee: form.assignee, customer: form.customer,
      });
      setDeals([...deals, newDeal]);
      handleCloseModal();
    } catch (err) { console.error(err); }
  };

  const getDealsForStage = (stageName) => deals.filter(d => d.stage === stageName);

  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('dealId', deal._id);
    e.dataTransfer.setData('currentStage', deal.stage);
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    const currentStage = e.dataTransfer.getData('currentStage');
    if (currentStage === targetStage) return;
    try {
      const updatedDeal = await updateDealStage(dealId, targetStage);
      setDeals(prev => prev.map(d => d._id === updatedDeal._id ? updatedDeal : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Stage change not allowed');
    }
  };

  const handleOutcomeDrop = async (e, outcome) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    const currentStage = e.dataTransfer.getData('currentStage');
    if (['Won', 'Lost'].includes(currentStage)) return;
    try {
      const updatedDeal = await markDealOutcome(dealId, outcome);
      setDeals(prev => prev.map(d => d._id === updatedDeal._id ? updatedDeal : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not mark outcome');
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const handleOpenHistory = async () => {
    setShowHistory(true);
    setLogsLoading(true);
    try {
      const data = await getDealLogs();
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <div className="pipeline-page">

      {/* Won / Lost drop zones */}
      <div className="wonlost-panel">
        <div
          className="wonlost-section"
          onDragOver={allowDrop}
          onDrop={(e) => handleOutcomeDrop(e, 'Won')}
        >
          <div className="wonlost-label-row">
            <span className="wonlost-text">Won</span>
          </div>
          <div className="wonlost-box">
            {getDealsForStage('Won').map(deal => (
              <DealCard key={deal._id} deal={deal} onDragStart={(e) => handleDragStart(e, deal)} />
            ))}
          </div>
          <div className="wonlost-arrow">&#8964;</div>
        </div>

        <div
          className="wonlost-section"
          onDragOver={allowDrop}
          onDrop={(e) => handleOutcomeDrop(e, 'Lost')}
        >
          <div className="wonlost-label-row">
            <span className="wonlost-text">Lost</span>
          </div>
          <div className="wonlost-box">
            {getDealsForStage('Lost').map(deal => (
              <DealCard key={deal._id} deal={deal} onDragStart={(e) => handleDragStart(e, deal)} />
            ))}
          </div>
          <div className="wonlost-arrow">&#8964;</div>
        </div>
      </div>

      <div className="pipeline-gradient-box">
        <div className="pipeline-title-row">
          <h1 className="pipeline-title">Sales Pipeline</h1>
          <button className="btn-deal-history" onClick={handleOpenHistory}>Deal History</button>
        </div>

        <div className="pipeline-action-bar">
          <button className="btn-add-lead" onClick={handleAddLead}>+ Add Lead</button>
        </div>

        {loading && <p style={{ color: '#555', fontSize: '14px' }}>Loading deals...</p>}
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <div className="pipeline-stages">
          {STAGES.map(stage => (
            <div
              className="stage-column"
              key={stage.name}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              <div className="stage-header">
                <span className="stage-dot" style={{ backgroundColor: stage.dot }} />
                <span className="stage-name">{stage.name}</span>
              </div>
              <div className="stage-cards-area">
                {getDealsForStage(stage.name).map(deal => (
                  <DealCard key={deal._id} deal={deal} onDragStart={(e) => handleDragStart(e, deal)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add New Lead</h2>
            <div className="modal-field">
              <label className="modal-label">Deal Name *</label>
              <input className="modal-input" type="text" name="name" value={form.name} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Company Name *</label>
              <input className="modal-input" type="text" name="company" value={form.company} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Deal Price *</label>
              <input className="modal-input" type="text" name="price" value={form.price} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Priority</label>
              <select className="modal-input" name="priority" value={form.priority} onChange={handleFormChange}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="modal-field">
              <label className="modal-label">Deal Probability (%)</label>
              <input className="modal-input" type="number" name="probability" min="0" max="100" value={form.probability} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Assignee</label>
              <input className="modal-input" type="text" name="assignee" value={form.assignee} onChange={handleFormChange} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Customer</label>
              <input className="modal-input" type="text" name="customer" value={form.customer} onChange={handleFormChange} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Deal History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-box history-modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Deal History</h2>
            {logsLoading && <p style={{ fontSize: '14px', color: '#555' }}>Loading...</p>}
            {!logsLoading && logs.length === 0 && (
              <p style={{ fontSize: '14px', color: '#888' }}>No stage changes recorded yet.</p>
            )}
            {!logsLoading && logs.length > 0 && (
              <div className="history-log-list">
                {logs.map((log, i) => (
                  <div className="history-log-item" key={i}>
                    <span className="history-log-date">{formatDate(log.changedAt)}</span>
                    <span className="history-log-deal">{log.dealName}</span>
                    <span className="history-log-change">
                      {log.fromStage ? `${log.fromStage} → ${log.toStage}` : `Created as ${log.toStage}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowHistory(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SalesPipeline;