const { response, request } = require('express')


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

const usuariosPost = (req, res) => {

    const { nombre, edad } = req.body

    res.json({
        ok: true,
        msg: 'post API - Controlador',
        nombre, 
        edad
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