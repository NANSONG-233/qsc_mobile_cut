import Fastify from 'fastify';
import cors from '@fastify/cors'
import { ZJUAM ,ZDBK,YQFKGL} from 'login-zju';
import { error } from 'console';
import QRcode from 'qrcode'




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



let am:ZJUAM



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
    

    am= new ZJUAM(username ,password);
    const result = await am.fetch("https://zjuam.zju.edu.cn/path")
    if(capturedErrors[capturedErrors.length-1]?.includes('mes')){
        reply.code(400)
        reply.header('content-type','application/json');
        return reply.send({message:'fail'})
        
    }    
    else if(capturedLogs[capturedLogs.length-1]?.includes('suc')){
        reply.code(201)
        reply.header('content-type','application/json');
        return reply.send({message:'success'})
        

    }
})







app.get('/qrcode',async(req,reply)=>{
    
    const yqfgl=new YQFKGL(am)
    const res1=await yqfgl.fetch("https://yqfkgl.zju.edu.cn/_web/_customizes/ykt/index3.jsp")
    const res2=await yqfgl.fetch("https://yqfkgl.zju.edu.cn/user/api/qrcode/access1.rst")
    const access = await res2.json()
    const qrData=access.result.data
    if(!qrData)
    {
        return reply.status(500).send({error:'fail to get qrcode'})
    }
    const qrBuffer = await QRcode.toBuffer(qrData)
    reply
    .type('image/png')
    .header('cache-control','no-cache')
    .send(qrBuffer)
    

    


})














//23333333333333



app.listen({ port: 8080 }).then(() => {
    console.log("Server started on http://localhost:8080");
    console.log("Waiting for requests...");
});






