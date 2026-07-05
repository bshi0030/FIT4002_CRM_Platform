import React, { useState, useEffect, useCallback } from 'react'
import '../styles/Dashboard.css'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import {
    FiTrendingUp, FiCheckCircle, FiClock, FiDollarSign,
    FiPhone, FiUsers, FiMail, FiAward,
    FiBarChart2, FiGitMerge, FiActivity,
    FiArrowUp, FiArrowDown, FiUser, FiVideo, FiMove,
    FiFileText, FiPaperclip, FiEdit2, FiList, FiFile, FiEdit3, FiFolder
} from 'react-icons/fi'
import { useAuth } from '@/context/auth'
import { fetchDashboardData } from '@/api/dashboard'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    arraySwap,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    rectSwappingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const POLL_MS     = 30000
const ACCENT      = '#253984'
const ACCENT_DIM  = '#2A2A72'
const CHART_GREEN = '#4DC9C9'
const CHART_GREY  = '#A4A4A4'

const fmtCurrency = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
const fmtMoney = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
const fmtTime = (iso) => { const d = new Date(iso); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }

function Skeleton({ w = '100%', h = 20 }) {
    return <div className="skeleton" style={{ width: w, height: h }} />
}

function SortableKpiCard({ id, icon, label, value, change, sub, loading, isEditing }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.8 : 1,
        position: 'relative'
    };

    const positive = change >= 0
    return (
        <div className="kpi-card" ref={setNodeRef} style={style}>
            <div className="kpi-card-top">
                <span className="kpi-icon" {...(isEditing ? attributes : {})} {...(isEditing ? listeners : {})} style={{ cursor: isEditing ? 'grab' : 'default', display: 'flex', alignItems: 'center' }}>
                    {isEditing && <FiMove size={14} style={{ marginRight: '6px', opacity: 0.4 }} />}
                    {icon}
                </span>
                <span className={`kpi-badge ${positive ? 'badge-up' : 'badge-down'}`}>
                    {positive ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />} {Math.abs(change)}%
                </span>
            </div>
            <div className="kpi-label">{label}</div>
            {loading ? <Skeleton h={36} w="70%" /> : <div className="kpi-value">{value}</div>}
            {loading ? <Skeleton h={14} w="50%" /> : <div className="kpi-sub">{sub}</div>}
        </div>
    )
}

const DonutLabel = ({ cx, cy, pct }) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="donut-center-text">
        <tspan x={cx} dy="-0.4em" fontSize="22" fontWeight="700" fill="#333">{pct}%</tspan>
        <tspan x={cx} dy="1.4em" fontSize="11" fill="#888">Completed</tspan>
    </text>
)

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="chart-tooltip">
            <p className="ct-label">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color }}>
                    {p.name === 'sales' ? fmtMoney(p.value) : `${p.value} deals`}
                </p>
            ))}
        </div>
    )
}

function SortableCard({ id, title, subTitle, headerRight, children, isEditing }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };
  
    return (
        <div className={`chart-card ${id}-card`} ref={setNodeRef} style={style}>
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isEditing && (
                        <div className="drag-handle" {...attributes} {...listeners}>
                            <FiMove size={16} />
                        </div>
                    )}
                    <div>
                        <h3 className="card-title">{title}</h3>
                        <p className="card-sub">{subTitle}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {headerRight}
                </div>
            </div>
            {children}
        </div>
    );
}

