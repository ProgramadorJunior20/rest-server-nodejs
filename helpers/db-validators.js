const { Usuario, Categoria, Producto } = require('../models')
const Role = require('../models/role')


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`)
    }
}

const emailExiate = async(correo = '') => {
    // Verificar si el correo existe

    const existeEmail = await Usuario.findOne({ correo })
    if ( existeEmail ){
        //return res.status(400).json({
        //    msg: 'El correo ya está registrado'
        //})
        throw new Error(`El correo: ${ correo } ya está registrado`)
    }
}

const existeUsuarioPorId = async(id = '') => {
    // Verificar si el correo existe

    const existeUsuario = await Usuario.findById(id)
    if ( !existeUsuario ){
        throw new Error(`El id no existe ${ id }`)
    }
}

/**
 * validasion de categorias
 * @param {ExisteCategoriaPorid} id 
 */

const ExisteCategoriaPorid = async(id = '') => {
    // Verificar si el correo existe

    const existeCategoria = await Categoria.findById(id)
    if ( !existeCategoria ){
        throw new Error(`El id no existe ${ id }`)
    }
}

/**
 * validasion de categorias
 * @param {ExisteProductoPorid} id 
 */

 const ExisteProductoPorid = async(id = '') => {
    // Verificar si el correo existe

    const existeProducto = await Producto.findById(id)
    if ( !existeProducto ){
        throw new Error(`El id no existe ${ id }`)
    }
}

/**
 * validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida. permitidas: ${ colecciones }`);
    }
    return true;
} 

module.exports = {
    esRoleValido,
    emailExiate,
    existeUsuarioPorId,
    ExisteCategoriaPorid,
    ExisteProductoPorid,
    coleccionesPermitidas,
}