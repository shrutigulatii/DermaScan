const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { result } = req.body;

  if (!result) {
    return res.status(400).json({ msg: "No result provided" });
  }

  if (result.toLowerCase().includes("malignant")) {
    return res.json({
      advice: "⚠️ Malignant case detected. Consult a dermatologist urgently.",
    });
  } else {
    return res.json({
      advice: "✅ Benign case. Maintain skin hygiene and apply sunscreen daily.",
    });
  }
});

module.exports = router;
