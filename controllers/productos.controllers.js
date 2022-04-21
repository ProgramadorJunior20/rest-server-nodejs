const { response } = require("express")
const { Producto } = require('../models')


// obtenerProductos - paginado - total - populate

const obtenerProductos = async(req, res = response) => {

    try {
        // Argumentos Opcionales que vienen desde el query
        const {limite = 5, desde = 0} = req.body

        // Estraemos solo los estados que son verdaderos
        const query = { estado: true }

        // populate 
        /* Categoria.
            find().
            populate({
                path: 'fans',
                match: { query: { $qye: true } },
                // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                select: 'nombre -_id'
            }).exec(); */

        if ( limite == Number(limite) & desde == Number(desde) ) {
            
            // Estamos procesando las constantes al mismo tiempo con un solo await
            const [ total, productos ] = await Promise.all([
                Producto.countDocuments(query),
                Producto.find(query)
                    .populate('usuario', 'nombre')
                    .populate('categoria', 'nombre')
                    .skip( Number( desde ))
                    .limit(Number( limite ))
            ])

            res.status(200).json(
                {
                    total,
                    productos  
                }
            )
        }

    } catch (error) {
        res.status(400).json(
            {
                msg: 'Acaba de ocurrir un error'    
            }
        )
    }
}

// obtenerProducto - populate {}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params

    try {
        const producto = await Producto.findById( id )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

        res.status(200).json(
            {
                producto
            }
        )
        
    } catch (error) {
        res.status(400).json(
            {
                msg: 'Acaba de ocurrir un error' 
            }
        )
    }
}

// crearProducto -
const crearProducto = async (req, res = response) => {

    try {
        const {estado, usuario, ...body} = req.body

        const productoDB = await Producto.findOne({ nombre: body.nombre })

    
        if ( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre }, ya existe`
            });
        }

        // Generar la data a guardar
        const data = { 
            ...body,
            nombre: body.nombre.toUpperCase() ,
            usuario: req.usuario._id
        }

        const producto = new Producto( data )

        // Guardar en DB
        await producto.save()

        res.status(201).json(producto)
    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }

}

// actualizarProductos
const actualizarProducto = async (req, res = response) => {
    
    const { id } = req.params
    try {
        
        const  {estado, usuario, ...data}  = req.body

        if ( data.nombre ) {
            data.nombre = data.nombre.toUpperCase() 
        }

        data.usuario = req.usuario._id

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true })

        res.status(400).json({
            ok: true,
            producto
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }

}

// borrarProducto - estado - false

const borrarProducto = async (req, res = response) => {
    const { id } = req.params
    try {

        // Fisicamente lo borramos
        // const usuario = await Usuario.findByIdAndDelete( id )
        const estado = {estado: false} 
        const productoBorrada = await Producto.findByIdAndUpdate( id, estado, { new: true} ) 
    
    
        res.status(200).json( productoBorrada )

    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }
}





module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}