var _ = require('underscore');
var dateFormat = require('dateformat');
const durastamp = require('time-funcs/durastamp')
const timestamp = require('time-funcs/timestamp')
const removeAccents = require('remove-accents-diacritics');
var TimeFormat = require('hh-mm-ss')
var fs = require('fs');



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

var ori;
var dest;
var nameO;
var nameD;
var idO;
var idD;
var o;
var d;

function data(agency_nr){
    
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
    }else if (agency_nr == 4){
        agency = JSON.parse(fs.readFileSync('data/Transtejo/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Transtejo/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Transtejo/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Transtejo/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Transtejo/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Transtejo/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Transtejo/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Transtejo/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Transtejo/trips.json','utf8'));
    }else if (agency_nr == 13){
        agency = JSON.parse(fs.readFileSync('data/Fertagus/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Fertagus/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Fertagus/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Fertagus/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Fertagus/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Fertagus/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Fertagus/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Fertagus/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Fertagus/trips.json','utf8'));
    }else if (agency_nr == 14){
        agency = JSON.parse(fs.readFileSync('data/Soflusa/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Soflusa/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Soflusa/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Soflusa/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Soflusa/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Soflusa/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Soflusa/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Soflusa/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Soflusa/trips.json','utf8'));
    }
}

var srvlist = "\n 2 - Metro de Lisboa \n 3 - CP \n 4 - Transtejo \n 13 - Fertagus \n 14 - Soflusa.\n"
//var srvlist = "\n 2 - Metro de Lisboa \n 3 - CP \n 13 - Fertagus.\n"

//porque não há PT-PT na alexa

var stations = JSON.parse(fs.readFileSync('data/stations_1.json','utf8'));


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
    } else if(intentName == "NatoIntent"){
        handleNato(intent, session, callback)
    } else if (intentName == "SelectIntent"){
        handleSelect(intent, session, callback)
   }  else if(intentName == "OriDestIntent"){
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



    var speechOutput = "Welcome Trip Skill! I can tell you a route from a origin station in one way.\n Please, first select the service:" + srvlist + "Say the number"

    var reprompt = "Please, first select the service: " + srvlist +"Say the number"
    
    var header = "Trip Skill"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function initSt(origin, destination){
        ori = _.where(stations, {id: parseInt(origin)})
        dest = _.where(stations, {id: parseInt(destination)})

        
        nameO = ori[0].stop_name
 
        nameD = dest[0].stop_name 

        idO =  ori[0].stop_id
               
        idD = dest[0].stop_id
        
        o = _.where(stops, {stop_id: idCheck(idO.toString())})
        d = _.where(stops, {stop_id: idCheck(idD.toString())})
}


function initSt2(origi, destinatio){
        ori = _.where(stops, {stop_name: origi.toString()})
        dest = _.where(stops, {stop_name: destinatio.toString()})
        
        
        nameO = ori[0].stop_name
 
        nameD = dest[0].stop_name 

        idO =  ori[0].stop_id
               
        idD = dest[0].stop_id
        
        o = _.where(stops, {stop_id: idCheck(idO.toString())})
        d = _.where(stops, {stop_id: idCheck(idD.toString())})
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

                var calnd = _.where(calendar, {service_id: parseInt(trpOri[i].trip_id)});
                var exc = _.where(calendar_dates, {service_id: parseInt(trpOri[i].trip_id), date: parseInt(date)});
                var validDate = dateCheck(convertData((calnd[0].start_date).toString()),convertData((calnd[0].end_date).toString()),convertData(date.toString()));

                if (  validDate == true &&  ((calnd[0][weekDay] == 1 && exc.length == 0) || (calnd[0][weekDay] == 0 && exc.length > 0))){

                    trp.push(trpOri[i])
                }
                break
            }

            j = j+1
        }
        i = i+1
        j = 0
    }


    var actual = seconds(time.toString());
    var actualfim = actual + 3600


    var horario = [];
    if (trp.length == 0){
        horario = [1]
    }
    else{

        var k = 0;
        while(k < trp.length){
            var inicio = seconds(trp[k].arrival_time);
            var tripId = parseInt(trp[k].trip_id);
        
            var freq = _.where(frequencies, {trip_id: tripId});

            /*var calnd = _.where(calendar, {service_id: parseInt(tripId)});
            var exc = _.where(calendar_dates, {service_id: parseInt(tripId), date: date});
            var validDate = dateCheck(convertData((calnd[0].start_date).toString()),convertData((calnd[0].end_date).toString()),convertData(date.toString()));

            if (  validDate == true &&  ((calnd[0][weekDay] == 1 && exc.length == 0) || (calnd[0][weekDay] == 0 && exc.length > 0))){*/

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
            //}

            k = k+1 
        }
    }
    
    return(_.sortBy(horario));
}



