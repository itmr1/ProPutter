const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const http = require('http');
const https = require('https');
const fs = require('fs');
var path = require('path')
app = express()
app.use(cors())

const options = {
	key:fs.readFileSync('/home/ubuntu/privatekey.pem', 'utf8'),
	cert: fs.readFileSync('/home/ubuntu/certificate.pem', 'utf8'),
	passphrase: 'password'
};

var bodyParser = require('body-parser');
//var fileUpload = require('express-fileupload');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
//Connect to DB
const connection = mysql.createConnection({
    host:"localhost",
    database:"test",
    user:"root",
    password:""
})

//Run the express app
//app.listen(port,(err)=>err?console.log(err):console.log(`Server Running on port ${port}`))
http.createServer(app).listen(4000, ()=>{
	console.log('Server running on port 4000')
});
https.createServer(options,app).listen(3000,()=>{
	console.log('Server running on port 3000')
});

//Connect to DB 
connection.connect(err=>{err?console.log(err):console.log("Connection to database OK")})

app.get('/', (req,res)=>{
    res.redirect('/data');
});

app.get('/data', (req,res)=>{
    res.sendFile('/home/ubuntu/ProPutter/backend/views/index.html');
});


var cur_userid = "";

app.post('/data/create_acc', (req,res)=>{
    var username = req.body.username
    var password = req.body.password
    console.log(username)
    console.log(password)
    const sql = 'INSERT INTO `user_registry` (`user_name`, `user_password`) VALUES ("'+username+'", "'+password+'")';
    connection.query(sql, (err,data)=>{
        if(err){
		res.send("error")
	}
	else{
		res.send("success");
	}
    });
})

app.post('/data/check_acc', (req,res)=>{
    var username = req.body.username
    var password = req.body.password
    connection.query('SELECT * FROM `user_registry` WHERE user_name = "'+username+'" AND user_password = "'+password+'"',(err,rows)=>{
        if(err){
		res.send(err);
	}
	else{
		if(!rows.length){
			res.send("error")
		}
		else{
			res.send("success");
			cur_userid = rows[0]['user_id'];
			console.log("logged in user:",cur_userid);
		}
	}
    });
})

app.post('/data/logout', (req,res)=>{
	cur_userid = "";
	res.send("Cleared user id");
});

app.post('/data/sensor',(req,res)=>{
    if(cur_userid == ""){
	res.send("No one logged in!")
    }
    else{
    	var data  = req.body.data
    	const sql = 'INSERT INTO `sensordata`(`user_id`,`data`) VALUES ("'+cur_userid+'", '+JSON.stringify(data)+')';
    	connection.query(sql)
    	res.send("Inserting into DB...")
   }
})

function finalV(u, a, t){
    return u+(a*t);
};
const angleNormalise = 0.8;
function getMetrics(data){
	 var json = JSON.parse(data);
                                //res.send("Successfully parsed data");
         var count = (Object.keys(json).length)-1;
         var velocity = [];
         velocity[0] = {"x":0,"y":0,"t":0};
         var i = 1;
	 Object.keys(json).forEach(function(key) {

                if(json[key][0]<=0){return;}
                else{
                	var deltaT = parseFloat(json[key][5] - velocity[i-1].t);
                        velocity[i] = {
                        	x: finalV(velocity[i-1].x, json[key][0], deltaT),
                                y: finalV(velocity[i-1].y, json[key][1], deltaT),
                        	t: parseFloat(json[key][5])
                        };

                                            }
                i++;
	 })
         var speed = [];
         for(var i =0; i< velocity.length; i++){
         	speed[i] = Math.sqrt((velocity[i].x * velocity[i].x) + (velocity[i].y * velocity[i].y))
         }
         var maxSpeed = Math.max(...speed)
         var theta = angleNormalise*Math.atan(velocity[speed.indexOf(maxSpeed)].y / velocity[speed.indexOf(maxSpeed)].x)

         return payload = [maxSpeed, Math.abs(theta), json["0"][3], json["0"][4]]
};

function performance(metrics){
	var score = (0.65*(35* (1-(Math.abs(metrics[0] - 1) / (1 + metrics[0])))) + (65*(1-(1*(Math.abs(metrics[1])/1.134)))));
	return score;

};

app.get('/data/averages', (req,res) =>{
	 if(cur_userid==""){
                res.send("No one logged in!")
         }
	 else{
                connection.query('SELECT `data` FROM `sensordata` WHERE user_id = "'+cur_userid+'"  ORDER BY id DESC LIMIT 10', (err,rows)=>{
                        if(err){
                                res.send(err)
                        }
                        else{
                                if(!rows.length){
                                        res.send(JSON.stringify([]));
                                }
                                else{
                                        //var ppoints = Math.floor(rows.length/10)
                                        var averages  = []
					var avSpeed = 0;
					var avDev = 0;
                                        const data = rows.map(row => getMetrics(row.data));
                                        for(let i =0; i<data.length; i++){
						avSpeed += data[i][0];
						avDev += data[i][1];
					}
					averages[0] = avSpeed/data.length;
					averages[1] = avDev/data.length;
                                        res.send(JSON.stringify(averages));
                                }
                        }
                });


        }


});

