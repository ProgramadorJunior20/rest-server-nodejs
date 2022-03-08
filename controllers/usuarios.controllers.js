const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')

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

const usuariosPut = async(req, res) => {

    const id = req.params.id
    const { password, google, correo, ...resto } = req.body

    // TODO validar contra base de datos
    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json({
        ok: true,
        msg: 'put API - Controlador',
        usuario
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