const DEFAULT_KPI_LAYOUT = ['totalSales', 'dealsCompleted', 'ongoingDeals', 'avgDealValue'];
const DEFAULT_LAYOUT = ['pipeline', 'trends', 'activity', 'team'];

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [clock, setClock] = useState('')
    const [lastUpdated, setLastUpdated] = useState('')
    const [salesChartType, setSalesChartType] = useState('area')
    const [isEditing, setIsEditing] = useState(false)
    const { user } = useAuth()

    const [kpiLayoutOrder, setKpiLayoutOrder] = useState(() => {
        const saved = localStorage.getItem('dashboard-kpi-layout');
        return saved ? JSON.parse(saved) : DEFAULT_KPI_LAYOUT;
    });

    const [layoutOrder, setLayoutOrder] = useState(() => {
        const saved = localStorage.getItem('dashboard-layout');
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            if (DEFAULT_KPI_LAYOUT.includes(active.id)) {
                setKpiLayoutOrder((items) => {
                    const oldIndex = items.indexOf(active.id);
                    const newIndex = items.indexOf(over.id);
                    const newOrder = arraySwap(items, oldIndex, newIndex);
                    localStorage.setItem('dashboard-kpi-layout', JSON.stringify(newOrder));
                    return newOrder;
                });
            } else {
                setLayoutOrder((items) => {
                    const oldIndex = items.indexOf(active.id);
                    const newIndex = items.indexOf(over.id);
                    const newOrder = arraySwap(items, oldIndex, newIndex);
                    localStorage.setItem('dashboard-layout', JSON.stringify(newOrder));
                    return newOrder;
                });
            }
        }
    };

    const resetLayout = () => {
        setKpiLayoutOrder(DEFAULT_KPI_LAYOUT);
        setLayoutOrder(DEFAULT_LAYOUT);
        localStorage.removeItem('dashboard-kpi-layout');
        localStorage.removeItem('dashboard-layout');
    };

    useEffect(() => {
        const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            try {
                const result = await fetchDashboardData();
                if (mounted) {
                    setData(result);
                    setLoading(false);
                    setLastUpdated(new Date().toLocaleTimeString());
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                if (mounted) setLoading(false);
            }
        };

        loadData();
        const id = setInterval(loadData, 5000); // Poll every 5 seconds

        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, []);

    const pipeline = data?.pipeline
    const pieData = pipeline ? [
        { name: 'Completed Deals', value: pipeline.completedDeals },
        { name: 'Ongoing Deals', value: pipeline.ongoingDeals },
        { name: 'Lost Deals', value: pipeline.lostDeals }
    ] : []
    const pct = pipeline ? Math.round((pipeline.completedDeals / pipeline.total) * 100) : 0
    const teamMembers = data?.teamPerformance?.members ?? []
    const topMember = data?.teamPerformance?.topMember ?? ''
    const teamTotal = teamMembers.reduce((s, m) => s + m.sales, 0)
    const teamDeals = teamMembers.reduce((s, m) => s + m.deals, 0)
    const teamAvg = teamMembers.length ? Math.round(teamTotal / teamMembers.length) : 0
    const recentActivities = data?.recentActivities?.map(act => ({
        ...act,
        icon: act.iconType === 'phone' ? <FiPhone size={14} /> :
              act.iconType === 'mail' ? <FiMail size={14} /> :
              act.iconType === 'task' ? <FiList size={14} /> :
              act.iconType === 'note' ? <FiEdit3 size={14} /> :
              act.iconType === 'file' ? <FiFolder size={14} /> :
              <FiVideo size={14} />
    })) ?? []

    const renderKpi = (id) => {
        switch (id) {
            case 'totalSales':
                return <SortableKpiCard key="totalSales" id="totalSales" isEditing={isEditing} icon={<FiTrendingUp size={20} />} label="TOTAL SALES" value={data ? fmtMoney(data.totalSales.value) : '—'} change={data?.totalSales.changePercent ?? 0} sub="vs last month" loading={loading} />
            case 'dealsCompleted':
                return <SortableKpiCard key="dealsCompleted" id="dealsCompleted" isEditing={isEditing} icon={<FiCheckCircle size={20} />} label="DEALS COMPLETED" value={data?.dealsCompleted.value ?? '—'} change={data?.dealsCompleted.changePercent ?? 0} sub="vs last month" loading={loading} />
            case 'ongoingDeals':
                return <SortableKpiCard key="ongoingDeals" id="ongoingDeals" isEditing={isEditing} icon={<FiClock size={20} />} label="ONGOING DEALS" value={data?.ongoingDeals.value ?? '—'} change={data?.ongoingDeals.changePercent ?? 0} sub="vs last month" loading={loading} />
            case 'avgDealValue':
                return <SortableKpiCard key="avgDealValue" id="avgDealValue" isEditing={isEditing} icon={<FiDollarSign size={20} />} label="AVG DEAL VALUE" value={data ? fmtMoney(data.avgDealValue.value) : '—'} change={data?.avgDealValue.changePercent ?? 0} sub="vs last month" loading={loading} />
            default:
                return null;
        }
    }

    const renderChart = (id) => {
        switch (id) {
            case 'pipeline':
                return (
                    <SortableCard 
                        key="pipeline" 
                        id="pipeline" 
                        title="Sales Pipeline" 
                        subTitle="Completed vs ongoing deals" 
                        isEditing={isEditing}
                        headerRight={pipeline && <span className="total-badge">{pipeline.total} Total</span>}
                    >
                        <div className="pipeline-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', gap: '20px', padding: '10px 0' }}>
                            <div className="donut-wrap">
                                {loading ? <Skeleton w={180} h={180} /> : (
                                    <PieChart width={180} height={180}>
                                        <Pie data={pieData} cx={90} cy={90} innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" paddingAngle={3}>
                                            <Cell fill={ACCENT} stroke="none" />
                                            <Cell fill={CHART_GREY} stroke="none" />
                                            <Cell fill="#e74c3c" stroke="none" />
                                        </Pie>
                                        <DonutLabel cx={90} cy={90} pct={pct} />
                                    </PieChart>
                                )}
                                <div className="donut-legend">
                                    <span className="dot" style={{ background: ACCENT }} /><span>Completed Deals</span><strong>{pipeline?.completedDeals ?? '—'}</strong>
                                    <span className="dot" style={{ background: CHART_GREY }} /><span>Ongoing Deals</span><strong>{pipeline?.ongoingDeals ?? '—'}</strong>
                                    <span className="dot" style={{ background: '#e74c3c' }} /><span>Lost Deals</span><strong>{pipeline?.lostDeals ?? '—'}</strong>
                                </div>
                            </div>
                            <div className="stage-breakdown" style={{ width: '100%' }}>
                                <p className="stage-title">Pipeline Stages</p>
                                {loading ? [1,2,3,4,5].map(i => <Skeleton key={i} h={14} />) : pipeline?.stages.map((s) => (
                                    <div key={s.name} className="stage-row">
                                        <span className="stage-name">{s.name}</span>
                                        <span className="stage-count">{s.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SortableCard>
                );
            case 'trends':
                return (
                    <SortableCard 
                        key="trends" 
                        id="trends" 
                        title="Sales Trends" 
                        subTitle="Revenue and deals performance over time" 
                        isEditing={isEditing}
                        headerRight={
                            <div className="chart-toggle">
                                <button className={`toggle-btn ${salesChartType === 'area' ? 'active' : ''}`} onClick={() => setSalesChartType('area')}><FiTrendingUp size={16} /></button>
                                <button className={`toggle-btn ${salesChartType === 'bar' ? 'active' : ''}`} onClick={() => setSalesChartType('bar')}><FiBarChart2 size={16} /></button>
                            </div>
                        }
                    >
                        {loading ? <Skeleton h={160} /> : salesChartType === 'area' ? (
                            <div style={{ flex: 1, minHeight: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.salesTrends ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={ACCENT} stopOpacity={0.6} />
                                                <stop offset="95%" stopColor={ACCENT} stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} width={48} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Area type="monotone" dataKey="sales" name="sales" stroke={ACCENT_DIM} strokeWidth={2} fill="url(#gradSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div style={{ flex: 1, minHeight: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.salesTrends ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} width={48} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar dataKey="sales" name="sales" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </SortableCard>
                );
            case 'activity':
                return (
                    <SortableCard 
                        key="activity" 
                        id="activity" 
                        title="Activity Summary" 
                        subTitle="All team activities"
                        isEditing={isEditing}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div className="activity-grid">
                                {[
                                    { icon: <FiPhone size={20} />, label: 'Calls Made', key: 'callsMade', changeKey: 'callsChange' },
                                    { icon: <FiUsers size={20} />, label: 'Meetings Held', key: 'meetingsHeld', changeKey: 'meetingsChange' },
                                    { icon: <FiMail size={20} />, label: 'Emails Sent', key: 'emailsSent', changeKey: 'emailsChange' },
                                    { icon: <FiAward size={20} />, label: 'Deals Closed', key: 'dealsClosed', changeKey: 'dealsChange' },
                                ].map(({ icon, label, key, changeKey }) => {
                                    const val = data?.activitySummary?.[key]
                                    const chg = data?.activitySummary?.[changeKey] ?? 0
                                    const pos = chg >= 0
                                    return (
                                        <div key={key} className="activity-tile">
                                            <div className="activity-tile-top">
                                                <span className="activity-icon">{icon}</span>
                                                <span className={`kpi-badge ${pos ? 'badge-up' : 'badge-down'}`} style={{ fontSize: 11 }}>{pos ? '+' : ''}{chg}%</span>
                                            </div>
                                            {loading ? <Skeleton h={28} w="50%" /> : <div className="activity-val">{val ?? '—'}</div>}
                                            <div className="activity-label">{label}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="recent-activities" style={{ marginTop: 'auto' }}>
                                <h4 className="recent-activities-title">Recent Activities</h4>
                                <div className="recent-activities-list">
                                    {recentActivities.map(act => (
                                        <div key={act.id} className="recent-activity-item" style={{ backgroundColor: act.id === 1 ? '#eaf6ff' : '#fff' }}>
                                            <div className="recent-activity-icon" style={{ backgroundColor: act.bg, color: act.color }}>{act.icon}</div>
                                            <div className="recent-activity-details">
                                                <span className="recent-activity-company">{act.company}</span>
                                                <span className="recent-activity-desc">{act.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SortableCard>
                );
            case 'team':
                return (
                    <SortableCard 
                        key="team" 
                        id="team" 
                        title="Team Performance" 
                        subTitle="Compare team member metrics" 
                        isEditing={isEditing}
                        headerRight={topMember && <span className="top-badge"><FiAward size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />Top: {topMember}</span>}
                    >
                        {loading ? <Skeleton h={160} /> : (
                            <div style={{ flex: 1, minHeight: 160 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={teamMembers} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#777' }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 10, fill: '#777' }} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(v, n) => n === 'sales' ? fmtMoney(v) : v} />
                                        <Bar dataKey="sales" name="Sales" fill={ACCENT} radius={[4,4,0,0]} maxBarSize={30} />
                                        <Bar dataKey="deals" name="Deals" fill={CHART_GREEN} radius={[4,4,0,0]} maxBarSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        <table className="team-table">
                            <thead><tr><th>Team Member</th><th>Sales</th><th>Deals</th><th>Activities</th></tr></thead>
                            <tbody>
                                {loading ? [1,2,3].map(i => (<tr key={i}>{[1,2,3,4].map(j => <td key={j}><Skeleton h={12} /></td>)}</tr>))
                                    : teamMembers.map((m) => (
                                        <tr key={m.name} className={m.name === topMember ? 'top-row' : ''}>
                                            <td>{m.name}</td><td>{fmtMoney(m.sales)}</td><td>{m.deals}</td><td>{m.activities}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {!loading && (
                            <div className="team-footer">
                                <div className="team-footer-item"><span className="tf-icon" style={{ background: ACCENT }}><FiBarChart2 size={16} /></span><span>Total Sales</span><strong>{fmtMoney(teamTotal)}</strong></div>
                                <div className="team-footer-item"><span className="tf-icon" style={{ background: CHART_GREEN }}><FiGitMerge size={16} /></span><span>Total Deals</span><strong>{teamDeals}</strong></div>
                                <div className="team-footer-item"><span className="tf-icon" style={{ background: '#aaa' }}><FiActivity size={16} /></span><span>Avg per Member</span><strong>{fmtMoney(teamAvg)}</strong></div>
                            </div>
                        )}
                    </SortableCard>
                );
            default:
                return null;
        }
    }

    return (
        <div className="dashboard">

            <div className="dashboard-topbar">
                <div className="dashboard-user">
                    <div className="dashboard-user-avatar"><FiUser size={20} /></div>
                    <div className="dashboard-user-info">
                        <span className="dashboard-user-name">{user?.fullName?? + ' (You)'}</span>
                        <span className="dashboard-user-role">{user?.role}</span>
                    </div>
                </div>
                <div className="dashboard-filters">
                    <select className="dashboard-select" defaultValue="This Month">
                        <option>This Month</option>
                    </select>
                    <select className="dashboard-select" defaultValue="All Team Members">
                        <option>All Team Members</option>
                    </select>
                    <button className="dashboard-reset-btn" onClick={() => setIsEditing(!isEditing)} style={{ background: isEditing ? '#253984' : '#fff', color: isEditing ? '#fff' : '#444' }}>
                        {isEditing ? 'Done Editing' : 'Edit Layout'}
                    </button>
                    {isEditing && <button className="dashboard-reset-btn" onClick={resetLayout}>Reset</button>}
                </div>
            </div>

            <div className="live-banner">
                <span className="live-dot" />
                <span className="live-text">Live · Updated {lastUpdated || clock}</span>
                {error && <span className="live-error"> · {error}</span>}
            </div>

            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="kpi-row">
                    <SortableContext 
                        items={kpiLayoutOrder}
                        strategy={rectSwappingStrategy}
                    >
                        {kpiLayoutOrder.map(id => renderKpi(id))}
                    </SortableContext>
                </div>

                <div className="chart-grid">
                    <SortableContext 
                        items={layoutOrder}
                        strategy={rectSwappingStrategy}
                    >
                        {layoutOrder.map(id => renderChart(id))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    )
}
