# Prueba BRM
Breve descripción de qué hace el software y para qué sirve.
## Instalación

1. Clonar el repositorio:
   ```bash
   https://github.com/JoaquinCardenasjj/PruebaBrm.git
   cd api_inventario
   npm install
   # o yarn install
# crear un archivo .env con
DB_NAME=db_prueba_brm
DB_USER=root
DB_PASS=SuPassword
DB_HOST=localhost
JWT_SECRET=clave_secreta

### 3. **Uso**
```markdown
## Uso

1. Levantar el servidor:
   ```bash
   npm start
http://localhost:3000/docs
Endpoints principales:

POST /api/auth/register → registrar usuario

POST /api/auth/login → login

GET /api/orders → obtener todas las órdenes (solo admin)

GET /api/orders/:id → obtener orden por ID


### 4. **Tecnologías utilizadas**
```markdown
## Tecnologías
- Node.js
- Express
- Sequelize
- JWT
- bcrypt
- MySQL / PostgreSQL (según tu configuración)

## Licencia
MIT License


