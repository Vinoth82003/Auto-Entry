// utils/qrcode.js
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const generateQRCode = async (driverId) => {
  const url = `${driverId}`;
  const filePath = path.join(__dirname, "../public/qrcodes", `${driverId}.png`);

  await QRCode.toFile(filePath, url);
  return `/qrcodes/${driverId}.png`;
};

module.exports = generateQRCode;
