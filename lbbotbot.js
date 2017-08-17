/* Created with the help of:
"Anonymous" on YouTube - https://www.youtube.com/channel/UCfU3FEbSX6KGRAVOi8lEafw
Aman Mattal on RisingStack - https://community.risingstack.com/node-js-twitter-bot-tutorial/
*/

// Basic setup:
var twit = require("twit");  
var config = require("./keys.js");

var Twitter = new twit(config);

function tweet(actualMessage) {
    console.log("Attempting to tweet:")
    console.log (actualMessage)
    Twitter.post("statuses/update", {status: actualMessage}, function(error, tweet, response){
        if(error){
        console.log(error);
        }
    });
    console.log("Tweet successfully Tweeted!");
}


// Lets you know the Earth is still here every minute:
var earth_status = function() {
    var today = new Date();
    tweet("It's " + today.getHours() + ":" + today.getMinutes() + " and the Earth is still here!");
}

earth_status();
setInterval(earth_status, 60000);


// Finds a random tweet with #Earth, Likes it and Retweets:
var favoriteTweet = function(){  
    var params = {
        q: "#earth, #Earth",
        result_type: "recent",
        lang: "en"
    }
    // find the tweet
    Twitter.get("search/tweets", params, function(err,data){
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet
    // if random tweet exists
    if(typeof randomTweet != "undefined"){
        // Tell Twitter to Like
        Twitter.post("favorites/create", {id: randomTweet.id_str}, function(err, response){
        // if there was an error while Liking
            if(err){
                console.log("CANNOT BE LIKED... Error");
            }
            else{
                console.log("Random message LIKED!");
            }
        });
      
        // This Retweets the random message, consider merging into the function above.
        Twitter.post("statuses/retweet/:id", {id: randomTweet.id_str}, function(err, response){
            if(err){
                console.log("CANNOT BE RETWEETED... Error");
            }
            else{
                console.log("Random message RETWEETED!!!");
            }
        });
    }
  });
}

// Does one like/retweet on startup and every amount of time specified after this.
favoriteTweet();  
setInterval(favoriteTweet, 60000);


// function to generate a random tweet
function ranDom (arr) {  
    var index = Math.floor(Math.random()*arr.length);
    return arr[index];
};


// Response to any users that Follow the bot:
// set up a user stream
var stream = Twitter.stream("user");  
// when someone follows
stream.on("follow", followed);  
// ...trigger the callback
function followed(event) {  
    console.log("Follow Event is running");
    //get user's twitter handler (screen name)
    var name = event.source.name,
    screenName = event.source.screen_name;
    // function that replies back to the user who followed
    tweetNow("@" + screenName + " Wow, you must be really worried about the Earth.");
}

function tweetNow(tweetTxt) {  
    var tweet = {
        status: tweetTxt
    }
    Twitter.post("statuses/update", tweet, function(err, data, response) {
        if(err){
            console.log("Error in Replying");
        }
        else{
            console.log("Follower acknowledged!");
        }
    });
}


// TODO: Implement Markov chain tweets eventually!
