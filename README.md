# 🛒 Tienda App - Backend (.NET 7 + Dapper + PostgreSQL) & Frontend (Next.js + TypeScript)

Este proyecto consiste en una API RESTful desarrollada en **.NET 7** usando **Dapper** como ORM y **PostgreSQL** como base de datos, junto con un frontend en **Next.js con TypeScript**.

## 📦 Requisitos

- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js (versión 18 o superior)](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) o NPM
- Herramienta para hacer peticiones HTTP: [Thunder Client](https://www.thunderclient.com/), Postman o cURL


## ⚙️ Backend - Configuración y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/SilviaJaimes/Prueba-tecnica.git
cd Prueba-tecnica/JwtAuthApi
```

### 2. Crear la base de datos y las tablas

Conéctate a tu servidor de PostgreSQL y ejecuta el siguiente script SQL (puedes usar PgAdmin, DBeaver o `psql` en consola):

```sql
-- Crear base de datos (solo si no existe)
CREATE DATABASE tienda_db;

-- Conectarse a la base de datos
\c tienda_db;

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Usuario de prueba
INSERT INTO users (email, password)
VALUES ('admin@tienda.com', '1234');

-- Tabla de categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Tabla de proveedores
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT
);

-- Tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT REFERENCES categories(id),
    supplier_id INT REFERENCES suppliers(id)
);

-- Tabla de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configurar conexión a PostgreSQL

Edita el archivo `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=tienda_db;Username=postgres;Password=123456789"
  }
}
```

### 4. Ejecutar el proyecto

```bash
dotnet run
```

El backend correrá en: [http://localhost:5067](http://localhost:5067)

## 📘 Probar la API con Swagger

### 🔗 Acceso a Swagger
Una vez el backend esté corriendo, abre tu navegador y accede a:

```http://localhost:5067/swagger```

Prueba el endpoint de **Auth**, luego la respuesta del token la pones en el Bearer como: Bearer {token}  
**Ejemplo:** ```Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJo```

Finalmente podrás probar todos los endpoints.

## 🧪 Pruebas con Thunder Client / Postman

### 🔐 Autenticación

**Ruta:** `POST /api/auth/login`  
**Body (JSON):**
```json
{
  "email": "admin@tienda.com",
  "password": "1234"
}
```

📌 **Importante:** Guarda el token JWT que devuelve este endpoint y úsalo como Bearer Token en las demás peticiones.


## 📁 Endpoints de la API

> ⚠️ Todos los endpoints protegidos requieren el token JWT en los headers:  
> `Authorization: Bearer <token>`

### 📂 Categorías

*ruta:* `http://localhost:5067/api/categories`  
*método:* GET

*ruta:* `http://localhost:5067/api/categories/{id}`  
*método:* GET

*ruta:* `http://localhost:5067/api/categories`  
*body:* 
```
{  
  "name": "Tecnología"
}
```
*método:* POST

*ruta:* `http://localhost:5067/api/categories/{id}`  
*body:* 
```
{  
  "name": "Gastronomía"  
}
```  
*método:* PUT

*ruta:* `http://localhost:5067/api/categories/{id}`  
*método:* DELETE


### 🚚 Proveedores
*ruta:* `http://localhost:5067/api/suppliers`  
*método:* GET

*ruta:* `http://localhost:5067/api/suppliers/{id}`  
*método:* GET

*ruta:* `http://localhost:5067/api/suppliers`  
*body:* 
```
{
  "name": "Proveedor S.A.",
  "contact": "proveedor@correo.com"
}
```
*método:* POST

*ruta:* `http://localhost:5067/api/suppliers/{id}`
*body:* 
```
{
  "name": "Distribuidora Global",
  "contact": "contacto@global.com"
}
```  
*método:* PUT

*ruta:* `http://localhost:5067/api/suppliers/{id}`  
*método:* DELETE

### 🛍️ Productos
*ruta:* `http://localhost:5067/api/products`  
*método:* GET

*ruta:* `http://localhost:5067/api/products/{id}`  
*método:* GET

*ruta:* `http://localhost:5067/api/products`  
*body:* 
```
{
  "name": "Laptop Lenovo",
  "description": "i7, 16GB RAM, 512 SSD",
  "price": 4500.00,
  "categoryId": 1,
  "supplierId": 1
}
```  
*método:* POST

*ruta:* `http://localhost:5067/api/products/{id}`  
*body:* 
```
{
  "name": "Smartphone Samsung",
  "description": "Galaxy S22, 128GB",
  "price": 3500.00,
  "categoryId": 1,
  "supplierId": 2
}
```  
*método:* PUT

*ruta:* `http://localhost:5067/api/products/{id}`  
*método:* DELETE

### 📦 Órdenes
*ruta:* `http://localhost:5067/api/orders`  
*método:* GET

*ruta:* `http://localhost:5067/api/orders/{id}`  
*método:* GET

*ruta:* `http://localhost:5067/api/orders`  
*body:* 
```
{
  "productId": 1,
  "quantity": 3,
  "totalPrice": 13500.00
}
```  
*método:* POST

*ruta:* `http://localhost:5067/api/orders/{id}`  
*body:* ```{
  "productId": 3,
  "quantity": 5,
  "totalPrice": 17500.00
}```  
*método:* PUT

*ruta:* `http://localhost:5067/api/orders/{id}`  
*método:* DELETE

## 🧑‍💻 Frontend - Next.js + TypeScript

> El frontend se encuentra en la carpeta `/frontend` y debe estar ejecutándose por separado.

### 1. Instalar dependencias

```bash
cd frontend
yarn install
```

### 2. Ejecutar en modo desarrollo

```bash
yarn dev
```

Esto abrirá la app en: [http://localhost:3000](http://localhost:3000)

## ✅ Estado del Proyecto

- ✅ CRUD completo: Categorías, Proveedores, Productos, Órdenes
- ✅ Autenticación con JWT
- ✅ Seguridad con middleware de autorización
- ✅ Backend en .NET 7 con Dapper
- ✅ Frontend en Next.js (TS)
- 🛠️ Próximas mejoras: Paginación, filtros, manejo de errores detallado
