//Requires
var express = require('express');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

let SEED = "esta-es-una-semilla-para-generar-el-token";



const bodyParser = require('body-parser');

// Incializar variables
var app = express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
  next();
});



// Conexión con la base de datos
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acme'
});

conn.connect();

// Escuchar peticiones
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});



// ENDPOINTS


// Registro Usuario
app.post('/usuarios', (req, res) => {
  const { name, email, img, role} = req.body;
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const sql = `INSERT INTO usuarios (userName, userEmail, userPassword, userImg, userRole)
  VALUES (?, ?, ?, ?, ?)`;

  conn.query(sql, [name, email, hashedPassword, img, role], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente'
    });
  });
});
app.get('/', (req,res, next)=>{
    res.status(200).json({
      ok: true,
      mensaje: 'Petición realizada correctamente'
    });
});

app.post('/login', (req, res) => {
  const { email } = req.body;
  let hashedPassword = bcrypt.hashSync (req.body.password, 10);
  const sql = 'SELECT * FROM usuarios WHERE userEmail = ?';
  conn.query(sql, [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({
        ok:false,
        mensaje: 'Usuario no encontrado'
      });
    } else {
      const user = results [0];
      const passwordMatch = bcrypt.compareSync(req.body.password, user.userPassword);
      if (!passwordMatch) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Contraseña incorrecta'
        });
      }

      const token = jwt.sign({usuario: user}, SEED, {expiresIn: 14400});
      res.status(200).json({
        ok: true,
        mensaje: 'Login exitoso',
        usuario: user,
        token: token
      });
    }
  });
});

app.use(function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split('')[1];
  if (!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no proporcionado'
    });
  }else{
    jwt.verify(token, SEED, (err, decoded)=> {
      if (err) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Token no válido'
        });
      }
      req.usuario = decoded.usuario;
      next();
    });
  }
});

// Recuperar todos los productos
app.get('/productos', (req,res)=>{
  const sql = 'SELECT * FROM productos';
  conn.query(sql,(err, results)=>{
    if (err) throw err;
    res.status(200).json({
      ok:true,
      productos: results
     });
  });
});

// Añadir producto
app.post('/productos', (req, res)=>{
  const {name, code, date, price, description, rate, image} = req.body;
  
  const sql = `INSERT INTO productos 
  (productName, productCode, releaseDate, price, description, starRating, imageUrl) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  conn.query(sql, [name, code, date, parseInt(price), description, rate, image], (err, result)=>{

    if (err) throw err;

    res.status(201).json({
      ok: true,
      mensaje: 'Producto añadido correctamente'
    });
  });
});

// Recuperar producto específico
app.get('/productos/:id', (req, res)=>{
  const {id} = req.params;

  const sql = `SELECT * FROM productos WHERE productId = ?`

  conn.query(sql, [id], (err, result)=>{
    if (err){
      return res.status(500).json({
        ok:false,
        mensaje: 'Producto no encontrado'
      });
    }

    if (result.lenght === 0){
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado'
      });
    }


    res.json({
      ok: true,
      producto: result[0]
    });
  });
});

// Elimina un producto específico de la bdd
app.delete('/productos/:id', (req,res)=>{
  const sql = `DELETE FROM productos WHERE productId = ?`;
  conn.query(sql, [req.params.id], (err, result)=>{
    if (err) throw err;

    res.status(200).json({
      ok: true,
      mensaje: 'Producto eliminado correctamente'
    });
  });
});

// Actualiza un producto específico en la bdd
app.put('/productos/:id', (req,res)=>{
  const { name, code, date, price, description, rate } = req.body;
  const sql = `UPDATE productos SET productName = ?, productCode = ?, releaseDate = ?, price = ?, description = ?, starRating = ? WHERE productId = ?`;
  conn.query(sql, [name, code, date, parseInt(price), description, rate, req.params.id], (err, result)=>{
    if (err) throw err;

    res.status(200).json({
      ok: true,
      mensaje: 'Producto actualizado correctamente'
    });
  });
});

// Sube imagen a la bdd
app.put('/upload/productos/:id', (req,res)=>{
  if (!req.files || Object.keys(req.files).length === 0){
    return res.status(400).json({
      ok: false,
      mensaje: 'No se ha seleccionado ningún archivo'
    });
  }

  const file = req.files.image;
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const allowedExtension = ['png', 'jpg', 'jpeg', 'gif'];

  if (!allowedExtension.includes(fileExtension)){
    return res.status(400).json({
      ok:false,
      mensaje: 'Tipo de extensión no permitido'
    });
  }

  const productId = req.params.id;
  const fileName = `${productId}-${new Date().getMilliseconds()}.${fileExtension}`;
  const uploadPath = __dirname + '/upload/productos/' + fileName;

  console.log(uploadPath);

  file.mv(uploadPath, (err) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al subir el archivo',
              error: err
          });
      }

      const sql = 'UPDATE productos SET imageUrl = ? WHERE productId = ?';
      conn.query(sql, [uploadPath, productId], (err, result) => {
          if (err) throw err;
          res.status(200).json({
              ok: true,
              mensaje: 'Archivo subido y producto actualizado correctamente'
          });
      });
  });
});

const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Login con Google
app.post('/google-login', async (req, res) => {
  const { googletoken } = req.body;
  console.log('Token recibido: ' + googletoken);

  try {
    // 1. Verificamos el token con Google
    const { name, email, picture } = await verifyGoogleToken(googletoken);

    // 2. Buscamos al usuario en la base de datos
    conn.query('SELECT * FROM usuarios WHERE userEmail = ?', [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al consultar la base de datos',
          error: err
        });
      }

      // CASO A: El usuario NO existe -> Lo creamos y luego iniciamos sesión
      if (!results || results.length === 0) {
        console.log('Usuario no encontrado -> creando nuevo usuario');
        
        const datosUsuario = {
          userName: name,
          userEmail: email,
          userImg: picture,
        };

        conn.query('INSERT INTO usuarios SET ?', datosUsuario, (err, result) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al crear el usuario',
              error: err
            });
          }

          // Construimos el objeto de usuario recién creado (incluyendo su nuevo ID)
          const newUser = {
            id: result.insertId,
            ...datosUsuario
          };

          console.log('Generar token para el nuevo usuario');
          const token = jwt.sign({ usuario: newUser }, SEED, { expiresIn: 14400 });

          // Retornamos la respuesta AQUÍ, dentro del callback del INSERT
          return res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado y login exitoso',
            usuario: newUser,
            token: token
          });
        });

      } else {
        // CASO B: El usuario SÍ existe -> Iniciamos sesión directamente
        console.log('Usuario encontrado');
        console.log('Generar token para el usuario existente');
        
        const user = results[0];
        const token = jwt.sign({ usuario: user }, SEED, { expiresIn: 14400 });

        return res.status(200).json({
          ok: true,
          mensaje: 'Login exitoso',
          usuario: user,
          token: token
        });
      }
    });

  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no válido',
      error: error.message || error
    });
  }
});

// Verificar el token de Google
async function verifyGoogleToken(token) {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  
  // 📍 CORREGIDO: El objeto de configuración ahora está correctamente estructurado dentro de los paréntesis
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  console.log(payload);
  
  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };
}

