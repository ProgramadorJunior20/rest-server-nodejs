const { response } = require("express")
const { Categoria } = require('../models')


// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async(req, res = response) => {

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
            const [ total, categorias ] = await Promise.all([
                Categoria.countDocuments(query),
                Categoria.find(query)
                    .populate('usuario', 'nombre')
                    .skip( Number( desde ))
                    .limit(Number( limite ))
            ])

            res.status(200).json(
                {
                    total,
                    categorias  
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

// obtenerCategoria - populate {}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params

    try {
        const categoria = await Categoria.findById( id )
                                .populate('usuario', 'nombre');

        res.status(200).json(
            {
                categoria
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


const crearCategoria = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase() 

        const categoriaDB = await Categoria.findOne({ nombre })

    
        if ( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.nombre }, ya existe`
            });
        }

        // Generar la data a guardar
        const data = { 
            nombre,
            usuario: req.usuario._id
        }

        const categoria = new Categoria( data )

        // Guardar en DB
        await categoria.save()

        res.status(201).json(categoria)
    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }

}

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
    
    const { id } = req.params
    try {
        
        const  {estado, usuario, ...data}  = req.body

        data.nombre = data.nombre.toUpperCase() 
        data.usuario = req.usuario._id

        const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true })

        res.status(400).json({
            ok: true,
            categoria
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }

}

// borrarCategoria - estado - false

const borrarCategoria = async (req, res = response) => {
    const { id } = req.params
    try {

        // Fisicamente lo borramos
        // const usuario = await Usuario.findByIdAndDelete( id )
        const estado = {estado: false} 
        const categoriaBorrada = await Categoria.findByIdAndUpdate( id, estado, { new: true} ) 
    
    
        res.status(200).json( categoriaBorrada )

    } catch (error) {
        res.status(400).json({
            msg: 'Acaba de ocurrir un error'
        })
    }
}





module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}