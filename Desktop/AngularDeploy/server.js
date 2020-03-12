
//Install express server
const bodyParser = require("body-parser")
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.static( __dirname + '/public/dist/public' ));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/angulardeploy'));

const RatingsSchema = new mongoose.Schema({
	stars: {
		type: Number,
		required: true
	},
	comment: {
		type: String,
		required: true,
		minlength: [5, "Enter a valid comment"]
	},
}, {timestamps: true});


const CakeSchema = new mongoose.Schema({
	baker: {
		type: String,
		required: [true, "Enter your Name"]
	},
	image: {
		type: String,
		required: true
	},
	ratings: [RatingsSchema]
}, {timestamps: true});


const Cakes = new mongoose.model('Cakes', CakeSchema);

const Ratings = new mongoose.model('Ratings', RatingsSchema);



//// ROUTES \\\\
app.get('/cakes', (request, response)=>{
	Cakes.find({}, (error, cake)=>{
		if(error){
			console.log("ERROR");
			response.json(error);
		}
		else{
			response.json(cake);
		}
	})
})

app.post('/cakes', (request, response)=>{
	Cakes.create({
		baker: request.body.baker,
		image: request.body.image
	}, (error, cake)=>{
		if(error){
			console.log(error);
			console.log("THERE IS AN ERROR");
			response.json(error);
		}
		else{
			console.log("SUCCESS");
			response.json(cake);
		}
	})
})
 app.get('/cakes/:id', (request, response)=>{
 	Cakes.findOne({_id:request.params.id}, (error, cake)=>{
 		if(error){
 			console.log("ERROR HERE");
 			response.json(error);
 		}
 		else{
 			console.log("BET");
 			response.json(cake);
 		}
 	})
 })
 app.post('/ratings/:cakeId', (request, response)=>{
 	console.log(request.body);
 	Ratings.create({
 		stars: request.body.stars,
 		comment: request.body.comment
 	}, (error, newRating)=>{
 		if(error){
 			console.log("here is your error");
 			console.log(error);
 			response.json(error);
 		}
 		else{
 			console.log(newRating);
 			Cakes.findByIdAndUpdate(request.params.cakeId, {$push: {ratings: newRating}}, {new: true}, (error, data)=>{
 				if(error){
 					console.log("IT DOES NOT WORK")
 					response.json(error);
 				}
 				else{
 					console.log("GOT IT");
 					response.json(data);
 				}	
 			})
 		}
 	})
 })


app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/angulardeploy/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);