
const fastify = require('fastify')({logger:true});


fastify.register(require('./routes/router'));
const  PORT=3000;
const start = async()=>{
    try{
        await fastify.listen({port:PORT})
        console.log(`Server is running on port `,PORT);      
    }catch(error){
        fastify.log.error(error);
        process.exit(1);
    }
}
start();