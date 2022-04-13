const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos } = require('../middlewares')

const { crearCategoria } = require('../controllers/categorias.controllers')
const router = Router()

/** 
 * {{url}}/api/categorias
 */ 

// Obtener todas la categorias - publico
router.get('/', (req, res) => {
    res.json('GET')
})

// Obtener una categoria por id - publico
router.get('/:id', (req, res) => {
    res.json('GETBYID')
})

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar categorias - privado - cualquier token válido
router.put('/:id', (req, res) => {
    res.json('PUTBYID')
})

// Eliminar categoria - ADMIN
router.delete('/:id', (req, res) => {
    res.json('DELETEBYID')
})




module.exports = router