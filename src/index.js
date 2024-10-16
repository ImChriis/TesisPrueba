const express = require('express');
const app = express();
const { poolPromise, sql } = require('./dbConfig');

app.use(express.json());

// Obtener todas las personas
app.get('/personas', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Personas');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Crear una persona
app.post('/personas', async (req, res) => {
  try {
    const { nombre, apellido, correo, fechaNacimiento, rol, password } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('fechaNacimiento', sql.Date, fechaNacimiento)
      .input('rol', sql.NVarChar, rol)
      .input('password', sql.NVarChar, password)
      .query('INSERT INTO Personas (Nombre, Apellido, Correo, FechaNacimiento, Rol, Password) VALUES (@nombre, @apellido, @correo, @fechaNacimiento, @rol, @password)');
    res.status(201).send('Persona creada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Actualizar una persona
app.put('/personas/:id', async (req, res) => {
  try {
    const { nombre, apellido, correo, fechaNacimiento, rol, password } = req.body;
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('fechaNacimiento', sql.Date, fechaNacimiento)
      .input('rol', sql.NVarChar, rol)
      .input('password', sql.NVarChar, password)
      .query('UPDATE Personas SET Nombre = @nombre, Apellido = @apellido, Correo = @correo, FechaNacimiento = @fechaNacimiento, Rol = @rol, Password = @password WHERE Id = @id');
    res.send('Persona actualizada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Eliminar una persona
app.delete('/personas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Personas WHERE Id = @id');
    res.send('Persona eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
