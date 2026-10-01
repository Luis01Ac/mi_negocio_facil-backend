# MiNegocio Fácil — Backend

API REST desarrollada con **Node.js y Express** para el sistema móvil **MiNegocio Fácil**.

El backend proporciona los servicios necesarios para que la aplicación Flutter pueda gestionar usuarios, productos, ventas y reportes, utilizando **PostgreSQL** como base de datos.

## Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* PostgreSQL Driver (`pg`)
* JSON Web Token (JWT)
* bcryptjs
* dotenv

## Arquitectura

El backend funciona como intermediario entre la aplicación móvil y la base de datos:

```text
┌─────────────────────┐
│   Aplicación móvil  │
│       Flutter       │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│       API REST      │
│   Node.js/Express   │
└──────────┬──────────┘
           │
           │ SQL
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      mi_negocio     │
│        _facil       │
└─────────────────────┘
```

## Funcionalidades

### Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Encriptación de contraseñas mediante bcrypt.
* Generación de tokens JWT.
* Protección de rutas mediante middleware de autenticación.

### Productos

La API permite realizar:

* Listado de productos.
* Creación de productos.
* Actualización de productos.
* Eliminación de productos.

Cada producto contiene:

* Nombre.
* Descripción.
* Precio.
* Stock.
* Fecha de creación.

### Ventas

La API permite:

* Registrar ventas.
* Validar productos.
* Validar cantidades.
* Verificar stock disponible.
* Calcular el total.
* Registrar los detalles de la venta.
* Descontar automáticamente el stock.

Las operaciones de venta utilizan transacciones de PostgreSQL para mantener la consistencia de los datos.

### Reportes

La API proporciona información sobre:

* Ventas realizadas.
* Total de cada venta.
* Usuario que realizó la venta.
* Cantidad de detalles asociados.

## Endpoints principales

### Autenticación

```text
POST /api/auth/registro
POST /api/auth/login
```

### Productos

```text
GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
```

### Ventas

```text
POST /api/ventas
```

### Reportes

```text
GET /api/reportes/ventas
```

### Prueba de conexión con PostgreSQL

```text
GET /api/prueba-db
```

## Autenticación

Las rutas protegidas utilizan un token JWT mediante el encabezado:

```text
Authorization: Bearer <token>
```

El token se genera al iniciar sesión correctamente y permite acceder a los recursos protegidos de la API.

## Base de datos

El proyecto utiliza PostgreSQL.

La base de datos contiene las siguientes tablas principales:

```text
usuarios
productos
ventas
detalle_ventas
```

Las relaciones permiten asociar usuarios con ventas y ventas con sus respectivos productos.

## Configuración

Las credenciales de PostgreSQL y el secreto utilizado para JWT se almacenan mediante variables de entorno.

Ejemplo de variables necesarias:

```text
DB_USER=usuario_postgresql
DB_HOST=localhost
DB_NAME=mi_negocio_facil
DB_PASSWORD=tu_contraseña
DB_PORT=5432
JWT_SECRET=tu_secreto
```

**No se deben publicar valores reales de estas variables.**

El archivo `.env` está excluido del repositorio mediante `.gitignore`.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Luis01Ac/mi_negocio_facil-backend.git
```

Entrar en la carpeta:

```bash
cd mi_negocio_facil-backend
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` con las variables de entorno correspondientes.

Después ejecutar:

```bash
npm start
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

## Integración con Flutter

La aplicación Flutter utiliza la API mediante:

```text
http://10.0.2.2:3000/api
```

Esta dirección permite que el emulador Android se comunique con el servidor Node.js que se ejecuta en el equipo local.

## Estructura principal

```text
backend/
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── productos.js
│   ├── reportes.js
│   └── ventas.js
├── db.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### `server.js`

Configura Express, registra las rutas de la API y pone en funcionamiento el servidor.

### `db.js`

Configura la conexión con PostgreSQL utilizando variables de entorno.

### `middleware/auth.js`

Verifica los tokens JWT para proteger los endpoints que requieren autenticación.

### `routes/auth.js`

Gestiona el registro y el inicio de sesión de los usuarios.

### `routes/productos.js`

Gestiona las operaciones CRUD de productos.

### `routes/ventas.js`

Gestiona el registro de ventas, el cálculo de totales y la actualización del stock.

### `routes/reportes.js`

Proporciona información para los reportes de ventas.

## Seguridad

El proyecto utiliza:

* Contraseñas almacenadas mediante hash con bcrypt.
* Autenticación mediante JWT.
* Middleware para proteger rutas.
* Variables de entorno para información sensible.
* `.gitignore` para evitar publicar el archivo `.env`.

## Estado del proyecto

Backend funcional y probado para el proyecto académico **MiNegocio Fácil**.

Incluye:

* API REST
* PostgreSQL
* Registro de usuarios
* Login
* JWT
* CRUD de productos
* Registro de ventas
* Control de stock
* Reportes
* Validaciones
* Transacciones de base de datos
* Integración con Flutter

## Autor

**MiNegocio Fácil**.
