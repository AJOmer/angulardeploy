const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/Rate_My_Cakes', {useNewUrlParser: true});

mongodb://heroku_tlqtj9p0:mqchoc7arl6i9pf5v4ceueoi43@ds041583.mlab.com:41583/heroku_tlqtj9p0

app.use(express.static( __dirname + '/public/dist/public' ));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


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



////ROUTES\\\\

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/rate_my_cakes/index.html'));
});

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


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);