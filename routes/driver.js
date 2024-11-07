// routes/driver.js
const express = require("express");
const Driver = require("../models/Driver");
const generateQRCode = require("../utils/qrcode");
const { json } = require("body-parser");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, vehicle, noplate } = req.body;
  const driver = new Driver({ name, phone, vehicle, noplate });
  await driver.save();

  // Generate QR code for the driver
  driver.qrLink = await generateQRCode(driver._id);
  await driver.save();

  res.json({ success: true, driver });
});

router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch drivers" });
  }
});

router.post("/update", async (req, res) => {
  const { driverId, name, phone, vehicle, noplate, totalLoad } = req.body;
  const driver = await Driver.findById(driverId);
  driver.name = name;
  driver.phone = phone;
  driver.vehicle = vehicle;
  driver.noplate = noplate;
  driver.totalLoad = totalLoad;

  const newDriver = await driver.save();

  res.json({ success: true, message: newDriver });
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const driver = await Driver.findById(req.params.id);
  res.json({ success: true, message: driver });
});

router.delete("/:id", async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.get("/view/:id", async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>View | ${driver.name}</title>
          <link rel="stylesheet" href="../../../css/view.css" />
        </head>
        <body>
          <div class="main-box">
            <nav class="nav-bar">
              <div class="brand">
                <h2>Auto-Load entry System</h2>
              </div>
              <a href="../../../" class="button home-btn">Home</a>
            </nav>
            <main class="view-driver">
              <div class="simple-card">
                <div class="top">
                  <div class="left-side">
                    <img src="../../../${driver.qrLink}" alt="${driver.name}" />
                  </div>
                  <div class="right-side">
                    <div class="list">
                      <div class="list-title">
                        <strong>Name : </strong>  ${driver.name}
                      </div>
                      <div class="inner-split">
                        <div class="list-title">
                            <strong>Phone Number : </strong>  ${driver.phone}
                        </div>
                        <div class="list-title"><strong>Total Load : </strong>  ${
                          driver.totalLoad
                        }</div>
                      </div>
                      <div class="inner-split">
                      <div class="list-title"><strong>Number Plate : </strong>  ${
                        driver.noplate
                      }</div>
                        <div class="list-title">
                          <strong>Vehicle : </strong> ${driver.vehicle}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bot">
                  <ul class="list-details">
                    
                  </ul>
                </div>
              </div>
            </main>
          </div>
          <script>
            let driverDetails = ${JSON.stringify(driver.loads)}
          </script>
          <script src="../../../js/view.js"></script>
        </body>
      </html>
  `);
});

module.exports = router;
