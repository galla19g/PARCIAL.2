import mysql from "mysql2";

const conexion = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "contactos",
  port: 3306
});

conexion.connect(err => {
  if (err) {
    console.error(" Error al conectar a MySQL:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

export default conexion;
