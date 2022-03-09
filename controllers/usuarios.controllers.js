const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')

const usuariosGet = async(req = request, res = response) => {
    // Argumentos Apcionales que vienen desde el query
    const { limite = 5, desde = 0 } = req.query

    // Estraemos solo los estados que son verdaderos
    const query = { estado: true }

    //const total  = await Usuario.countDocuments(query)
    if (limite == Number(limite) & desde == Number(desde)){
        //const usuarios = await Usuario.find(query)
        //.skip( Number( desde ))
        //.limit(Number( limite ))

        // Estamos procesando las constantes al mismo tiempo con un solo await
        const [ total, usuarios ] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
                .skip( Number( desde ))
                .limit(Number( limite ))

        ])

        res.json({
            total,
            usuarios
        })
    }else{
        console.log('Acaba de ocurrir un error');
        throw new Error(`Tienes que ingresar NUMEROS`)
    }
}

const usuariosPost = async(req, res) => {
 
    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol })

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt )

    // Guardar en DB
    await usuario.save()

    res.json(usuario)
}

const usuariosPut = async(req, res) => {

    const id = req.params.id
    const { _id, password, google, correo, ...resto } = req.body

    // TODO validar contra base de datos
    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json({
        ok: true,
        usuario
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'Patch API - Controlador'
    })
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id )
    const estado = {estado: false} 
    const usuario = await Usuario.findByIdAndUpdate( id, estado ) 

    res.json(usuario)
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}