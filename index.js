const { SMTPServer } = require("smtp-server");

const server = new SMTPServer({
    allowInsecureAuth: true,
    authOptional: true,


    onConnect(session, callback){
        callback(); // Accept the connection
    },
    onMailFrom(address, session, callback){
        console.log(`onMailFrom`, address.address, session.id);
        callback(); // Accept the address
    },
    onRcptTo(address, session, callback){
        console.log(`onRcptTo`, address.address, session.id);
        callback(); // Accept the address
    },
    onData(stream, session, callback){
        stream.on('data',(data)=> console.log(`onData ${data.toString()}`));
        stream.on('end', callback);
    }
    
});

server.listen(2525,()=> console.log("SMTP server is running on port 2525"));