function nextSops(origem_id, destino_id){

    var origem_id = idCheck(origem_id)
    var destino_id = idCheck(destino_id)

    

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = []

    var paragens = []
    
   
    
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


    if (trp.length == 0){
        paragens = [1]
    }

    else{

      
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
    
        j= j +1

        while(j < max.stop_sequence + 1){
          var aux = _.where(stop_times, {trip_id: tp_id, stop_sequence: j})
          var par = _.where(stops, {stop_id: aux[0].stop_id})
          paragens.push(par[0].stop_name)

            j=j+1

        }
    }

    return paragens;    
}

var origin_name = "";
var destination_name = "";
var possibleNames = []

function handleServiceSelect(intent, session, callback){

    service = parseInt(intent.slots.Service.value)

    data(service)

    var name = _.where(agency, {agency_id: parseInt(service)})[0].agency_name
    
    var speechOutput = "You choose service number " + service + " " + name + ".\n" + "Now, what is your departure and arrival stations?"

    var repromptText = "what is your arrival and departure stations?"
    var header = "You choose service number " + service + " " + name
    
    origin_name = "";
    destination_name = "";
    possibleNames = []
    

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}



function handleNato(intent, session, callback){
    var nato1 = intent.slots.NatoA.value.toString();
    var nato2 = intent.slots.NatoB.value.toString();
    var nato3 = intent.slots.NatoC.value.toString();

    var a = nato1.charAt(0).toUpperCase()
    var b = nato2.charAt(0).toUpperCase()
    var c = nato3.charAt(0).toUpperCase()

    var e;
    var f;
    var g;
    
    if(origin_name != "" && destination_name != ""){
     origin_name = "";
     destination_name = "";
     possibleNames = []
    }

    var k = 0;
    while(k < stops.length){
        e =  stops[k].stop_name.charAt(0).toUpperCase()
        f =  stops[k].stop_name.charAt(1).toUpperCase()
        g =  stops[k].stop_name.charAt(2).toUpperCase()

        if (removeAccents.remove(a) == removeAccents.remove(e) && removeAccents.remove(b) == removeAccents.remove(f) && removeAccents.remove(c) == removeAccents.remove(g)){
            possibleNames.push(stops[k].stop_name)
        }
        k= k+1
    }

    if(possibleNames.length == 0){
        var header = "unavailable stations"
        var speechOutput = "Stations unavailable. Try asking another one or change the service."
    } else if (possibleNames.length == 1){
        if(origin_name == ""){
            origin_name = possibleNames[0];
            var header = "Departure"
            var speechOutput = "Your departeur station is "+ origin_name + "\n Now, choose your arrival station."
            possibleNames = []
        } else if (destination_name == ""){
            destination_name = possibleNames[0];
            var header = "Arrival"
            var speechOutput = "Your arrival station is "+ destination_name +  "\n Now, you want, next times from origin, or the stations until destination, or both?"
            origin = ["s"]
            destination =  ["e"]
             
            initSt2(origin_name, destination_name)
           
        }
    } else {

        var speechOutput = ""
        var i = 0;
        while(i<possibleNames.length){
            speechOutput = speechOutput + " " + (i+1)  + " " + possibleNames[i] + "\n" 
            i = i+1
        }

         speechOutput = speechOutput + "choose the station number"

         if(origin_name == ""){
            var header = "choose your departure station"
        } else if (destination_name == ""){
            var header = "choose your arrival station"
        }
         
    }

    var repromptText = speechOutput
    
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleSelect(intent, session, callback){
    var nr = intent.slots.Nr.value;

    if(possibleNames.length == 0){
        var header = "unavailable stations"
        var speechOutput = "Stations unavailable. Try asking another one or change the service."
    } else if(origin_name.length == 0){
        origin_name = possibleNames[nr-1];
        var header = "Departure"
        var speechOutput = "Your departeur station is "+ origin_name + "\n Now, choose your arrival station."
        possibleNames = []
    } else if (destination_name.length == 0){
        destination_name = possibleNames[nr-1];
        var header = "Arrival"
        var speechOutput = "Your arrival station is "+ destination_name   + "\n Now, you want, next times from origin, or the stations until destination, or both?"
        origin = ["s"]
        destination =  ["e"]
        initSt2(origin_name, destination_name)
        
    }

    var repromptText = speechOutput
    
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))

}


