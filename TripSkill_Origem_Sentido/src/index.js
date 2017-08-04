
//var gtfsToPouch = require('gtfs-to-pouch')
//var queryPouchGtfs = require('query-pouch-gtfs')

var _ = require('underscore');
var dateFormat = require('dateformat');
const durastamp = require('time-funcs/durastamp')

var fs = require('fs');
var agency = JSON.parse(fs.readFileSync('agency.json','utf8'));
var calendar = JSON.parse(fs.readFileSync('calendar.json','utf8'));
var calendar_dates = JSON.parse(fs.readFileSync('calendar_dates.json','utf8'));
var frequencies = JSON.parse(fs.readFileSync('frequencies.json','utf8'));
var routes = JSON.parse(fs.readFileSync('routes.json','utf8'));
var shapes = JSON.parse(fs.readFileSync('shapes.json','utf8'));
var stop_times = JSON.parse(fs.readFileSync('stop_times.json','utf8'));
var stops = JSON.parse(fs.readFileSync('stops.json','utf8'));
var trips = JSON.parse(fs.readFileSync('trips.json','utf8'));



//porque não há PT-PT na alexa

var stations = {
    "orange" : {
        "name": "cascais",
        "stop_id": "11069260",
        "c_way": "1",
        "cs_way":"17"
    },
     "pear" : {
        "name": "monte estoril",
        "stop_id": "11069252",
        "c_way": "2",
        "cs_way":"16"
    },
    "grapes" : {
        "name": "estoril",
        "stop_id": "11069245",
        "c_way": "3",
        "cs_way":"15"
    },
    "lemon" : {
        "name": "sao joao do estoril",
        "stop_id": "11069237",
        "c_way": "4",
        "cs_way":"14"
    },
    "onion" : {
        "name": "sao pedro do estoril",
        "stop_id": "11069229",
        "c_way": "5",
        "cs_way":"13"
    },
    "apple" : {
        "name": "parede",
        "stop_id": "11069203",
        "c_way": "6",
        "cs_way":"12"
    },
    "ananas" : {
        "name": "carcavelos",
        "stop_id": "11069187",
        "c_way": "7",
        "cs_way":"11"
    },
    "banana" : {
        "name": "oeiras",
        "stop_id": "11069179",
        "c_way": "8",
        "cs_way":"10"
    },
    "carrot" : {
        "name": "santo amaro de oeiras",
        "stop_id": "11069161",
        "c_way": "9",
        "cs_way":"9"
    },
    "potato" : {
        "name": "paço de arcos",
        "stop_id": "11069146",
        "c_way": "10",
        "cs_way":"8"
    },
    "fig" : {
        "name": "caxias",
        "stop_id": "11069120",
        "c_way": "11",
        "cs_way":"7"
    },
    "watermelon" : {
        "name": "cruz quebrada",
        "stop_id": "11069104",
        "c_way": "12",
        "cs_way":"6"
    },
    "cherry" : {
        "name": "alges",
        "stop_id": "11069088",
        "c_way": "13",
        "cs_way":"5"
    },
    "peach" : {
        "name": "belem",
        "stop_id": "11069054",
        "c_way": "14",
        "cs_way":"4"
    },
    "tomato" : {
        "name": "alcantara",
        "stop_id": "11069039",
        "c_way": "15",
        "cs_way":"3"
    },
    "lettuce" : {
        "name": "santos",
        "stop_id": "11069013",
        "c_way": "16",
        "cs_way":"2"
    },
    "melon" : {
        "name": "cais do sodre",
        "stop_id": "11069005",
        "c_way": "17",
        "cs_way":"1"
    }
}

var ways = {
    "orange" : {
        "name": "cascais",
        "stop_id": "11069260",
        "routes":["414","874","5508","6877"],
        "c_way": "1",
        "cs_way":"17"
    },
     "melon" : {
        "name": "cais do sodre",
        "stop_id": "11069005",
        "routes":["401","873","412", "2420", "6876"],
        "c_way": "17",
        "cs_way":"1"
    }
}

