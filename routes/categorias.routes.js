const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias.controllers')
const { ExisteCategoriaPorid } = require('../helpers/db-validators')
const router = Router()

/** 
 * {{url}}/api/categorias
 */ 

// Obtener todas la categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( ExisteCategoriaPorid ),
    validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar categorias - privado - cualquier token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( ExisteCategoriaPorid ),
    validarCampos
], actualizarCategoria)

// Eliminar categoria - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( ExisteCategoriaPorid ),
    validarCampos
], borrarCategoria)




module.exports = router