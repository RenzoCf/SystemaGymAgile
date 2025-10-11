const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");

router.get("/", async (req, res) => {
  const plans = await Plan.findAll();
  res.json(plans);
});

router.post("/", async (req, res) => {
  const { name, price, description, duration } = req.body;
  const plan = await Plan.create({ name, price, description, duration });
  res.json(plan);
});

module.exports = router;