function handleOriDest(intent, session, callback){

    if(service == 0){
        var speechOutput = "please first select your service:" + srvlist + "Say the number"
        var repromptText = speechOutput
        var header = "invalid service"
    }
    else{

        origin = intent.slots.Origin.value
        destination = intent.slots.Destination.value

        initSt(origin, destination)
  
        if( o.length == 0 || d.length == 0){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another origin and destination station or change the service"
            var header = "invalid way"
        } else {
    
            var speechOutput = "Your origin station is " + nameO.toUpperCase() + " and destination station is " + nameD.toUpperCase() +".\n Now, you want, next times from origin, or the stations until destination, or both?"

            var repromptText = "You want, next times from origin, or the stations until destination, or both?"
            var header = "origin station is " + nameO.toUpperCase() + " and destination station is " + nameD.toUpperCase()
        }
    
    }

    
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))


}


function handleTripResponse(intent, session, callback){
    //function handleTripResponse(/*intent, session, callback*/){
   var originX = intent.slots.Origin.value
   var destinationY = intent.slots.Destination.value

    //var originX = 125
   //var destinationY = 126

     
    
    if(originX !=null && destinationY != null ){
        origin = originX;
        destination = destinationY;
        initSt(origin, destination)
    }


   if(service == 0){
        var speechOutput = "please first select your service:" + srvlist + "Say the number"
        var repromptText = speechOutput
        var header = "invalid service"
    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
        
        if( o.length == 0 || d.length == 0){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another origin and destination station or change the service"
            var header = "invalid way"
        }  else if (origin == destination){
            var speechOutput = "that origin and destination stations are the same.\ntry asking about another origin and destination"
            var repromptText = "try asking about another origin and destination"
            var header = "invalid start station is the same end way"
        } else {
         
            var time ="";

            var horas = horario(idO.toString(), idD.toString());

            if (horas[0] == 1){
                var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                var header = "No routes available"
            }

            else{
        
                var k = 0;
                while (k != horas.length){
                    var time = time + horas[k] + "\n"
                    var k = Number(k) + 1
                }
        
                var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time  + "\n for other route tell me the origin and destination, or change the service:" + srvlist + "Say the number"


                var header = nameO.toUpperCase() + " " +  nameD.toUpperCase()
            }
        }
    }

    origin = []
    destination = []


    var repromptText = "for other route tell me the origin and destination, or change the service:" + srvlist + "Say the number"
    var shouldEndSession = false
    //console.log(speechOutput)
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleListResponse(intent, session, callback){
    var originX = intent.slots.Origin.value
    var destinationY = intent.slots.Destination.value
    

    
    if(originX !=null && destinationY != null ){
        origin = originX;
        destination = destinationY;
        initSt(origin, destination)
    }


   if(service == 0){
        var speechOutput = "please first select your service:" + srvlist + "Say the number"
        var repromptText = speechOutput
        var header = "invalid service"
    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
       
       if( o.length == 0 || d.length == 0){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another origin and destination station or change the service"
            var header = "invalid way"
        } else if (origin == destination){
            var speechOutput = "that origin and destination stations are the same.\ntry asking about another origin and destination"
            var repromptText = "try asking about another origin and destination"
            var header = "invalid start station is the same end way"
        } else {
           

            var stp = ""
            var paragens = nextSops(idO.toString(), idD.toString());

            if (paragens[0] == 1){
                var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                var header = "No routes available"
            }

            else{

                var k = 0;
                while (k != paragens.length){
                    var stp = stp + paragens[k].toUpperCase() + "\n"
                    var k = Number(k) + 1
                }
        

                var speechOutput = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase() + " are: \n" + stp + "\n for other route tell me the origin and destination, or change the service:" + srvlist + "Say the number"


                var header = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase()
            }
        }
    }
    

    var repromptText = "for other route tell me the origin and destination, or change the service:" + srvlist + "Say the number"
    var shouldEndSession = false
    origin = []
    destination = []
  
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}



function handleTripListResponse(intent, session, callback){
    var originX = intent.slots.Origin.value
    var destinationY = intent.slots.Destination.value

    
    if(originX !=null && destinationY != null ){
        origin = originX;
        destination = destinationY;
        initSt(origin, destination)

    }

        
    if(service == 0){
        var speechOutput = "please first select your service:" + srvlist + "Say the number"
        var repromptText = speechOutput
        var header = "invalid service"

    } else if(destination.length == 0 && origin.length == 0){
        var speechOutput = "please first select your origin and destination stations"
        var repromptText = speechOutput
        var header = "invalid origin and destination"
    }
    else{
        
       if( o.length == 0 || d.length == 0){
            var speechOutput = "that way isn't in that service. Try asking another one or change the service."
            var repromptText = "try asking about another origin and destination station or change the service"
            var header = "invalid way"
        } else if (origin == destination){
            var speechOutput = "that origin and destination stations are the same.\ntry asking about another origin and destination"
            var repromptText = "try asking about another origin and destination"
            var header = "invalid start station is the same end way"
        } else {
            
           
            var time ="";
            var horas = horario(idO.toString(), idD.toString());

            if (horas[0] == 1){
                var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                var header = "No routes available"
            }

            else{


                var k = 0;
                while (k != horas.length){
                    var time = time + horas[k] + "\n"
                    var k = Number(k) + 1
                }

                var stp = ""
                var paragens = nextSops(idO.toString(), idD.toString());
                var k = 0;
                while (k != paragens.length){
                    var stp = stp + paragens[k].toUpperCase() + "\n"
                    var k = Number(k) + 1
                }
        
                var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time + ".\n And next stop stations are: \n" + stp + "\n" + "for other route tell me the origin and destination, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
                var header = nameO.toUpperCase() + " " +  nameD.toUpperCase()
            }
        }
    }

    origin = []
    destination = []
    var repromptText = "for other route tell me the origin and destination, or change the service:" + srvlist + "Say the number"
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleServicesHelpResponse(intent, session, callback){

    var speechOutput = "The available services are:" + srvlist + "To choose one say the number."

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

    var speechOutput = "i can tell you a route from one origint to destination station\n anytime, first you can choose the service:" + srvlist + "Next, choose origin and destination stations. \n In the end, schedule from origin or next stops until destination"

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

var origem_id = '11060046';
var destino_id = '11069260';

var origem_idg = '11017228';
var destino_idg= '11066076';

var origem_idh = 'T05';
var destino_idh= 'T04';
var origem_idi = 'T05';
var destino_idi= 'T08';


data(2)
nomes(origem_ida, destino_ida)
console.log(horario(origem_ida, destino_ida))
console.log(nextSops(origem_ida, destino_ida))
console.log("--------------------------------")
data(3)
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
console.log(nextSops(origem_id, destino_id))
data(13)
nomes(origem_idg, destino_idg)
console.log(horario(origem_idg, destino_idg))
console.log(nextSops(origem_idg, destino_idg))
data(04)
nomes(origem_idh, destino_idh)
console.log(horario(origem_idh, destino_idh))
console.log(nextSops(origem_idh, destino_idh))
nomes(origem_idi, destino_idi)
console.log(horario(origem_idi, destino_idi))
console.log(nextSops(origem_idi, destino_idi))
*/


/*

var ori = _.where(stations, {ID: 37})
var dest = _.where(stations, {ID: 40})

var nameO = ori[0].stop_name 
var nameD = dest[0].stop_name 

var idO =  ori[0].stop_id
var idD = dest[0].stop_id

console.log(ori)
console.log(dest)
console.log(nameO)
console.log(nameD)
console.log(idO)
console.log(idD) */
/*
data(3)
var name = _.where(agency, {agency_id: parseInt(service)})[0].agency_name

console.log(name)*/
//data(4)
//service = 4
//origin = 125
//destination = 126
//handleTripResponse(/*intent, session, callback*/)
/*data(3)
console.log(stops[20].stop_name)

var x = "ola"
console.log(x.charAt(0).toUpperCase())

var y = "Óle"
console.log(y.charAt(0).toUpperCase())

var z = x.charAt(0).toUpperCase()
console.log(z)

var w = y.charAt(0).toUpperCase()
console.log(w)

console.log(z == w)
*/


x = ""
console.log(x.length)
r="ola"
console.log(r.length)

var z = [1, 2, 3 ,4, 4]
console.log(z.length)
console.log(z)

z.length = 0
console.log(z.length)
console.log(z)
console.log(z == "")


var t = "ÇÓ"
var g = removeAccents.remove(t)
console.log(g)