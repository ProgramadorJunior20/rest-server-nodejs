const path = require("path");
const { v4: uuidv4 } = require("uuid");

const validas = ["png", "jpg", "jpeg", "git"];

const subirArchivo = ( files, extensionesPermitidas = validas, carpeta = '' ) => {
    
  return new Promise((resolve, reject) => {

    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    /* console.log(nombreCortado) */
    // Validar la extension

    if (!extensionesPermitidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida. Pemitidas: ${extensionesPermitidas}`
      );
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });

  });
};

module.exports = {
  subirArchivo,
};
