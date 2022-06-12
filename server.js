const http = require("http");
const app= require("./backend/app");

// const server = http.createServer((req, res)=>{
//     res.end("Welcome nodemon ")
// });
const server = http.createServer(app);

server.listen(3000, ()=>{
    console.log("please check port 3000 number");
});