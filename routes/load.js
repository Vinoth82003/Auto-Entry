// routes/load.js
const express = require("express");
const Driver = require("../models/Driver");

const router = express.Router();

router.post("/in-scan", async (req, res) => {
  try {
    const { driverId } = req.body;
    const driver = await Driver.findById(driverId);

    // Check if loads array is empty or if the last load entry is complete
    if (
      driver.loads.length === 0 ||
      (driver.loads[driver.loads.length - 1].in === true &&
        driver.loads[driver.loads.length - 1].out === true)
    ) {
      // Add a new load entry
      driver.loads.push({ in: true, out: false });
      await driver.save();
      res.json({ success: true, message: driver });
    } else {
      // Last load entry is not complete, return existing driver info
      res.json({
        success: true,
        message: driver,
      });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.post("/out-scan", async (req, res) => {
  try {
    const { driverId } = req.body;
    const driver = await Driver.findById(driverId);
    const lastLoad = driver.loads[driver.loads.length - 1];

    if (lastLoad && lastLoad.in && !lastLoad.out) {
      lastLoad.out = true;
      driver.totalLoad++;
    }

    await driver.save();
    res.json({ success: true, message: driver });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

module.exports = router;
