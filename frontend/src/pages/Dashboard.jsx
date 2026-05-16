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
    FiArrowUp, FiArrowDown, FiUser, FiVideo
} from 'react-icons/fi'

const POLL_MS     = 30000
const ACCENT      = '#E9FF6B'
const ACCENT_DIM  = '#b8cc3a'
const CHART_GREEN = '#8bc34a'
const CHART_GREY  = '#9e9e9e'

const fmtCurrency = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
const fmtMoney = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
const fmtTime = (iso) => { const d = new Date(iso); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }

function Skeleton({ w = '100%', h = 20 }) {
    return <div className="skeleton" style={{ width: w, height: h }} />
}

function KpiCard({ icon, label, value, change, sub, loading }) {
    const positive = change >= 0
    return (
        <div className="kpi-card">
            <div className="kpi-card-top">
                <span className="kpi-icon">{icon}</span>
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

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [clock, setClock] = useState('')
    const [lastUpdated, setLastUpdated] = useState('')
    const [salesChartType, setSalesChartType] = useState('area')

    useEffect(() => {
        const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    const generateMockData = useCallback(() => {
        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
        const completedDeals = rand(218, 226)
        const ongoingDeals = rand(38, 46)
        const totalDeals = completedDeals + ongoingDeals
        const totalSales = 625000 + rand(-3000, 5000)
        const avgDeal = Math.round(totalSales / completedDeals)
        const newData = {
            totalSales: { value: totalSales, changePercent: parseFloat((rand(108, 130) / 10).toFixed(1)) },
            dealsCompleted: { value: completedDeals, changePercent: parseFloat((rand(55, 95) / 10).toFixed(1)) },
            ongoingDeals: { value: ongoingDeals, changePercent: parseFloat((rand(30, 60) / 10).toFixed(1)) },
            avgDealValue: { value: avgDeal, changePercent: parseFloat((rand(140, 165) / 10).toFixed(1)) },
            pipeline: {
                stages: [
                    { name: 'Qualified', count: rand(6, 10) },
                    { name: 'Contact Made', count: rand(48, 56) },
                    { name: 'Demo Scheduled', count: rand(3, 7) },
                    { name: 'Proposal Sent', count: rand(3, 6) },
                    { name: 'Negotiation', count: rand(3, 7) }
                ],
                completedDeals, ongoingDeals, total: totalDeals
            },
            salesTrends: [
                { week: 'Week 1', sales: rand(80000, 100000) },
                { week: 'Week 2', sales: rand(95000, 120000) },
                { week: 'Week 3', sales: rand(105000, 135000) },
                { week: 'Week 4', sales: rand(130000, 160000) }
            ],
            activitySummary: {
                callsMade: rand(40, 50), meetingsHeld: rand(15, 22),
                emailsSent: rand(120, 135), dealsClosed: rand(10, 15),
                callsChange: 12, meetingsChange: 12, emailsChange: -9, dealsChange: 12
            },
            teamPerformance: {
                topMember: 'Sarah J.',
                members: [
                    { name: 'You', sales: rand(60000, 70000), deals: rand(20, 25), activities: rand(138, 152) },
                    { name: 'Sarah J.', sales: rand(73000, 83000), deals: rand(23, 27), activities: rand(160, 176) },
                    { name: 'Mike C.', sales: rand(54000, 63000), deals: rand(17, 22), activities: rand(126, 140) },
                    { name: 'Emma D.', sales: rand(64000, 73000), deals: rand(20, 26), activities: rand(148, 165) },
                    { name: 'James W.', sales: rand(48000, 57000), deals: rand(15, 20), activities: rand(110, 125) }
                ]
            },
            lastUpdated: new Date().toISOString()
        }
        setData(newData)
        setLastUpdated(fmtTime(newData.lastUpdated))
        setError(null)
        setLoading(false)
    }, [])

    useEffect(() => {
        generateMockData()
        const id = setInterval(generateMockData, POLL_MS)
        return () => clearInterval(id)
    }, [generateMockData])

    const pipeline = data?.pipeline
    const pieData = pipeline ? [
        { name: 'Completed Deals', value: pipeline.completedDeals },
        { name: 'Ongoing Deals', value: pipeline.ongoingDeals }
    ] : []
    const pct = pipeline ? Math.round((pipeline.completedDeals / pipeline.total) * 100) : 0
    const teamMembers = data?.teamPerformance?.members ?? []
    const topMember = data?.teamPerformance?.topMember ?? ''
    const teamTotal = teamMembers.reduce((s, m) => s + m.sales, 0)
    const teamDeals = teamMembers.reduce((s, m) => s + m.deals, 0)
    const teamAvg = teamMembers.length ? Math.round(teamTotal / teamMembers.length) : 0
    const recentActivities = [
        { id: 1, company: 'Arom Inc', desc: 'Sarah • 2 hours ago', icon: <FiPhone size={14} />, bg: '#fff9c4', color: '#f57f17' },
        { id: 2, company: 'GlobalTech', desc: 'Mike Waterson • 1 day ago', icon: <FiMail size={14} />, bg: '#e8f5e9', color: '#2e7d32' },
        { id: 3, company: 'TechCorp', desc: 'You • 1 day ago', icon: <FiVideo size={14} />, bg: '#e8f5e9', color: '#2e7d32' }
    ]

    return (
        <div className="dashboard">

            <div className="dashboard-topbar">
                <div className="dashboard-user">
                    <div className="dashboard-user-avatar"><FiUser size={20} /></div>
                    <div className="dashboard-user-info">
                        <span className="dashboard-user-name">YOU</span>
                        <span className="dashboard-user-role">PL Supervisor</span>
                    </div>
                </div>
                <div className="dashboard-filters">
                    <select className="dashboard-select" defaultValue="This Month">
                        <option>This Month</option>
                    </select>
                    <select className="dashboard-select" defaultValue="All Team Members">
                        <option>All Team Members</option>
                    </select>
                    <button className="dashboard-reset-btn">Reset Layout</button>
                </div>
            </div>

            <div className="live-banner">
                <span className="live-dot" />
                <span className="live-text">Live · Updated {lastUpdated || clock}</span>
                {error && <span className="live-error"> · {error}</span>}
            </div>

            <div className="kpi-row">
                <KpiCard icon={<FiTrendingUp size={20} />} label="TOTAL SALES" value={data ? fmtMoney(data.totalSales.value) : '—'} change={data?.totalSales.changePercent ?? 0} sub="vs last month" loading={loading} />
                <KpiCard icon={<FiCheckCircle size={20} />} label="DEALS COMPLETED" value={data?.dealsCompleted.value ?? '—'} change={data?.dealsCompleted.changePercent ?? 0} sub="vs last month" loading={loading} />
                <KpiCard icon={<FiClock size={20} />} label="ONGOING DEALS" value={data?.ongoingDeals.value ?? '—'} change={data?.ongoingDeals.changePercent ?? 0} sub="vs last month" loading={loading} />
                <KpiCard icon={<FiDollarSign size={20} />} label="AVG DEAL VALUE" value={data ? fmtMoney(data.avgDealValue.value) : '—'} change={data?.avgDealValue.changePercent ?? 0} sub="vs last month" loading={loading} />
            </div>

            <div className="mid-row">
                <div className="chart-card pipeline-card">
                    <div className="card-header">
                        <div><h3 className="card-title">Sales Pipeline</h3><p className="card-sub">Completed vs ongoing deals</p></div>
                        {pipeline && <span className="total-badge">{pipeline.total} Total</span>}
                    </div>
                    <div className="pipeline-body">
                        <div className="donut-wrap">
                            {loading ? <Skeleton w={200} h={200} /> : (
                                <PieChart width={220} height={220}>
                                    <Pie data={pieData} cx={110} cy={110} innerRadius={68} outerRadius={100} startAngle={90} endAngle={-270} dataKey="value" paddingAngle={3}>
                                        <Cell fill={ACCENT} stroke="none" />
                                        <Cell fill={CHART_GREY} stroke="none" />
                                    </Pie>
                                    <DonutLabel cx={110} cy={110} pct={pct} />
                                </PieChart>
                            )}
                            <div className="donut-legend">
                                <span className="dot" style={{ background: ACCENT }} /><span>Completed Deals</span><strong>{pipeline?.completedDeals ?? '—'}</strong>
                                <span className="dot" style={{ background: CHART_GREY }} /><span>Ongoing Deals</span><strong>{pipeline?.ongoingDeals ?? '—'}</strong>
                            </div>
                        </div>
                        <div className="stage-breakdown">
                            <p className="stage-title">Pipeline Stages</p>
                            {loading ? [1,2,3,4,5].map(i => <Skeleton key={i} h={14} />) : pipeline?.stages.map((s) => (
                                <div key={s.name} className="stage-row">
                                    <span className="stage-name">{s.name}</span>
                                    <span className="stage-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="chart-card trends-card">
                    <div className="card-header">
                        <div><h3 className="card-title">Sales Trends</h3><p className="card-sub">Revenue and deals performance over time</p></div>
                        <div className="chart-toggle">
                            <button className={`toggle-btn ${salesChartType === 'area' ? 'active' : ''}`} onClick={() => setSalesChartType('area')}><FiTrendingUp size={16} /></button>
                            <button className={`toggle-btn ${salesChartType === 'bar' ? 'active' : ''}`} onClick={() => setSalesChartType('bar')}><FiBarChart2 size={16} /></button>
                        </div>
                    </div>
                    {loading ? <Skeleton h={200} /> : salesChartType === 'area' ? (
                        <ResponsiveContainer width="100%" height={220}>
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
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data?.salesTrends ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} width={48} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="sales" name="sales" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="bottom-row">
                <div className="chart-card activity-card">
                    <div className="card-header">
                        <div><h3 className="card-title">Activity Summary</h3><p className="card-sub">All team activities</p></div>
                    </div>
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
                    <div className="recent-activities">
                        <h4 className="recent-activities-title">Recent Activities</h4>
                        <div className="recent-activities-list">
                            {recentActivities.map(act => (
                                <div key={act.id} className="recent-activity-item" style={{ backgroundColor: act.id === 1 ? '#F7E99A' : '#fff' }}>
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

                <div className="chart-card team-card">
                    <div className="card-header">
                        <div><h3 className="card-title">Team Performance</h3><p className="card-sub">Compare team member metrics</p></div>
                        {topMember && <span className="top-badge"><FiAward size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />Top: {topMember}</span>}
                    </div>
                    {loading ? <Skeleton h={160} /> : (
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={teamMembers} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#777' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 10, fill: '#777' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v, n) => n === 'sales' ? fmtMoney(v) : v} />
                                <Bar dataKey="sales" name="Sales" fill={ACCENT} radius={[4,4,0,0]} maxBarSize={30} />
                                <Bar dataKey="deals" name="Deals" fill={CHART_GREEN} radius={[4,4,0,0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
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
                </div>
            </div>
        </div>
    )
}