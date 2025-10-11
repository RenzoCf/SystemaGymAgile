const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Plan = require("../models/Plan");

// Traer todos los usuarios (nuevo endpoint)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "nombre_completo", "username", "email", "is_admin"], // campos que quieres mostrar
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cargar usuarios" });
  }
});

// Endpoint existente
router.get("/:id/plans", async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: Plan });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user.Plans);
});

module.exports = router;
