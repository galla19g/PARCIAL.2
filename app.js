import express from "express";
import path from "path";
import conexion from "./db/conexion.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar EJS y carpeta pública
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static("public"));

// Mostrar todos los contactos
app.get("/", (req, res) => {
  const sql = `
    SELECT c.*, 
          g.detalle_genero, 
          d.detalle_direccion, 
          t.detalle_tipo_telefono
    FROM contacto c
    LEFT JOIN genero g ON c.id_genero = g.id_genero
    LEFT JOIN direccion d ON c.id_direccion = d.id_direccion
    LEFT JOIN tipo_telefono t ON c.id_tipo_telefono = t.id_tipo_telefono
  `;
  
  conexion.query(sql, (err, contactos) => {
    if (err) throw err;

    // Obtener catálogos para el formulario
    conexion.query("SELECT * FROM genero", (err, generos) => {
      if (err) throw err;
      
      conexion.query("SELECT * FROM direccion", (err, direcciones) => {
        if (err) throw err;
        
        conexion.query("SELECT * FROM tipo_telefono", (err, tipos_telefono) => {
          if (err) throw err;

          // Obtener totales por barrio
          const sqlBarrios = `
            SELECT d.id_direccion, d.detalle_direccion, COUNT(*) as cantidad
            FROM contacto c
            INNER JOIN direccion d ON c.id_direccion = d.id_direccion
            GROUP BY d.id_direccion, d.detalle_direccion
          `;
          
          conexion.query(sqlBarrios, (err, barrios) => {
            if (err) throw err;

            const total = contactos.length;
            barrios.forEach(b => (b.porcentaje = (b.cantidad * 100) / total));
            
            res.render("index", { 
              contactos, 
              barrios,
              generos,
              direcciones,
              tipos_telefono
            });
          });
        });
      });
    });
  });
});

