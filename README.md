[README.md](https://github.com/user-attachments/files/29533606/README.md)
# ACME Final - Full Stack Application

Aplicacion Angular + Express + MySQL con dashboard de graficos, autenticacion Google, y envio de correos.

## Estructura del proyecto

```
app-standalone/
├── BACKEND-SERVER/          # Backend Express + MySQL
│   ├── app.js               # Punto de entrada del servidor
│   ├── package.json
│   ├── .env.dev             # Variables de entorno
│   ├── Dockerfile
│   ├── sql/init.sql         # Schema + datos iniciales
│   └── upload/productos/    # Imagenes subidas
├── app-standalone/           # Frontend Angular
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .env                     # Variables para Docker
```

## Requisitos

- Node.js 20+
- npm
- MySQL 8.0
- Angular CLI 21 (opcional, para desarrollo)
- Docker + Docker Compose (opcional)


( ¡¡¡ PRIMERO SE EXPLICA LA MANERA MANUAL, ABAJO ESTA LA OPCIÓN DE DOCKER !!! )

## 1. Configurar la base de datos

Crea una base de datos MySQL llamada `acme` y ejecuta el script:

```
mysql -u root -p < BACKEND-SERVER/sql/init.sql
```

Esto crea las tablas `usuarios` y `productos` e inserta 5 productos de ejemplo.

## 2. Configurar variables de entorno

Edita `BACKEND-SERVER/.env.dev`:

```env
DBHOST=localhost
DBPORT=3306
DBUSER=root
DBPASSWORD=
DBNAME=acme
GOOGLE_CLIENT_ID=506988236809-2mt2cge7pbr8tlei1efaqacto8gkrvaj.apps.googleusercontent.com
EMAIL_USER=tu_correo@gmail.com
EMAIL_APP_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=destinatario@ejemplo.com
```

### Como obtener EMAIL_APP_PASS

1. Activa verificacion en dos pasos en tu Gmail
2. Ve a Seguridad > Contrasenas de aplicaciones
3. Genera una para "Correo" y copia los 16 caracteres

## 3. Ejecutar el backend

```bash
cd BACKEND-SERVER
npm install
npm start
```

El servidor inicia en `http://localhost:3000`.

## 4. Ejecutar el frontend

```bash
cd app-standalone
npm install
ng serve -o
```

La aplicacion abre en `http://localhost:4200`.

## 5. Ejecutar con Docker (alternativa)

```bash
docker compose up --build
```

Esto levanta tres contenedores:
- `acme-mysql` - MySQL 8.0 en puerto 3307
- `acme-backend` - Express en puerto 3000
- `acme-frontend` - Nginx sirviendo Angular en puerto 80

## Funcionalidades

### Autenticacion
- Login con email y contrasena
- Login con Google
- Recuperacion de contrasena via email

### Dashboard (NGX-Charts)
- `/dashboards` - Graficos de ventas semanales
- Barras verticales, torta, torta avanzado
- Barras horizontal con top 5 productos desde la BD

### Productos (CRUD)
- `/products` - Administrar productos
- Listado, creacion, edicion, eliminacion
- Subida de imagenes

### Mapas
- `/maps` - Google Maps con marcadores

### Usuarios
- `/users` - Lista con scroll virtual

## API endpoints

### Publicos (sin token)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/usuarios` | Registrar usuario |
| POST | `/login` | Login email/password |
| POST | `/google-login` | Login con Google |
| POST | `/email-test` | Enviar correo de prueba |
| POST | `/forgot-password` | Solicitar recuperacion |
| POST | `/reset-password` | Restablecer contrasena |

### Protegidos (requieren JWT)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/productos` | Listar productos |
| POST | `/productos` | Crear producto |
| GET | `/productos/:id` | Obtener producto |
| PUT | `/productos/:id` | Actualizar producto |
| DELETE | `/productos/:id` | Eliminar producto |
| PUT | `/upload/productos/:id` | Subir imagen |
