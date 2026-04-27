//Requires
var express = require('express');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var cors = require('cors');


const bodyParser = require('body-parser');

// Incializar variables
var app = express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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
app.get('/', (req,res, next)=>{
    res.status(200).json({
      ok: true,
      mensaje: 'Petición realizada correctamente'
    });
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

