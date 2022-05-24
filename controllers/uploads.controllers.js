const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { validarArchivo } = require("../middlewares");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {

  try {
    // txt, md
    /* const extensiones_extras = ["txt", "csv", "md"];
    const pathCompleto = await subirArchivo(req.files, extensiones_extras, 'textos'); */
    const pathCompleto = await subirArchivo( req.files, undefined, 'imgs' );

    res.json({
      nombre: pathCompleto,
    });

  } catch (msg) {
      res.status(400).json({ msg });
  }
};

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        });
      }

    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        });
      }

    break;
  
    default:
      return res.status(500).json({msg: "Se me olvidó validar esto."});
  }


  const pathCompleto = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = pathCompleto;

  await modelo.save();


  res.json( modelo );

};

module.exports = {
  cargarArchivo,
  actualizarImagen,
};
