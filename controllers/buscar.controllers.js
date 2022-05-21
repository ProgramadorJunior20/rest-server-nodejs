const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    "categorias", 
    "usuarios", 
    "productos", 
    "roles"
];

// Buscar por Usuario
const buscarUsuarios = async( termino = '', res = response ) => {
    
    // Buscando por id mongo validos
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    // Busquedas insencibles  exprecion regular
    const regax = new RegExp( termino, 'i' );


    // Buscar por otros argumentos
    const usuarios = await Usuario.find({ 
        $or:  [{ nombre: regax }, {correo: regax }],
        $and: [{ estado: true }]
    }); // busqueda por nombre o correo electronico
    return res.json({
        results: usuarios 
    })


}

// Buscar por categoria
const buscarCategoria = async( termino = '', res = response ) => {

    // Buscar por un ID valido de mongo
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    // Busquedas insencibles  exprecion regular
    const regax = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ 
        $or:  [{ nombre: regax }],
        $and: [{ estado: true }]
    })// busqueda por nombre o correo electronico
    return res.json({
        results: categorias
    })

}

// Buscar por productos
const buscarProductos = async( termino = '', res = response ) => {
    
    // Buscar por un ID valido de mongo
    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById( termino )
                               .populate('categoria', 'nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }
    

    // Busquedas insencibles  exprecion regular
    const regax = new RegExp( termino, 'i' );

    const productos = await Producto.find({ 
        $or:  [{ nombre: regax }],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre'); // busqueda por nombre o correo electronico
    return res.json({
        results: productos
    })

}


const buscar = (req, res = response) => {

  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }


  switch (coleccion) {
    case "categorias":
        buscarCategoria(termino, res);
      break;
    case "usuarios":
        buscarUsuarios(termino, res);
      break;
    case "productos":
        buscarProductos(termino, res)
      break;

    default:
      res.status(500).json({
        msg: "se me olvido hacer esta búsqueda",
      });
  }

};

module.exports = { buscar };
