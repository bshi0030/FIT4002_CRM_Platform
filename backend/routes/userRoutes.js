const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");


router.get("/", requireAuth, async (req, res) => {

    try {

        const users = await User.find()
            .select("_id fullName email role");

        console.log("USERS:", users);

        res.json(users);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch users"
        });

    }

});


module.exports = router;