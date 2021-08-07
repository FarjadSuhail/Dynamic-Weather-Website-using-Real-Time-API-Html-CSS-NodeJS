const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html","utf-8");


const replaceVal = (tempVal,orgVal) =>{

    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
 
    return temperature;
    
}
const server = http.createServer((req,res) => {

    if(req.url == "/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=173ba5b0f02eeee6b8b5ed1e55882d42")
        .on("data", (chunk) => {
            //converting chunk into json format - objdect
            const objdata = JSON.parse(chunk);
            
            //js obj in array -> now data array of a object
            const arrData = [objdata];
           // console.log(arrData[0].main.temp);

            // in .map method [0] not needed

            const realTimeData = arrData
            .map((val) => replaceVal(homeFile,val))
            .join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("conn closed due to err",err);
            
            res.end();
            //console.log("end");
        });
    }
});


server.listen(8000,"127.0.0.1"); 