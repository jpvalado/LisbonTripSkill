var _ = require('underscore');
var dateFormat = require('dateformat');
const durastamp = require('time-funcs/durastamp')
const timestamp = require('time-funcs/timestamp')
var TimeFormat = require('hh-mm-ss')

var agency;
var calendar;
var calendar_dates; 
var routes;
var shapes;
var stop_times;
var stops;
var trips;

var service = 0;
var origin = [];
var destination = [];

function data(agency_nr){
    var fs = require('fs');
    if (agency_nr == 1){
        /*espaço para a Carris*/
    }else if (agency_nr == 2){
        agency = JSON.parse(fs.readFileSync('data/Metro/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Metro/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Metro/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Metro/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Metro/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Metro/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Metro/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Metro/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Metro/trips.json','utf8'));
    }else if (agency_nr == 3){
        agency = JSON.parse(fs.readFileSync('data/CP/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/CP/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/CP/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/CP/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/CP/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/CP/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/CP/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/CP/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/CP/trips.json','utf8'));
    }
}


//porque não há PT-PT na alexa

var stations = {
    "orange" : {
        "name": "cascais",
        "stop_id": "11069260",
        "agency_id": "3"
    },
     "pear" : {
        "name": "monte estoril",
        "stop_id": "11069252",
        "agency_id": "3"
    },
    "grapes" : {
        "name": "estoril",
        "stop_id": "11069245",
        "agency_id": "3"
    },
    "lemon" : {
        "name": "sao joao do estoril",
        "stop_id": "11069237",
        "agency_id": "3"
    },
    "onion" : {
        "name": "sao pedro do estoril",
        "stop_id": "11069229",
        "agency_id": "3"
    },
    "apple" : {
        "name": "parede",
        "stop_id": "11069203",
        "agency_id": "3"
    },
    "ananas" : {
        "name": "carcavelos",
        "stop_id": "11069187",
        "agency_id": "3"
    },
    "banana" : {
        "name": "oeiras",
        "stop_id": "11069179",
        "agency_id": "3"
    },
    "carrot" : {
        "name": "santo amaro de oeiras",
        "stop_id": "11069161",
        "agency_id": "3"
    },
    "potato" : {
        "name": "paço de arcos",
        "stop_id": "11069146",
        "agency_id": "3"
    },
    "fig" : {
        "name": "caxias",
        "stop_id": "11069120",
        "agency_id": "3"
    },
    "watermelon" : {
        "name": "cruz quebrada",
        "stop_id": "11069104",
        "agency_id": "3"
    },
    "cherry" : {
        "name": "alges",
        "stop_id": "11069088",
        "agency_id": "3"
    },
    "peach" : {
        "name": "belem",
        "stop_id": "11069054",
        "agency_id": "3"
    },
    "tomato" : {
        "name": "alcantara",
        "stop_id": "11069039",
        "agency_id": "3"
    },
    "lettuce" : {
        "name": "santos",
        "stop_id": "11069013",
        "agency_id": "3"
    },
    "melon" : {
        "name": "cais do sodre",
        "stop_id": "11069005",
        "agency_id": "3"
    },

    /*METRO*/

    "stolen sir" : {
        "name": "Senhor Roubado",
        "stop_id": "M41",
        "agency_id": "2"
    },
    "mouse" : {
        "name": "Rato",
        "stop_id": "M19",
        "agency_id": "2"
    }

}


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
    if (intentName == "ServiceIntent"){
        handleServiceSelect(intent, session, callback)
    } else if(intentName == "OriDestIntent"){
        handleOriDest(intent, session, callback)
    } else if(intentName == "TripIntent") {
        handleTripResponse(intent, session, callback)
    } else if (intentName == "ListIntent") {
        handleListResponse(intent, session, callback)
    } else if (intentName == "TripListIntent"){
        handleTripListResponse(intent, session, callback)
    } else if (intentName == "ServicesHelpIntent") {
        handleServicesHelpResponse(intent, session, callback)
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



    var speechOutput = "Welcome Trip Skill! I can tell you a route from a origin station in one way.\n Please, first select the service: \n 2 - Metro de Lisboa \n 3 - CP  \n Say the number"

    var reprompt = "Please, first select the service: \n 2 - Metro de Lisboa \n 3 - CP \n Say the number"
    
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


function horacompare(actual, actualfim, compare){
    var a = actual.toString();
    var ahh = actual.substring(0,2);
    var amm = actual.substring(3,5);
    var ass = actual.substring(6,8);

    var afhh = actualfim.substring(0,2);
    var afmm = actualfim.substring(3,5);
    var afss = actualfim.substring(6,8);

    var chh = compare.substring(0,2);
    var cmm = compare.substring(3,5);
    var css = compare.substring(6,8);


    if (css >= 30){
        cmm = Number(cmm) + 1
        cmm = cmm.toString();
        if(cmm.length == 1){
            cmm = 0 + cmm;
        }

    }

    if (ahh >= chh && chh <= afhh){
        a = chh +":"+cmm;
        return a;
    } else if (ahh == chh && cmm >= amm){
        a = chh +":"+cmm;
        return a;
    } else if (afhh == chh && cmm <= amm){
        a = chh +":"+cmm;
        return a;
    } else {
        return null;
    }   
}

function idCheck(str){

    if (!str.match(/[a-z]/i)) {
        str = parseInt(str)
        return str
    } 
    return str;
}

function horario(origem_id, destino_id){


    var origem_id = idCheck(origem_id)
    var destino_id = idCheck(destino_id)
     

var now = new Date();

    var time = dateFormat(now, "HH:MM:ss");
    var date = dateFormat(now, "yyyymmdd");
    var weekDay = dateFormat(now, "dddd").toLowerCase();

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = []
    
    var i = 0;
    var j = 0;

    while(i < trpOri.length){
        while(j < trpDest.length){
            if(_.isEqual(trpOri[i].trip_id, trpDest[j].trip_id) && Number(trpOri[i].stop_sequence) < Number(trpDest[j].stop_sequence)){
                trp.push(trpOri[i])
            }

            j = j+1
        }
        i = i+1
        j = 0
    }


    var actual = seconds(time.toString());
    var actualfim = actual + 3600


    var horario = [];
    var k = 0;
    while(k < trp.length){
        var inicio = seconds(trp[k].arrival_time);
        var tripId = parseInt(trp[k].trip_id);
        
        var freq = _.where(frequencies, {trip_id: tripId});

        var calnd = _.where(calendar, {service_id: parseInt(tripId)});
        var exc = _.where(calendar_dates, {service_id: parseInt(tripId), date: date});
        var validDate = dateCheck(convertData((calnd[0].start_date).toString()),convertData((calnd[0].end_date).toString()),convertData(date.toString()));

        if (  validDate == true &&  ((calnd[0][weekDay] == 1 && exc.length == 0) || (calnd[0][weekDay] == 0 && exc.length > 0))){
            if (freq.length > 0){
                var step = Number(freq[0].headway_secs)

                var end = Number(seconds(freq[0].end_time))
                var start = Number(seconds(freq[0].start_time))

                if( start <= actual && actual <= end + step){
                    var next = inicio

                    while(next <= actualfim && next <= end + step){
                        next = next + step;

                        if (next>=actual){

                            var a = horacompare(TimeFormat.fromS(actual, 'hh:mm:ss'), TimeFormat.fromS(actualfim, 'hh:mm:ss'), TimeFormat.fromS(next, 'hh:mm:ss'));
                            if(a != null){ 
                                horario.push(a)    
                            }
                        }
                    }
                }
            }

            else if (inicio >=actual){
                var a = horacompare(TimeFormat.fromS(actual, 'hh:mm:ss'), TimeFormat.fromS(actualfim, 'hh:mm:ss'), TimeFormat.fromS(inicio, 'hh:mm:ss'));
                if(a != null){
                    horario.push(a)    
                }
            }
        }

        k = k+1 
    }
    
    return(_.sortBy(horario));
}



function nextSops(origem_id, destino_id){

    var origem_id = idCheck(origem_id)
    var destino_id = idCheck(destino_id)

    

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = []
    
    
    var i = 0;
    var j = 0;

    while(i < trpDest.length){
        while(j < trpOri.length){
            if(_.isEqual(trpOri[j].trip_id, trpDest[i].trip_id)){
                if(Number(trpOri[j].stop_sequence) < Number(trpDest[i].stop_sequence)){
                    trp.push(trpDest[i])
                }
            }
               
            
            j = j+1
        }
        i = i+1
        j = 0
    }

      
    var max = []
    var i = 0
    while(i < trp.length){
        if(max.length == 0){
            var max = trp[i]
        }

        else if(trp[i].stop_sequence > max.stop_sequence){
           var max = trp[i]
        }
        i = i + 1
    }

    
    var tp_id =  max.trip_id

    var min = _.where(stop_times, {trip_id: tp_id, stop_id: origem_id});

    var j = Number(min[0].stop_sequence)
    var paragens = []
    j= j +1

    while(j < max.stop_sequence + 1){
        var aux = _.where(stop_times, {trip_id: tp_id, stop_sequence: j})
        var par = _.where(stops, {stop_id: aux[0].stop_id})
        paragens.push(par[0].stop_name)

        j=j+1

    }

    return paragens;    
}


function handleServiceSelect(intent, session, callback){

    service = parseInt(intent.slots.Service.value)

    data(service)

    var name = _.where(agency, {agency_id: parseInt(service)})[0].agency_name
    
    var speechOutput = "You choose service number " + service + " " + name + ".\n" + "Now, what is your origin and destination stations?"

    var repromptText = "what is your origin and destination stations?"
    var header = "You choose service number " + service + " " + name
    
    

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleOriDest(intent, session, callback){

    if(service == 0){
        var speechOutput = "please first select your service: \n 2 - Metro de Lisboa \n 3 - CP \n Say the number"
        var repromptText = speechOutput
        var header = "invalid service"
    }
    else{

        origin = intent.slots.Origin.value.toLowerCase()
        destination = intent.slots.Destination.value.toLowerCase()

        var nameO = stations[origin].name 
        var nameD = stations[destination].name 
    
        var speechOutput = "Your origin station is " + capitalizeFirst(nameO) + " and destinantion station is " + capitalizeFirst(nameD) +".\n Now, you want, next times from origin, or the stations until destinantion, or both?"

        var repromptText = "You want, next times from origin, or the stations until destinantion, or both?"
        var header = "origin station is " + nameO + "and destinantion station is " + nameD
    
    }
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleTripResponse(intent, session, callback){
    var originX = intent.slots.Origin.value
    var destinationY = intent.slots.Destination.value

    
    if(originX !=null && destinationY != null ){
        origin = originX.toLowerCase();
        destination = destinationY.toLowerCase();
    }

        
    if(service == 0){
        var speechOutput = "please first select your service: \n 2 - Metro de Lisboa \n 3 - CP \n Say the number"
        var repromptText = speechOutput
        var header = "invalid service"

    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
        if(parseInt(stations[destination].agency_id) != parseInt(service) || parseInt(stations[origin].agency_id) != parseInt(service)){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another start station and way or change the service"
            var header = "invalid way"
        } else if (!stations[destination]){
            var speechOutput = "that way isn't in that route. Try asking another one"
            var repromptText = "try asking about another start station and way"
            var header = "invalid way"
        } else if (!stations[origin]){
            var speechOutput = "that station isn't in that route."
            var repromptText = "try asking about another start station"
            var header = "invalid start station"
        } else if (origin == destination){
            var speechOutput = "that station and way is the same."
            var repromptText = "try asking about another start station and"
            var header = "invalid start station is the same end way"
        } else {
            var nameO = stations[origin].name 
            var nameD = stations[destination].name 
            var idO = stations[origin].stop_id
            var idD = stations[destination].stop_id
            var time ="";

       


            var horas = horario(idO, idD);
        
            var k = 0;
            while (k != horas.length){
                var time = time + horas[k] + "\n"
                var k = Number(k) + 1
            }
        
            var speechOutput =  capitalizeFirst(nameO) +  " " +"next trains to " + capitalizeFirst(nameD) + " are:\n" + time  + "\n for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"

            //procura dos proximos horarios dada uma estação e sentido, query sobre o GTFS 

            var repromptText = "for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
            var header = capitalizeFirst(nameO) + " " +  capitalizeFirst(nameD)
        }
    }

    origin = []
    destination = []

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleListResponse(intent, session, callback){
    var originX = intent.slots.Origin.value
    var destinationY = intent.slots.Destination.value

    
    if(originX !=null && destinationY != null ){
        origin = originX.toLowerCase();
        destination = destinationY.toLowerCase();
    }


   if(service == 0){
        var speechOutput = "please first select your service: \n 2 - Metro de Lisboa \n 3 - CP \n Say the number"
        var repromptText = speechOutput
        var header = "invalid service"
    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
        if(parseInt(stations[destination].agency_id) != parseInt(service) || parseInt(stations[origin].agency_id) != parseInt(service)){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another start station and way or change the service"
            var header = "invalid way"
        } else if (!stations[destination]){
            var speechOutput = "that way isn't in that route. Try asking another one"
            var repromptText = "try asking about another start station and way"
            var header = "invalid way"
        } else if (!stations[origin]){
            var speechOutput = "that station isn't in that route."
            var repromptText = "try asking about another start station"
            var header = "invalid start station"
        } else if (origin == destination){
            var speechOutput = "that station and way is the same."
            var repromptText = "try asking about another start station and"
            var header = "invalid start station is the same end way"
        } else {
            var nameO = stations[origin].name 
            var nameD = stations[destination].name 
            var idO = stations[origin].stop_id
            var idD = stations[destination].stop_id
            var stp = ""
            var paragens = nextSops(idO, idD);
            var k = 0;
            while (k != paragens.length){
                var stp = stp + paragens[k] + "\n"
                var k = Number(k) + 1
            }
        

            var speechOutput = capitalizeFirst(nameO) + " next stops to " + capitalizeFirst(nameD) + " are: \n" + stp + "\n for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"


            var repromptText = "for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
            var header = capitalizeFirst(nameO) + " next stops to " + capitalizeFirst(nameD)
        }
    }
    

    var shouldEndSession = false
    origin = []
    destination = []

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}



function handleTripListResponse(intent, session, callback){
    var originX = intent.slots.Origin.value
    var destinationY = intent.slots.Destination.value

    
    if(originX !=null && destinationY != null ){
        origin = originX.toLowerCase();
        destination = destinationY.toLowerCase();
    }

        
    if(service == 0){
        var speechOutput = "please first select your service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
        var repromptText = speechOutput
        var header = "invalid service"

    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
        if(parseInt(stations[destination].agency_id) != parseInt(service) || parseInt(stations[origin].agency_id) != parseInt(service)){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another start station and way or change the service"
            var header = "invalid way"
        } else if (!stations[destination]){
            var speechOutput = "that way isn't in that route. Try asking another one"
            var repromptText = "try asking about another start station and way"
            var header = "invalid way"
        } else if (!stations[origin]){
            var speechOutput = "that station isn't in that route."
            var repromptText = "try asking about another start station"
            var header = "invalid start station"
        } else if (origin == destination){
            var speechOutput = "that station and way is the same."
            var repromptText = "try asking about another start station and"
            var header = "invalid start station is the same end way"
        } else {
            var nameO = stations[origin].name 
            var nameD = stations[destination].name 
            var idO = stations[origin].stop_id
            var idD = stations[destination].stop_id
            var time ="";
            var horas = horario(idO, idD);
            var k = 0;
            while (k != horas.length){
                var time = time + horas[k] + "\n"
                var k = Number(k) + 1
            }

            var stp = ""
            var paragens = nextSops(idO, idD);
            var k = 0;
            while (k != paragens.length){
                var stp = stp + paragens[k] + "\n"
                var k = Number(k) + 1
            }
        
            var speechOutput =  capitalizeFirst(nameO) +  " " +"next trains to " + capitalizeFirst(nameD) + " are:\n" + time + ".\n And next stop stations are: \n" + stp + "\n" + "for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"

            //procura dos proximos horarios dada uma estação e sentido, query sobre o GTFS 

            var repromptText = "for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
            var header = capitalizeFirst(nameO) + " " +  capitalizeFirst(nameD)
        }
    }

    origin = []
    destination = []

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleServicesHelpResponse(intent, session, callback){

    var speechOutput = "The available services are: \n 2 - Metro de Lisboa \n 3 - CP. \n To choose one say the number."

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, speechOutput, shouldEndSession))
    //callback(session.attributes, buildSpeechletResponse("Services", "The available services are: \n 2 - Metro de Lisboa \n 3 - CP. \n To choose one say the number.", "The available services are: \n 2 - Metro de Lisboa \n 3 - CP. \n To choose one say the number.", false))
}

function handleYesResponse(intent, session, callback){
    var speechOutput = "Great! which way and start station?"
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, speechOutput, shouldEndSession))

}

function handleNoResponse(intent, session, callback){
    handleGetHelpRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "i can tell you a route from one origint to destination station\n anytime, first you can choose the service: \n2 - Metro de Lisboa, \n 3 - CP. \n  Next, choose origin and destination stations. \n In the end, schedule from origin or next stops until destination"

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



//TESTES
/*

function nomes(origem_id, destino_id){

var o = _.where(stops, {stop_id:  idCheck(origem_id)} );
var p = _.where(stops, {stop_id:  idCheck(destino_id) });

console.log(o[0].stop_name)
console.log(p[0].stop_name)
}

var origem_ida = 'M44';
var destino_ida = 'M46';


var origem_idc = "11060137";
var destino_idc = "11066050";

var destino_ide = '11066050';
var origem_ide = '11060004';

var origem_idf = '11066076';
var destino_idf= '11060004';

var origem_id = stations["banana"].stop_id;
var destino_id = stations["peach"].stop_id;


nomes(origem_ida, destino_ida)
console.log(horario(origem_ida, destino_ida))
console.log(nextSops(origem_ida, destino_ida))
console.log("--------------------------------")
nomes(origem_idc, destino_idc)
console.log(horario(origem_idc, destino_idc))
console.log(nextSops(origem_idc, destino_idc))
nomes(origem_ide, destino_ide)
console.log(horario(origem_ide, destino_ide))
console.log(nextSops(origem_ide, destino_ide))
console.log("--------------------------------")
nomes(origem_idf, destino_idf)
console.log(horario(origem_idf, destino_idf))
console.log(nextSops(origem_idf, destino_idf))
console.log("--------------------------------")
nomes(origem_id, destino_id)
console.log(horario(origem_id, destino_id))
console.log(nextSops(origem_id, destino_id))*/