var st = ["orange", "pear", "grapes", "lemon", "onion", "apple", "ananas", "banana", "carrot", "potato", "fig", "watermelon", "cherry", "peach", "tomato", "lettuce" , "melon" ]

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "TripIntent") {
        handleTripResponse(intent, session, callback)
    } else if (intentName =="ListIntent") {
        handleListResponse(intent, session, callback)
    } else if (intentName == "AMAZON.YesIntent") {
        handleYesResponse(intent, session, callback)
    } else if (intentName == "AMAZON.NoIntent") {
        handleNoResponse(intent, session, callback)
    } else if (intentName == "AMAZON.HelpIntent") {
        handleGetHelpRequest(intent, session, callback)
    } else if (intentName == "AMAZON.StopIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else if (intentName == "AMAZON.CancelIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else {
        throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome Trip Skill! I can tell you a route from a origin station in one way"

    var reprompt = "which way and origin station are you interested in?"
    
    var header = "Trip Skill"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function seconds(time){
    var a = time.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds
}



function convertData(dateString){    
    var year = dateString.substring(0,4);
    var month = dateString.substring(4,6);
    var day = dateString.substring(6,8);

    var date = new Date(year, month-1, day);


    return date;
}


function dateCheck(from,to,check) {
    var now = new Date();
    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
   

    if(cDate <= lDate && cDate >= fDate) {
        return true;
    }
    return false;
    
}

function horario(origem_id, sentido_routes){
    var now = new Date();

    var time = dateFormat(now, "HH:MM:ss");
    var date = dateFormat(now, "yyyymmdd");
    var weekDay = dateFormat(now, "dddd").toLowerCase();
    
    var routes_ids = sentido_routes;

    var services =[];
    var i = 0
    while (i != routes_ids.length){
        var services = services.concat(_.where(trips, {route_id: parseInt(routes_ids[i])}))
        var i = Number(i) +1
    }

    

    var j = 0;
    var horas = [];
    while (j != services.length){
        var horas = horas.concat(_.where(stop_times, {trip_id:  parseInt(services[j].trip_id), stop_id:  parseInt(origem_id) }))
        var j = Number(j) +1
    }

    
    var actual = seconds(time);
    var actualfim = Number(actual) +3600;
    console.log(actual);
    console.log(actualfim);


    var k = 0;
    var horario = [];
    while (k != horas.length){
        var inith =seconds(horas[k].arrival_time);
        var tripId = horas[k].trip_id;
        //var serviceId = horas[k].service_id;
        var freq = _.where(frequencies, {trip_id:  parseInt(tripId)})
        var calnd = _.where(calendar, {service_id: parseInt(tripId)})
        var exc = _.where(calendar_dates, {service_id: parseInt(tripId), date: date})
        var validDate = dateCheck(convertData((calnd[0].start_date).toString()),convertData((calnd[0].end_date).toString()),convertData(date.toString()))



        if ( validDate == true &&  ((calnd[0][weekDay] == 1 && exc.length == 0) || (calnd[0][weekDay] == 0 && exc.length > 0))){
            if (freq.length != 0){
                var step = freq[0].headway_secs
                var end = seconds(freq[0].end_time)
                var start = seconds(freq[0].start_time)

                if(end > actual && start < actualfim){
                    var next = inith

                    if (next >= actual && next <= actualfim){
                        horario.push(durastamp(inith))                  
                    }

                    while(next <= actualfim && next <= end){
                        var next = next + step
                        if (next >= actual && next <= actualfim){
                            horario.push(durastamp(next))
                        }
                    }
                }
            }

            else if(inith >= actual && end > actual && start < actualfim){
               horario.push(durastamp(inith))
            }
        }

        var k = Number(k) +1
     }
     

    return _.sortBy(horario);

}

function handleTripResponse(intent, session, callback){
    var station = intent.slots.Station.value.toLowerCase()
    var way = intent.slots.Way.value.toLowerCase()

     if (!ways[way]){
        var speechOutput = "that way isn't in that route. Try asking another one, like Orange or Melon."
        var repromptText = "try asking about another start station and way"
        var header = "invalid way"
    } else if (!stations[station]){
        var speechOutput = "that station isn't in that route. Try asking another one, like orange, pear, grapes, lemon, onion, apple, ananas, banana, carrot, potato, fig, watermelon, cherry, peach, tomato, lettuce or melon."
        var repromptText = "try asking about another start station"
        var header = "invalid start station"
    } else if (station == way){
        var speechOutput = "that station and way is the same."
        var repromptText = "try asking about another start station and"
        var header = "invalid start station is the same end way"
    } else {
        var name = stations[station].name 
        var id = stations[station].stop_id
        var numb = stations[station].c_way
        var way_nr = ways[way].c_way
        var way_rt= ways[way].routes
        var way_name = ways[way].name
        var horas = horario(id, way_rt);
        var time ="";
        var k = 0;
        while (k != horas.length){
            var time = time + horas[k] + "\n"
            var k = Number(k) + 1
        }
        
        var speechOutput =  capitalizeFirst(name) +  " " +"next trains in way " + capitalizeFirst(way_name) + " are:\n" + time + "\n Do you want other route?"

        //procura dos proximos horarios dada uma estação e sentido, query sobre o GTFS 

        var repromptText = "Do you want other route?"
        var header = capitalizeFirst(name)
    }

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleListResponse(intent, session, callback){
    var station = intent.slots.Station.value.toLowerCase()
    var way = intent.slots.Way.value.toLowerCase()

     if (!ways[way]){
        var speechOutput = "that way isn't in that route. Try asking another one, like Orange or Melon."
        var repromptText = "try asking about another start station and way"
        var header = "invalid way"
    } else if (!stations[station]){
        var speechOutput = "that station isn't in that route. Try asking another one, like orange, pear, grapes, lemon, onion, apple, ananas, banana, carrot, potato, fig, watermelon, cherry, peach, tomato, lettuce or melon."
        var repromptText = "try asking about another start station"
        var header = "invalid start station"
    } else if (station == way){
        var speechOutput = "that station and way is the same."
        var repromptText = "try asking about another start station and"
        var header = "invalid start station is the same end way"
    } else {
        var name = stations[station].name
        var numb = stations[station].c_way
        var way_nr = ways[way].c_way
        var way_name = ways[way].name
        
        var speechOutput = capitalizeFirst(name) + " next stops are:"
        var i = numb
        
        if (way_name == "cais do sodre" ){
            while (Number(i) != Number(way_nr)){
                var i = Number(i) + 1
                var speechOutput = speechOutput + "\n" +  stations[st[Number(i)-1]].name
            }
        } else if (way_name == "cascais" ){
            while (Number(i) != Number(way_nr)){
                var i = Number(i) - 1
                var speechOutput = speechOutput + "\n" +  stations[st[Number(i)-1]].name
            }
        }

     
        var repromptText = "Do you want other information?"
        var header = capitalizeFirst(name) + " next stops"
    }

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}
function handleYesResponse(intent, session, callback){
    var speechOutput = "Great! which way and start station?"
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleNoResponse(intent, session, callback){
    handleGetHelpRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "i can tell you route from one station in one way"

    var repromptText = speechOutput

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))

}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for use Trip Skill", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
