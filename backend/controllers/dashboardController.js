const Deal = require('../models/Deal');
const Interaction = require('../models/Interaction');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        // Aggregate deals
        const deals = await Deal.find({});
        
        let totalSales = 0;
        let dealsCompleted = 0;
        let ongoingDealsCount = 0;
        let lostDealsCount = 0;
        
        const pipelineStages = {
            'Qualified': 0,
            'Contact Made': 0,
            'Demo Scheduled': 0,
            'Proposal Made': 0,
            'Negotiation': 0
        };

        deals.forEach(deal => {
            const price = parseFloat(deal.price) || 0;
            if (deal.stage === 'Won') {
                totalSales += price;
                dealsCompleted++;
            } else if (deal.stage === 'Lost') {
                lostDealsCount++;
            } else {
                ongoingDealsCount++;
                if (pipelineStages[deal.stage] !== undefined) {
                    pipelineStages[deal.stage]++;
                }
            }
        });

        const avgDealValue = dealsCompleted > 0 ? (totalSales / dealsCompleted) : 0;

        // Aggregate interactions
        const interactions = await Interaction.find({});
        let callsMade = 0;
        let emailsSent = 0;
        let meetingsHeld = 0; 

        interactions.forEach(inter => {
            if (inter.type === 'Call') callsMade++;
            if (inter.type === 'Email') emailsSent++;
            if (inter.type === 'Meeting' || inter.type === 'Task') meetingsHeld++;
        });

        const pipeline = {
            total: deals.length,
            completedDeals: dealsCompleted,
            ongoingDeals: ongoingDealsCount,
            lostDeals: lostDealsCount,
            stages: Object.keys(pipelineStages).map(key => ({
                name: key,
                count: pipelineStages[key]
            }))
        };

        const activitySummary = {
            callsMade,
            callsChange: 0, // Mocked change percentage for now
            meetingsHeld,
            meetingsChange: 0,
            emailsSent,
            emailsChange: 0,
            dealsClosed: dealsCompleted,
            dealsChange: 0
        };

        // Static sales trends distributed across weeks to give visual context
        const salesTrends = [
            { week: 'W1', sales: totalSales * 0.15 },
            { week: 'W2', sales: totalSales * 0.25 },
            { week: 'W3', sales: totalSales * 0.20 },
            { week: 'W4', sales: totalSales * 0.40 }
        ];

        // Mock team performance for now
        const teamPerformance = {
            topMember: 'Sarah J.',
            members: [
                { name: 'You', sales: totalSales * 0.3, deals: dealsCompleted, activities: callsMade + emailsSent },
                { name: 'Sarah J.', sales: 83000, deals: 27, activities: 176 },
                { name: 'Mike C.', sales: 63000, deals: 22, activities: 140 },
                { name: 'Emma D.', sales: 73000, deals: 26, activities: 165 },
                { name: 'James W.', sales: 57000, deals: 20, activities: 125 }
            ]
        };

        res.json({
            totalSales: { value: totalSales, changePercent: 12.5 },
            dealsCompleted: { value: dealsCompleted, changePercent: 8.2 },
            ongoingDeals: { value: ongoingDealsCount, changePercent: -2.4 },
            avgDealValue: { value: avgDealValue, changePercent: 5.1 },
            salesTrends,
            pipeline,
            activitySummary,
            teamPerformance
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
