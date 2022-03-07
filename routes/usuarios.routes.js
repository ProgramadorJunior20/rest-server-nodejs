const { Router } = require('express')
const { check } = require('express-validator')
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios.controllers')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

router.get('/', usuariosGet)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que tener 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(), 
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), 
    validarCampos
], usuariosPost)

router.put('/:id', usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/', usuariosDelete)



module.exports = router