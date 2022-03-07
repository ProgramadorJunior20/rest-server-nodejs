const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey } = req.query;

    res.json({
        ok: true,
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    })
}

const usuariosPost = async(req, res) => {
 

    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol })

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo })
    if ( existeEmail ){
        return res.status(400).json({
            msg: 'El correo ya está registrado'
        })
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en DB
    await usuario.save()

    res.json({
        ok: true,
        usuario
    })
}

const usuariosPut = (req, res) => {

    const id = req.params.id

    res.json({
        ok: true,
        msg: 'put API - Controlador',
        id
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'Patch API - Controlador'
    })
}

const usuariosDelete =(req, res) => {
    res.json({
        ok: true,
        msg: 'Delete API - Controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}