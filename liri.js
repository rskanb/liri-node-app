var env = require('dotenv').config();
var moment = require('moment');
var fs = require('fs');
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Capturing Command line argument 
var liriSearch = process.argv.slice(3).join(" ");
var action = process.argv[2];

//These 4 options used in switch case break as per instruction
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

// console.log(action);
// console.log(liriSearch);
switch (action){
    case "concert-this":
        concertAPI();
        break;
    
    case "spotify-this-song":
        songSpotifyAPI();
        break;
    
    case "movie-this":
        movieAPI();
        break;
    
    case "do-what-it-says":
        whateverSays();
        break;
}

//Function which calls bands in town API 
function concertAPI(){
    axios.get(`https://rest.bandsintown.com/artists/${liriSearch}/events?app_id=9379a25273d4a490d00899961b54488f`).then(
        function(response){
            if(response){
                var liri = `${liriSearch} Concert Detail \n===========`;
                var venue = `Name of the Venue : ${response.data[0].venue.name}`;
                var time = moment.utc(response.data[0].datetime).format('YYYY-MMM-DD h:mm A');
                var venueLocation = `Venue Location : ${response.data[0].venue.city}, ${response.data[0].venue.region}, ${response.data[0].venue.country}`;
                var text = liri + "\n" + venue + "\n" + venueLocation + "\n Date: " + time  + "\n";
                fs.appendFile("./random.txt", text, function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("File Appended");
                    }
                });
                console.log("\n" + liri + "\n" + venue + "\n" + venueLocation + "\nDate:" + time + "\n");
                //console.log(JSON.stringify(response.data, null, 2));
            }else{
                console.log("No Response Received");
            }
        });
}

function songSpotifyAPI(){
    spotify.search({ type: 'track', query: liriSearch }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var artist = `Artist : ${data.tracks.items[0].album.artists[0].name}`;
        var songname = `The song's name : ${data.tracks.items[0].name}`;
        var previews = `A preview link : ${data.tracks.items[0].preview_url}`;
        var album = `Album: ${data.tracks.items[0].album.name}`;
        var text = "\n" + artist + "\n" + songname + "\n" + previews  + "\n" + album + "\n";
        fs.appendFile("./random.txt", text, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("File Appended");
            }
        });
        console.log("\n" + artist + "\n" + songname  + "\n" + previews  + "\n" + album  + "\n" );
      //console.log(JSON.stringify(data, null, 2)); 
      });
};

function movieAPI(){
axios.get(`http://www.omdbapi.com/?t=${liriSearch}&y=&plot=short&apikey=trilogy`)
.then(function(response) {
    var movie = `* ${response.data.Title}`;
    var myear = `* Year: ${response.data.Year}`;
    var mimdb = `* IMDB rating: ${response.data.Rated}`;
    var mrotten = `* Rotten Tomatoes rating: ${response.data.Ratings[1].Value}`;
    var mcountry = `* Country: ${response.data.Country}`;
    var mlanguage = `* Language: ${response.data.Language}`;
    var mplot = `* Plot of the movie : ${response.data.Plot}`;
    var mactors = `* Actors: ${response.data.Actors}`;
    var text = "\n" + movie +"\n"+ myear +"\n"+ mimdb +"\n"+ mrotten +"\n"+ mcountry  +"\n"+ mlanguage +"\n"+ mplot +"\n"+ mactors +"\n";
    fs.appendFile("./random.txt", text, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("File Appended");
        }
    });
    //console.log(response.data);
    console.log("\n" + movie + "\n" + myear + "\n "+ mimdb + "\n" + mrotten + "\n" + mlanguage + "\n" + mplot + "\n"+ mactors + "\n");
    }
 );
};

function whateverSays(){
    var text = "\nWhat ever you say : " + liriSearch + " --> can't search by liri, please correct your input ";
    fs.appendFile("./random.txt", text, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("\n" + liriSearch + "Whatever you entered can't search by liri, please correct your input ");
            console.log("File Appended");
        }
    });
};

//Sample write File function used to get JSON object and copy pasted in json online editor to get all value as terminal was no
//displaying correct values
//  fs.writeFile("./random.txt", JSON.stringify(data, null, 2), function(err){
        //             if(err){
        //                 console.log(err);
    //             }

    //             console.log("file updated");
    //         });