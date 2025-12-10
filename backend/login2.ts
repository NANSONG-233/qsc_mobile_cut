import Fastify from 'fastify';
import cors from '@fastify/cors'
import { ZJUAM ,ZDBK} from 'login-zju';
import { error } from 'console';

const originalConsoleLog = console.log;

const capturedLogs:string[] = [];

console.log = function(...args) {

    const logMessage = args.map(arg => {

        if (typeof arg === 'object' && arg !== null) {
            try {
                return JSON.stringify(arg);
            } catch (e) {
                return String(arg); 
            }
        }
        return String(arg);
    }).join(' ');
    capturedLogs.push(logMessage);

    originalConsoleLog.apply(console, args);
};



const originalConsoleError = console.error;


const capturedErrors: string[] = [];


console.error = function(...args) {

    const errorMessage = args.map(arg => {

        if (typeof arg === 'object' && arg !== null) {
            try {

                if (arg instanceof Error) {
                    return arg.stack || arg.message;
                }
                return JSON.stringify(arg);
            } catch (e) {
                return String(arg); 
            }
        }
        return String(arg);
    }).join(' ');


    capturedErrors.push(errorMessage);


    originalConsoleError.apply(console, args);
};







const app =Fastify({logger:false});

app.register(cors,{
    origin:'http://localhost:5173',
    methods:["Get","Post","Put","Delete"],
    credentials:true


});

app.post('/login',async(req,reply)=>{
    type LoginPayload={
        username:string;
        password:string;
    }
    const data=(req.body && Object.keys(req.body).length>0 ?req.body : req.query) as LoginPayload
    const username=data.username;
    const password=data.password;
    

    var am= new ZJUAM(username ,password);
    const result = await am.fetch("https://zjuam.zju.edu.cn/path")
    if(capturedErrors[capturedErrors.length-1]?.includes('mes')){
        reply.code(400)
        reply.header('content-type','application/json');
        return reply.send({message:'fail'})
        
    }    
    else if(capturedLogs[capturedLogs.length-1]?.includes('suc')){
        reply.code(201)
        console.log(233)
        reply.header('content-type','application/json');
        return reply.send({message:'success'})
        

    }
        




})




app.listen({ port: 3000 }).then(() => {
    console.log("Server started on http://localhost:3000");
    console.log("Waiting for requests...");
});






