const express = require('express')
const cors = require('cors')

const { dbConeccion } = require('../database/config.db')

class Server {

    constructor() {
        this.app       = express()
        this.port      = process.env.PORT

        this.usersPath = '/api/usuarios'
        this.authPath  = '/api/auth'
         
        // Connectar a base de datos
        this.conectarDB()

        // Middlewares
        this.middlewares()

        // Lectura y parseo del body
        this.app.use( express.json() )


        // Rutas de mi aplicación
        this.routes()
    }

    async conectarDB() {
        await dbConeccion()
    }

    middlewares() {

        // Cors
        this.app.use( cors() )

        // Directorio Público
        this.app.use( express.static('public') )

    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'))
        this.app.use(this.usersPath, require('../routes/usuarios.routes'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto: ', this.port )
        })
    }

}

module.exports = Server