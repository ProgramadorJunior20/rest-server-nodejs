const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')
const { esRoleValido, emailExiate } = require('../helpers/db-validators')


const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios.controllers')



const router = Router()

router.get('/', usuariosGet)

router.put('/:id', usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que tener 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo ya está registrado').isEmail(), 
    check('correo').custom( emailExiate ),
    /* check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),  */
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost)

router.delete('/', usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router