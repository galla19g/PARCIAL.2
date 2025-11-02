const express = require("express");
const router = express.Router();
const conexion = require("../db");

// Mostrar todos los contactos
router.get("/", (req, res) => {
  conexion.query("SELECT * FROM contacto", (err, resultados) => {
    if (err) throw err;
    res.render("index", { contactos: resultados });
  });
});


router.post("/agregar", (req, res) => {
  const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_genero, id_direccion, id_tipo_telefono, email, telefono } = req.body;
  const nuevo = { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_genero, id_direccion, id_tipo_telefono, email, telefono };

  conexion.query("INSERT INTO contacto SET ?", nuevo, (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Editar contacto (mostrar formulario)
router.get("/editar/:id", (req, res) => {
  const id = req.params.id;
  conexion.query("SELECT * FROM contacto WHERE id_contacto = ?", [id], (err, resultados) => {
    if (err) throw err;
    res.render("editar", { contacto: resultados[0] });
  });
});

// Actualizar contacto
router.post("/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_genero, id_direccion, id_tipo_telefono, email, telefono } = req.body;
  const actualizado = { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_genero, id_direccion, id_tipo_telefono, email, telefono };

  conexion.query("UPDATE contacto SET ? WHERE id_contacto = ?", [actualizado, id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Eliminar contacto
router.get("/eliminar/:id", (req, res) => {
  const id = req.params.id;
  conexion.query("DELETE FROM contacto WHERE id_contacto = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

router.post("/buscar", (req, res) => {
  const buscar = `%${req.body.buscar}%`;
  conexion.query(
    "SELECT * FROM contacto WHERE primer_nombre LIKE ? OR primer_apellido LIKE ? OR email LIKE ?",
    [buscar, buscar, buscar],
    (err, resultados) => {
      if (err) throw err;
      res.render("index", { contactos: resultados });
    }
  );
});

module.exports = router;
