require('dotenv').config();
let qs = require('querystring');
let http = require('http');

let responder = (req, res, params) => {
    res.writeHead(200, {"Content-type" : "text/html"});
    res.end(params);
}

let routes = {
    "GET" : {
        "/" : (req, res) => {
            responder(req, res, "<h1>GET method => /</h1>");
        },
        "/home" : (req, res) => {
            responder(req, res, "<h1>GET method => /home</h1>");
        }
    },
    "POST" : {
        "/" : (req, res) => {
            responder(req, res, "<h1>POST method => /</h1>");
        },
        "/api/login" : (req, res) => {
            let body = "";
            req.on('data', data => {
                body += data;
            });

            req.on('end', () => {
                let query = qs.parse(body);
                console.log(`Password is ${query.password} and Email is ${query.password}`);
                res.end();
            })
        }
    },
    "NA" : (req, res) => {
        res.writeHead(404, {"Content-type" : "text/html"});
        res.end("<h1>404 Page Not Found!</h1>");
    }
}

let start = (req, res) => {
    let reqMethod = req.method;
    let reqUrl = new URL(req.url, "http://localhost:3000/");
    let params = reqUrl.searchParams;
    
    let resolveRoute =  routes[reqMethod][reqUrl.pathname];
    if(resolveRoute != undefined && resolveRoute != null) {
        resolveRoute(req, res, params);
    }else {
        routes["NA"](req, res, params);
    }
}

let server = http.createServer(start);

server.listen(process.env.PORT, _ => console.log(`Server is running at ${process.env.PORT}`));