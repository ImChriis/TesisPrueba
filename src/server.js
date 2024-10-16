const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('./dbConfig');

const app = express();
app.use(express.json());

const JWT_SECRET = '123456'; // Cambia esto por algo más seguro

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correo, fechaNacimiento, rol, password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('correo', sql.VarChar, correo)
      .input('fechaNacimiento', sql.Date, fechaNacimiento)
      .input('rol', sql.Int, rol)
      .input('password', sql.VarChar, hashedPassword) // Guardar contraseña encriptada
      .query('INSERT INTO Persona (Nombre, Apellido, Correo, FechaNacimiento, Rol, Password) VALUES (@nombre, @apellido, @correo, @fechaNacimiento, @rol, @password)');
    
    res.status(201).send('Usuario registrado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Persona WHERE Correo = @correo');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).send('Correo o contraseña incorrectos');
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Correo o contraseña incorrectos');
    }

    // Crear un token JWT
    const token = jwt.sign(
      { id: user.Id, correo: user.Correo, rol: user.Rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
  });
  