// Agregar contacto
app.post("/agregar", (req, res) => {
  const datos = req.body;
  const sql = `
    INSERT INTO contacto (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    id_genero, id_direccion, id_tipo_telefono, email, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  conexion.query(
    sql,
    [
      datos.primer_nombre, datos.segundo_nombre,
      datos.primer_apellido, datos.segundo_apellido,
      datos.id_genero, datos.id_direccion,
      datos.id_tipo_telefono, datos.email, datos.telefono
    ],
    err => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Eliminar contacto
app.get("/eliminar/:id", (req, res) => {
  conexion.query("DELETE FROM contacto WHERE id_contacto=?", [req.params.id], err => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Cargar contacto a editar
app.get("/editar/:id", (req, res) => {
  conexion.query("SELECT * FROM contacto WHERE id_contacto=?", [req.params.id], (err, filas) => {
    if (err) throw err;
    
    // Obtener catálogos para los selectores
    conexion.query("SELECT * FROM genero", (err, generos) => {
      if (err) throw err;
      
      conexion.query("SELECT * FROM direccion", (err, direcciones) => {
        if (err) throw err;
        
        conexion.query("SELECT * FROM tipo_telefono", (err, tipos_telefono) => {
          if (err) throw err;
          
          res.render("editar", { 
            contacto: filas[0],
            generos,
            direcciones,
            tipos_telefono
          });
        });
      });
    });
  });
});

// Actualizar contacto
app.post("/actualizar/:id", (req, res) => {
  const datos = req.body;

  // Validar dirección existente
  conexion.query(
    "SELECT id_direccion FROM direccion WHERE id_direccion = ?",
    [datos.id_direccion],
    (err, resultadoDireccion) => {
      if (err) {
        console.error("Error SQL:", err);
        return res.status(500).send("Error en el servidor");
      }



      // Validar tipo de teléfono existente
      conexion.query(
        "SELECT id_tipo_telefono FROM tipo_telefono WHERE id_tipo_telefono = ?",
        [datos.id_tipo_telefono],
        (err2, resultadoTelefono) => {
          if (err2) {
            console.error("Error SQL:", err2);
            return res.status(500).send("Error en el servidor");
          }

          // Si todo es válido, hacemos el UPDATE
          const sql = `
            UPDATE contacto SET primer_nombre=?, segundo_nombre=?, primer_apellido=?, segundo_apellido=?,
            id_genero=?, id_direccion=?, id_tipo_telefono=?, email=?, telefono=?
            WHERE id_contacto=?
          `;

          conexion.query(
            sql,
            [
              datos.primer_nombre, datos.segundo_nombre,
              datos.primer_apellido, datos.segundo_apellido,
              datos.id_genero, datos.id_direccion,
              datos.id_tipo_telefono, datos.email, datos.telefono,
              req.params.id
            ],
            (err3) => {
              if (err3) {
                console.error("Error SQL UPDATE:", err3);
                return res.status(500).send("Error al actualizar contacto.");
              }
              res.redirect("/");
            }
          );
        }
      );
    }
  );
});

// Buscar contacto
app.get("/buscar", (req, res) => {
  const busqueda = `%${req.query.q || ""}%`;

  const sqlBusqueda = `
    SELECT c.*, 
          g.detalle_genero, 
          d.detalle_direccion, 
          t.detalle_tipo_telefono
    FROM contacto c
    LEFT JOIN genero g ON c.id_genero = g.id_genero
    LEFT JOIN direccion d ON c.id_direccion = d.id_direccion
    LEFT JOIN tipo_telefono t ON c.id_tipo_telefono = t.id_tipo_telefono
    WHERE LOWER(c.primer_nombre) LIKE LOWER(?) 
    OR LOWER(c.segundo_nombre) LIKE LOWER(?) 
    OR LOWER(c.primer_apellido) LIKE LOWER(?) 
    OR LOWER(c.segundo_apellido) LIKE LOWER(?) 
    OR LOWER(c.email) LIKE LOWER(?) 
    OR LOWER(c.telefono) LIKE LOWER(?)
  `;

  conexion.query(
    sqlBusqueda,
    [busqueda, busqueda, busqueda, busqueda, busqueda, busqueda],
    (err, contactos) => {
      if (err) throw err;

      // Obtener catálogos para el formulario
      conexion.query("SELECT * FROM genero", (err, generos) => {
        if (err) throw err;
        
        conexion.query("SELECT * FROM direccion", (err, direcciones) => {
          if (err) throw err;
          
          conexion.query("SELECT * FROM tipo_telefono", (err, tipos_telefono) => {
            if (err) throw err;

            // 🔹 Si no hay contactos, renderizamos sin barras
            if (contactos.length === 0) {
              return res.render("index", { 
                contactos, 
                barrios: [],
                generos,
                direcciones,
                tipos_telefono
              });
            }

            // Recalcular porcentajes según el total filtrado
            const sqlBarrios = `
              SELECT d.id_direccion, d.detalle_direccion, COUNT(*) as cantidad
              FROM contacto c
              INNER JOIN direccion d ON c.id_direccion = d.id_direccion
              WHERE LOWER(c.primer_nombre) LIKE LOWER(?) 
              OR LOWER(c.segundo_nombre) LIKE LOWER(?) 
              OR LOWER(c.primer_apellido) LIKE LOWER(?) 
              OR LOWER(c.segundo_apellido) LIKE LOWER(?) 
              OR LOWER(c.email) LIKE LOWER(?) 
              OR LOWER(c.telefono) LIKE LOWER(?)
              GROUP BY d.id_direccion, d.detalle_direccion
            `;

            conexion.query(
              sqlBarrios,
              [busqueda, busqueda, busqueda, busqueda, busqueda, busqueda],
              (err2, barrios) => {
                if (err2) throw err2;

                const total = contactos.length;
                barrios.forEach(b => (b.porcentaje = (b.cantidad * 100) / total));
                
                res.render("index", { 
                  contactos, 
                  barrios,
                  generos,
                  direcciones,
                  tipos_telefono
                });
              }
            );
          });
        });
      });
    }
  );
});

app.listen(3000, () => console.log("✅ Servidor corriendo en http://localhost:3000"));