app.get('/data/scatter', (req,res) => {
	if(cur_userid==""){
                res.send("No one logged in!")
        }
        else{
                connection.query('SELECT `data` FROM `sensordata` WHERE user_id = "'+cur_userid+'"  ORDER BY id DESC LIMIT 30', (err,rows)=>{
                        if(err){
                                res.send(err)
                        }
                        else{
                                if(!rows.length){
                                        res.send(JSON.stringify([]));
                                }
                                else{
                                        //var ppoints = Math.floor(rows.length/10)
                                        const data = rows.map(row => getMetrics(row.data));
                                       
                                        res.send(JSON.stringify(data));
                                }
                        }
                });


        }

});

app.get('/data/performance', (req,res)=>{
	if(cur_userid==""){
		res.send("No one logged in!")
	}
	else{
		connection.query('SELECT `data` FROM `sensordata` WHERE user_id = "'+cur_userid+'"  ORDER BY id DESC LIMIT 10', (err,rows)=>{
			if(err){
				res.send(err)
			}
			else{
				if(!rows.length){
					res.send(JSON.stringify([]));
				}
				else{	
					//var ppoints = Math.floor(rows.length/10)
					var performances  = []
					const data = rows.map(row => getMetrics(row.data));
					for(let i =0; i<data.length; i++){
						//performances[i] = performance(data.slice(0+(10*i), (10*(i+1))-1));
						performances[i] = performance(data[i])
					}
					res.send(JSON.stringify(performances));
				}
			}
		});


	}
});

app.get('/data/sensor/', (req,res)=>{
	if(cur_userid == ""){
        	res.send("No one logged in!");
        }
	else{
		connection.query('SELECT `data` FROM `sensordata` WHERE user_id = "'+cur_userid+'" ORDER BY id DESC LIMIT 1', (err,rows)=>{

			if(err){
				res.send(err)
			}
			else{
				if(!rows.length){
		                       res.send(JSON.stringify([]))
               			}
				else{
				const data = rows.map(row => row.data);
                                res.send(JSON.stringify(getMetrics(data)));
				}
			}

		});
	}
});

app.post('/data/addfriend', (req,res)=>{
        if(cur_userid == ""){
                res.send("No one logged in!");
        }
         else{
		var name = req.body.name;
		connection.query('SELECT `user_id` FROM `user_registry` WHERE `user_name` = "'+name+'"',(err,rows)=>{
			if(err || !rows.length){
				res.send("error")
				return;
			}
			else{
				 connection.query('UPDATE `user_registry` SET `friends` = CONCAT(`friends`, "'+name+',") WHERE `user_id` = "'+cur_userid+'"', (err,rows)=>{


		                        if(err){
                		                res.send(err)
                       			}
                        		else{
                                		res.send("success")
        		                }
	
		                });

			}
		});

      
        }

});

app.get('/data/getfriends', (req,res) => {

	if(cur_userid == ""){
		res.send("No one logged in");
	}
	else{
		
		connection.query('SELECT `friends` FROM `user_registry` WHERE `user_id` = "'+cur_userid+'"', (err,rows)=>{
			if(err){
				res.send(err);
			}
			else if(!rows.length){
				res.send("");
			}
			else{
				res.send(rows);
			}
		});
		

	}

});

app.post('/data/frienddata', (req,res)=>{
	 if(cur_userid == ""){
                res.send("No one logged in");
         }
	 else{
		const name = req.body.name.friend;
		console.log(name);
		var id = -1;
		console.log("Here1")
                connection.query('SELECT `user_id` FROM `user_registry` WHERE `user_name` = "'+name+'"', (err,rows)=>{
                        if(err){
				console.log("ERROR")
                                res.send(err);
				return;
                        }
                        else if(!rows.length){
				console.log("ERROR2")
                                res.send({perf:[], scat:[]});
				return;
                        }
                        else{
                              	id = rows[0].user_id;
	                        console.log("Here4")
        		        var performances = []
                		connection.query('SELECT `data` FROM `sensordata` WHERE user_id = "'+id+'"  ORDER BY id DESC LIMIT 30', (err2,rows2)=>{
                       			if(err2){
	                                        res.send(err2)
						return;
        		                }
	                                else if(!rows2.length){
                                        	res.send({perf:[], scat:[]});
						return;
                                        }
                                        else{
                                                const data = rows2.map(row => getMetrics(row.data));
                                                for(let i =0; i<10; i++){
                                                	performances[i] = performance(data[i])
						}
						res.send({ perf : performances, scat: data});
                                        }
                   		});
                	}
              });
	}
});
