const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @api {post} /api/auth/register Registrar un nuevo usuario
 * @apiName RegisterUser
 * @apiGroup Autenticación
 * @apiDescription Permite registrar un nuevo usuario en el sistema.  
 * Se debe enviar nombre, email, contraseña y rol del usuario.
 *
 * @apiBody {String} nombre Nombre completo del usuario.
 * @apiBody {String} email Correo electrónico del usuario (único).
 * @apiBody {String} password Contraseña del usuario.
 * @apiBody {String} rol Rol del usuario (por ejemplo: "ADMIN" o "CLIENTE").
 *
 * @apiSuccess (201) {String} message Mensaje de éxito indicando que el usuario fue registrado.
 * @apiSuccess (201) {Object} usuario Información del usuario registrado.
 * @apiSuccess (201) {Number} usuario.id ID único del usuario.
 * @apiSuccess (201) {String} usuario.nombre Nombre del usuario.
 * @apiSuccess (201) {String} usuario.email Email del usuario.
 * @apiSuccess (201) {String} usuario.rol Rol asignado al usuario.
 * @apiSuccess (201) {Date} usuario.createdAt Fecha de creación del registro.
 * @apiSuccess (201) {Date} usuario.updatedAt Fecha de última actualización del registro.
 *
 * @apiError (400) BadRequest El usuario ya existe en la base de datos.
 * @apiError (500) InternalServerError Error al registrar el usuario en la base de datos.
 *
 * @apiExample {curl} Ejemplo de uso:
 *    curl -X POST http://localhost:3000/api/auth/register \
 *    -H "Content-Type: application/json" \
 *    -d '{"nombre": "Juan Pérez", "email": "juan@example.com", "password": "123456", "rol": "user"}'
 *
 * @apiSuccessExample {json} Respuesta Exitosa:
 * {
 *   "message": "Usuario registrado correctamente",
 *   "usuario": {
 *     "id": 1,
 *     "nombre": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "rol": "user",
 *     "createdAt": "2025-10-25T07:00:00.000Z",
 *     "updatedAt": "2025-10-25T07:00:00.000Z"
 *   }
 * }
 */
router.post('/register', authController.register);
/**
 * @api {post} /api/auth/login Iniciar sesión
 * @apiName LoginUser
 * @apiGroup Autenticación
 * @apiDescription Permite a un usuario autenticarse en el sistema usando su email y contraseña.  
 * Si las credenciales son correctas, se devuelve un token JWT para autenticación en futuros requests.
 *
 * @apiBody {String} email Correo electrónico del usuario registrado.
 * @apiBody {String} password Contraseña del usuario.
 *
 * @apiSuccess {String} message Mensaje indicando que el login fue exitoso.
 * @apiSuccess {String} token Token JWT para autenticación en otros endpoints.
 * @apiSuccess {Object} usuario Información del usuario autenticado.
 * @apiSuccess {Number} usuario.id ID único del usuario.
 * @apiSuccess {String} usuario.nombre Nombre del usuario.
 * @apiSuccess {String} usuario.email Email del usuario.
 * @apiSuccess {String} usuario.rol Rol asignado al usuario.
 * @apiSuccess {Date} usuario.createdAt Fecha de creación del registro.
 * @apiSuccess {Date} usuario.updatedAt Fecha de última actualización del registro.
 *
 * @apiError (401) Unauthorized Contraseña incorrecta.
 * @apiError (404) NotFound Usuario no encontrado.
 * @apiError (500) InternalServerError Error al procesar el login.
 *
 * @apiExample {curl} Ejemplo de uso:
 *    curl -X POST http://localhost:3000/api/auth/login \
 *    -H "Content-Type: application/json" \
 *    -d '{"email": "juan@example.com", "password": "123456"}'
 *
 * @apiSuccessExample {json} Respuesta Exitosa:
 * {
 *   "message": "Login exitoso",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "usuario": {
 *     "id": 1,
 *     "nombre": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "rol": "user",
 *     "createdAt": "2025-10-25T07:00:00.000Z",
 *     "updatedAt": "2025-10-25T07:00:00.000Z"
 *   }
 * }
 */
router.post('/login', authController.login);

module.exports = router;
