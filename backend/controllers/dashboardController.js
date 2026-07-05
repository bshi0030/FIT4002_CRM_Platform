const Deal = require('../models/Deal');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Aggregation for Deals
        const dealAgg = await Deal.aggregate([
            {
                $facet: {
                    totals: [
                        { $group: {
                            _id: null,
                            totalSales: { 
                                $sum: { 
                                    $cond: [
                                        { $eq: ["$stage", "Won"] }, 
                                        { $convert: { input: "$price", to: "double", onError: 0, onNull: 0 } }, 
                                        0
                                    ] 
                                } 
                            },
                            dealsCompleted: { $sum: { $cond: [{ $eq: ["$stage", "Won"] }, 1, 0] } },
                            ongoingDeals: { $sum: { $cond: [{ $in: ["$stage", ["Won", "Lost"]] }, 0, 1] } },
                            lostDeals: { $sum: { $cond: [{ $eq: ["$stage", "Lost"] }, 1, 0] } },
                            totalCount: { $sum: 1 }
                        }}
                    ],
                    stages: [
                        { $match: { stage: { $nin: ["Won", "Lost"] } } },
                        { $group: { _id: "$stage", count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const dealTotals = dealAgg[0].totals[0] || { totalSales: 0, dealsCompleted: 0, ongoingDeals: 0, lostDeals: 0, totalCount: 0 };
        const avgDealValue = dealTotals.dealsCompleted > 0 ? (dealTotals.totalSales / dealTotals.dealsCompleted) : 0;
        
        // Ensure standard pipeline stages exist
        const defaultStages = { 'Qualified': 0, 'Contact Made': 0, 'Demo Scheduled': 0, 'Proposal Made': 0, 'Negotiation': 0 };
        dealAgg[0].stages.forEach(s => { defaultStages[s._id] = s.count; });
        const stagesArray = Object.keys(defaultStages).map(k => ({ name: k, count: defaultStages[k] }));

        // 2. Aggregation for Interactions (Summary Counts)
        const interactionStats = await Customer.aggregate([
            { $unwind: "$interactions" },
            { $group: {
                _id: null,
                callsMade: { $sum: { $cond: [{ $eq: [{ $toLower: "$interactions.type" }, "call"] }, 1, 0] } },
                emailsSent: { $sum: { $cond: [{ $eq: [{ $toLower: "$interactions.type" }, "email"] }, 1, 0] } },
                meetingsHeld: { $sum: { $cond: [{ $in: [{ $toLower: "$interactions.type" }, ["meeting", "task"]] }, 1, 0] } }
            }}
        ]);
        const iStats = interactionStats[0] || { callsMade: 0, emailsSent: 0, meetingsHeld: 0 };

        // 3. Aggregation for Recent Activities (Top 3 recent interactions, grouped by Customer)
        const recentInteractions = await Customer.aggregate([
            { $match: { "interactions.0": { $exists: true } } },
            { $unwind: "$interactions" },
            { $sort: { "interactions.date": -1 } },
            { $limit: 3 },
            { $project: {
                _id: "$interactions._id",
                companyName: { $cond: [{ $ifNull: ["$company", false] }, "$company", "$fullName"] },
                createdBy: "$interactions.createdBy",
                latest: "$interactions"
            }}
        ]);

        const timeAgo = (date) => {
            if (!date) return 'Just now';
            const seconds = Math.floor((new Date() - new Date(date)) / 1000);
            let interval = seconds / 31536000;
            if (interval >= 1) return Math.floor(interval) + " years ago";
            interval = seconds / 2592000;
            if (interval >= 1) return Math.floor(interval) + " months ago";
            interval = seconds / 86400;
            if (interval >= 1) {
                const days = Math.floor(interval);
                return days === 1 ? "1 day ago" : days + " days ago";
            }
            interval = seconds / 3600;
            if (interval >= 1) {
                const hrs = Math.floor(interval);
                return hrs === 1 ? "1 hour ago" : hrs + " hours ago";
            }
            interval = seconds / 60;
            if (interval >= 1) {
                const mins = Math.floor(interval);
                return mins === 1 ? "1 minute ago" : mins + " minutes ago";
            }
            return "Just now";
        };

        const recentActivities = recentInteractions.map(inter => {
            let iconType = 'phone';
            let bg = '#eaf6ff';
            let color = '#253984';
            
            const t = inter.latest.type?.toLowerCase() || '';
            if (t === 'email') {
                iconType = 'mail';
                bg = '#e8f5e9';
                color = '#2e7d32';
            } else if (t === 'meeting') {
                iconType = 'video';
                bg = '#fff3e0';
                color = '#e65100';
            } else if (t === 'task') {
                iconType = 'task';
                bg = '#f3e5f5';
                color = '#7b1fa2';
            } else if (t === 'note') {
                iconType = 'note';
                bg = '#fffde7';
                color = '#fbc02d';
            } else if (t === 'file') {
                iconType = 'file';
                bg = '#eceff1';
                color = '#455a64';
            }

            const displayTime = timeAgo(inter.latest.date);
            const author = inter.createdBy ? 'Sales Rep' : 'You';

            return {
                id: inter._id,
                company: inter.companyName || 'Unknown Company',
                desc: `${inter.latest.details || ''} • ${displayTime}`,
                iconType,
                bg,
                color
            };
        });

        const pipeline = {
            total: dealTotals.totalCount,
            completedDeals: dealTotals.dealsCompleted,
            ongoingDeals: dealTotals.ongoingDeals,
            lostDeals: dealTotals.lostDeals,
            stages: stagesArray
        };

        const activitySummary = {
            callsMade: iStats.callsMade,
            callsChange: 0,
            meetingsHeld: iStats.meetingsHeld,
            meetingsChange: 0,
            emailsSent: iStats.emailsSent,
            emailsChange: 0,
            dealsClosed: dealTotals.dealsCompleted,
            dealsChange: 0
        };

        const salesTrends = [
            { week: 'W1', sales: dealTotals.totalSales * 0.15 },
            { week: 'W2', sales: dealTotals.totalSales * 0.25 },
            { week: 'W3', sales: dealTotals.totalSales * 0.20 },
            { week: 'W4', sales: dealTotals.totalSales * 0.40 }
        ];

        const User = require('../models/User');
        const isSupervisor = req.user && ['Admin', 'Supervisor'].includes(req.user.role);
        
        let usersQuery = isSupervisor ? {} : { _id: req.user?._id };
        const users = req.user ? await User.find(usersQuery).select('fullName _id role') : [];

        const dealUserStats = await Deal.aggregate([
            { $match: { stage: "Won" } },
            { $group: {
                _id: "$createdBy",
                sales: { $sum: { $convert: { input: "$price", to: "double", onError: 0, onNull: 0 } } },
                deals: { $sum: 1 }
            }}
        ]);

        const activityUserStats = await Customer.aggregate([
            { $unwind: "$interactions" },
            { $match: { "interactions.createdBy": { $exists: true, $ne: null } } },
            { $group: {
                _id: "$interactions.createdBy",
                activities: { $sum: 1 }
            }}
        ]);

        let members = users.map(u => {
            const dStat = dealUserStats.find(d => d._id?.toString() === u._id.toString()) || { sales: 0, deals: 0 };
            const aStat = activityUserStats.find(a => a._id?.toString() === u._id.toString()) || { activities: 0 };
            return {
                name: (req.user && u._id.toString() === req.user._id.toString()) ? 'You' : u.fullName,
                sales: dStat.sales,
                deals: dStat.deals,
                activities: aStat.activities
            };
        });

        // Sort members by sales descending
        members.sort((a, b) => b.sales - a.sales);

        // Fallback for no users
        if (members.length === 0) {
            members = [{ name: 'You', sales: 0, deals: 0, activities: 0 }];
        }

        const teamPerformance = {
            topMember: members[0].name,
            members: members
        };

        res.json({
            totalSales: { value: dealTotals.totalSales, changePercent: 12.5 },
            dealsCompleted: { value: dealTotals.dealsCompleted, changePercent: 8.2 },
            ongoingDeals: { value: dealTotals.ongoingDeals, changePercent: -2.4 },
            avgDealValue: { value: avgDealValue, changePercent: 5.1 },
            salesTrends,
            pipeline,
            activitySummary,
            recentActivities,
            teamPerformance
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
