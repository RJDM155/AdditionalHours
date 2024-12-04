const express = require('express');
const pool = require('./db');  
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

// Ruta de login
app.get('/', (req, res) => {
    res.render('login');  
});

// Ruta para el formulario de empleados
app.post('/form', async (req, res) => {
    const { username, email, hoursWorked, payRate, created_at } = req.body;

    console.log('Datos del formulario:', { username, email, hoursWorked, payRate, created_at });

    if (!username || !email || !hoursWorked || !payRate || !created_at ) {
        return res.status(400).json({ error: 'Llena todos los campos' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO data_form (username, email, hours_worked, pay_rate, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, email, hoursWorked, payRate, created_at]
        );

        console.log('Empleado registrado:', result.rows[0]);
        res.redirect('/form');
    } catch (err) {
        console.error('Error al registrar el empleado:', err);
        res.status(500).json({ error: 'Error al registrar el empleado', details: err.message });
    }
});

// Ruta para el login del administrador
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.render('login', { errorMessage: 'Email y contraseña son obligatorios' });
    }
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.render('login', { errorMessage: 'Administrador no encontrado' });
        }
        if (password !== result.rows[0].password) {
            return res.render('login', { errorMessage: 'Contraseña incorrecta' });
        }
        res.redirect('/home');
    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ error: 'Error en el login', details: err.message });
    }
});

app.get('/hours', async (req, res) => {
    try {
        // Obtener todos los empleados desde la base de datos ordenados por ID
        const result = await pool.query('SELECT * FROM data_form ORDER BY id ASC');
        console.log('Datos obtenidos de la base de datos:', result.rows); // Asegúrate de que esto imprime los datos

        // Pasar los datos a la vista 'hours'
        res.render('hours', { employees: result.rows });
    } catch (err) {
        console.error('Error al obtener los empleados:', err);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
});


app.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, hoursWorked, payRate } = req.body;

    try {
        await pool.query(
            'UPDATE data_form SET username = $1, email = $2, hours_worked = $3, pay_rate = $4 WHERE id = $5',
            [username, email, hoursWorked, payRate, id]
        );
        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Error updating employee' });
    }
});

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM data_form WHERE id = $1', [id]);
        res.status(200).json({ message: 'Empleado eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar empleado:', err);
        res.status(500).json({ error: 'Error al eliminar empleado' });
    }
});


app.get('/home', (req, res) => {
    res.render('home');  
});

app.get('/form', (req, res) => {
    res.render('form');  
});

app.get('/guide1', (req, res) => {
    res.render('guide1');  
});

app.get('/guide2', (req, res) => {
    res.render('guide2');  
});

app.get('/about', (req, res) => {
    res.render('about');  
});

app.listen(3000, () => {
    console.log('Conectado al servidor correctamente :)');
});
