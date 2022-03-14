const { Router } = require('express')
const { check } = require('express-validator')

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')
const { esRoleValido, emailExiate, existeUsuarioPorId } = require('../helpers/db-validators')


const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios.controllers')





const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que tener 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo ya está registrado').isEmail(), 
    check('correo').custom( emailExiate ),
    /* check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),  */
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router