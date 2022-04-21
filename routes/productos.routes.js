const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos.controllers')
const { ExisteCategoriaPorid, ExisteProductoPorid } = require('../helpers/db-validators')
const router = Router()

/** 
 * {{url}}/api/categorias
 */ 

// Obtener todas la categorias - publico
router.get('/', obtenerProductos)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( ExisteProductoPorid ),
    validarCampos
], obtenerProducto)

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('categoria').custom( ExisteCategoriaPorid ),
    validarCampos
], crearProducto)

// Actualizar categorias - privado - cualquier token válido
router.put('/:id', [
    validarJWT,
    /* check('id', 'No es un ID valido').isMongoId(), */
    check('id').custom( ExisteProductoPorid ),
    validarCampos
], actualizarProducto)

// Eliminar categoria - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( ExisteProductoPorid ),
    validarCampos
], borrarProducto)




module.exports = router