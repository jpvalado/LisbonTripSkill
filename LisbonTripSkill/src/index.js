/*****************************************************************************/
//
// Summer Internship at Link Consulting
// Skills development -  Amazon Alexa
// Joao Rodrigues
// July - September 2017
//
// Skill Source Code
/*****************************************************************************/

/***************Libraries*****************/ 
var Alexa = require('alexa-sdk');
var _ = require('underscore');
var dateFormat = require('dateformat');
const durastamp = require('time-funcs/durastamp');
const timestamp = require('time-funcs/timestamp');
const removeAccents = require('remove-accents-diacritics');
var TimeFormat = require('hh-mm-ss');
var fs = require('fs');


/****************Variables*****************/ 

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

var origin_name = "";
var destination_name = "";
var possibleNames = [];

/******************Functions******************/ 


//function to load data for selected service
function data(agency_nr){
    
    /*if (agency_nr == 1){

    }else */ if (agency_nr == 2){
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
    }/*else if (agency_nr == 4){
        agency = JSON.parse(fs.readFileSync('data/Transtejo/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Transtejo/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Transtejo/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Transtejo/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Transtejo/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Transtejo/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Transtejo/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Transtejo/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Transtejo/trips.json','utf8'));
    }*/ else if (agency_nr == 13){
        agency = JSON.parse(fs.readFileSync('data/Fertagus/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Fertagus/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Fertagus/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Fertagus/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Fertagus/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Fertagus/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Fertagus/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Fertagus/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Fertagus/trips.json','utf8'));
    }/*else if (agency_nr == 14){
        agency = JSON.parse(fs.readFileSync('data/Soflusa/agency.json','utf8'));
        calendar = JSON.parse(fs.readFileSync('data/Soflusa/calendar.json','utf8'));
        calendar_dates = JSON.parse(fs.readFileSync('data/Soflusa/calendar_dates.json','utf8'));
        frequencies = JSON.parse(fs.readFileSync('data/Soflusa/frequencies.json','utf8'));
        routes = JSON.parse(fs.readFileSync('data/Soflusa/routes.json','utf8'));
        shapes = JSON.parse(fs.readFileSync('data/Soflusa/shapes.json','utf8'));
        stop_times = JSON.parse(fs.readFileSync('data/Soflusa/stop_times.json','utf8'));
        stops = JSON.parse(fs.readFileSync('data/Soflusa/stops.json','utf8'));
        trips = JSON.parse(fs.readFileSync('data/Soflusa/trips.json','utf8'));
    }*/
}


//var srvlist = "\n 2 - Metro de Lisboa. \n 3 - CP. \n 4 - Transtejo. \n 13 - Fertagus. \n 14 - Soflusa.\n";
var srvlist = "\n 2 - Metro de Lisboa. \n 3 - CP. \n 13 - Fertagus.\n"


//function to set origin and departure stops
function initSt2(origi, destinatio){
    ori = _.where(stops, {stop_name: origi.toString()});
    dest = _.where(stops, {stop_name: destinatio.toString()});
    
    
    nameO = ori[0].stop_name;

    nameD = dest[0].stop_name;

    idO =  ori[0].stop_id;
           
    idD = dest[0].stop_id;
    
    o = _.where(stops, {stop_id: idCheck(idO.toString())});
    d = _.where(stops, {stop_id: idCheck(idD.toString())});
}


//function to compare and save stations name with intial letter compatible with spoken nato letters
function natoCompare(a, b, c){

	var e;
    var f;
    var g;

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
}

//function to convert time to seconds
function seconds(time){
    var a = time.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
}


//function to convert string to data fromat
function convertData(dateString){    
    var year = dateString.substring(0,4);
    var month = dateString.substring(4,6);
    var day = dateString.substring(6,8);

    var date = new Date(year, month-1, day);


    return date;
}

//function to check date in interval
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

//function to check hours in interval
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


//function to check if string has only numbers and convert to integer
function idCheck(str){

    if (!str.match(/[a-z]/i)) {
        str = parseInt(str);
        return str;
    } 
    return str;
}


//function to calculate next avaliable times from origin to destination
function horario(origem_id, destino_id){


    var origem_id = idCheck(origem_id);
    var destino_id = idCheck(destino_id);
     

    var now = new Date();

    var time = dateFormat(now, "HH:MM:ss");
    var date = dateFormat(now, "yyyymmdd");
    var weekDay = dateFormat(now, "dddd").toLowerCase();

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = [];
    
    var i = 0;
    var j = 0;


    // found in origin and destination stops lists trips where both are consecutives and if trip is in valid date add to list trp
    while(i < trpOri.length){
        while(j < trpDest.length){
            if(_.isEqual(trpOri[i].trip_id, trpDest[j].trip_id) && Number(trpOri[i].stop_sequence) < Number(trpDest[j].stop_sequence)){

                var calnd = _.where(calendar, {service_id: parseInt(trpOri[i].trip_id)});
                var exc = _.where(calendar_dates, {service_id: parseInt(trpOri[i].trip_id), date: parseInt(date)});
                var validDate = dateCheck(convertData((calnd[0].start_date).toString()),convertData((calnd[0].end_date).toString()),convertData(date.toString()));

                if (  validDate == true &&  ((calnd[0][weekDay] == 1 && exc.length == 0) || (calnd[0][weekDay] == 0 && exc.length > 0))){

                    trp.push(trpOri[i]);
                }
                break;
            }

            j = j+1;
        }
        i = i+1;
        j = 0;
    }


    //set actual time to seconds
    var actual = seconds(time.toString());
    //set time interval to 1hour, 3600seconds
    var actualfim = actual + 3600;


    var horario = [];
    if (trp.length == 0){
        //
        //no tips, verification
        horario = [1];
    }
    else{

        var k = 0;
        while(k < trp.length){

            //
            // for existing trips, with start time, end time and actual time and actualfim time calculate next times from origin and add to horario

            var inicio = seconds(trp[k].arrival_time);
            var tripId = parseInt(trp[k].trip_id);
        
            var freq = _.where(frequencies, {trip_id: tripId});

          
                if (freq.length > 0){
                    var step = Number(freq[0].headway_secs);

                    var end = Number(seconds(freq[0].end_time));
                    var start = Number(seconds(freq[0].start_time));

                    if( start <= actual && actual <= end + step){
                        var next = inicio;

                        while(next <= actualfim && next <= end + step){
                            next = next + step;

                            if (next>=actual){

                                var a = horacompare(TimeFormat.fromS(actual, 'hh:mm:ss'), TimeFormat.fromS(actualfim, 'hh:mm:ss'), TimeFormat.fromS(next, 'hh:mm:ss'));
                                if(a != null){ 
                                    horario.push(a);    
                                }
                            }
                        }
                    }
                }

                else if (inicio >=actual){
                    var a = horacompare(TimeFormat.fromS(actual, 'hh:mm:ss'), TimeFormat.fromS(actualfim, 'hh:mm:ss'), TimeFormat.fromS(inicio, 'hh:mm:ss'));
                    if(a != null){
                        horario.push(a);    
                    }
                }
            k = k+1 
        }
    }

    //resonse
    
    return(_.sortBy(horario));
}


//function to check next stops from origin to destination
function nextSops(origem_id, destino_id){

    var origem_id = idCheck(origem_id);
    var destino_id = idCheck(destino_id);

    

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = [];

    var paragens = [];
    
   
    
    var i = 0;
    var j = 0;


    // found in origin and destination stops lists trips where both are consecutives and add to list trp

    while(i < trpDest.length){
        while(j < trpOri.length){
            if(_.isEqual(trpOri[j].trip_id, trpDest[i].trip_id)){
                if(Number(trpOri[j].stop_sequence) < Number(trpDest[i].stop_sequence)){
                    trp.push(trpDest[i]);
                }
            }
               
            
            j = j+1;
        }
        i = i+1;
        j = 0;
    }


    if (trp.length == 0){
        //
        //no tips, verification
        paragens = [1];
    }

    else{

      
        var max = [];
        var i = 0;
        while(i < trp.length){

            // found trip where diference stop number origin destination is max
            if(max.length == 0){
                var max = trp[i];
            }

            else if(trp[i].stop_sequence > max.stop_sequence){
               var max = trp[i];
            }
            i = i + 1;
        }

    
        var tp_id =  max.trip_id;

        var min = _.where(stop_times, {trip_id: tp_id, stop_id: origem_id});

        var j = Number(min[0].stop_sequence);
    
        j= j +1;

        while(j < max.stop_sequence + 1){
            // for max diference stops number trip, add between stops to output, paragens
          var aux = _.where(stop_times, {trip_id: tp_id, stop_sequence: j});
          var par = _.where(stops, {stop_id: aux[0].stop_id});
          paragens.push(par[0].stop_name);

            j=j+1;

        }
    }

    //response
    return paragens;    
}




/********************************************/
 
//handlers groups defenition and registering
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for userid:session.attributes

    alexa.registerHandlers( handlers);
    alexa.execute();
};



//handlers for start new session
var handlers = {

  /*  'LaunchRequest': function () {
        this.emit('NewSession');
    },*/

     // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['service'] = 0;
    }
        
       
        this.attributes['lastMode'] = 'NORMAL'

        var speechOutput = "Welcome to Lisbon Trip Skill! I can tell you a route from a departure to arrival station.\n Please, first select the service:" + srvlist + "Say service's number"
        var repromptSpeech = "Please, first select the service: " + srvlist + "Say service's number"
        var header = "Lisbon Trip Skill"
        var imageObj = {} 

         this.emit(':askWithCard',  speechOutput, repromptSpeech, header, speechOutput, imageObj);
    },




    //handler to select service or statin if has multiple options
    'ServiceIntent': function () {

        if (this.attributes['lastMode'] == 'NATO'){

            //
            // last state == "NATO" so select station


            // get selected number
            var nr = parseInt(this.event.request.intent.slots.Service.value);

            if (nr < 1 || nr > possibleNames.length + 1) {

                //
                // invalid selectd station 

            	var header = "unavailable station number"
	            var speechOutput = "Station number is unavailable. Try asking another one. \n"
                var i = 0;
                while(i<possibleNames.length){
                    speechOutput = speechOutput + " " + (i+1)  + " " + possibleNames[i] + "\n" 
                    i = i+1
                }
                speechOutput = speechOutput + "say the number."
                
            } else if(possibleNames.length == 0) {

                //
                // no stations found

	            var header = "unavailable stations"
	            var speechOutput = "Stations unavailable. Try asking another one or change the service."
	        } else if(origin_name.length == 0) {

                //
                // origin station selection

	            origin_name = possibleNames[nr-1];
	             this.attributes['origin_name'] = origin_name
	            var header = "Departure " + this.attributes['origin_name']
	            var speechOutput = "Your departure station is "+  this.attributes['origin_name'] + "\n Now, choose your arrival station. Say the first three letters using Nato Phonetic Alphabet."
	            possibleNames = []
                // set last mode to "NORMAL"
                this.attributes['lastMode'] = 'NORMAL'

	        } else if (destination_name.length == 0) {

                //
                // destination station selection

	            destination_name = possibleNames[nr-1];
	            this.attributes['destination_name'] = destination_name
	             var header = "Arrival " + this.attributes['destination_name']
	            var speechOutput = "Your arrival station is "+  this.attributes['destination_name']   + "\n Now, you want, next times from departure, or the stations until arrival, or both?"
	            origin = ["s"]
	            destination =  ["e"]
	            initSt2(this.attributes['origin_name'], this.attributes['destination_name'])
	              possibleNames = [];

                // set last mode to "NORMAL"
	            this.attributes['lastMode'] = 'NORMAL'

                
	        }
	        var repromptSpeech = speechOutput;
	        var imageObj = {};

            //emit the response

	        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  

        }

        else if (this.attributes['lastMode'] == 'NORMAL'){

            origin = [];
            destination = [];

            origin_name = "";
            destination_name = "";
            possibleNames = [];


            //
            // last state == "NORMAL" so select station

	        this.attributes['service'] = parseInt(this.event.request.intent.slots.Service.value);

	       

	        if (this.attributes['service'] == 2 || this.attributes['service'] == 3 || this.attributes['service'] == 13){

                //
                // select availiable service
	    
		        data(this.attributes['service']);
		        this.attributes['serviceName'] = _.where(agency, {agency_id: this.attributes['service']})[0].agency_name

		        var speechOutput = "You have choosen service number " + this.attributes['service'] + " " + this.attributes['serviceName'] + ".\n" + "Now, what is your departure station? Say the first three letters using Nato Phonetic Alphabet."
		        var repromptSpeech = "what is your arrival and departure stations?"
		        var header = "You choosen service number " + this.attributes['service'] + " " + this.attributes['serviceName']
	    	}

	    	 else{

                //
                // invalid service service
	        	var speechOutput = "Invalid service number. " + "Available services are:" + srvlist + "Say service's number";
	        	var repromptSpeech = "Invalid service number";
	        	var header = "Invalid service number";
	        }

	        var imageObj = {};

            //emit the response
	       
	        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);
	    }
    },
    
    //handler receive and compare Nato Phonetic Alphabet letter with service stations and give the matches
    NatoIntent : function () {
        //nato letters received 
        var nato1 = this.event.request.intent.slots.NatoA.value.toString();
        var nato2 = this.event.request.intent.slots.NatoB.value.toString();
        var nato3 = this.event.request.intent.slots.NatoC.value.toString();

        var a = nato1.charAt(0).toUpperCase()
        var b = nato2.charAt(0).toUpperCase()
        var c = nato3.charAt(0).toUpperCase()

    
       

        if (this.attributes['service'] == 0){
            //
            //service existence virification
            var speechOutput = "please first select your service:" + srvlist + "Say service's number"
            var header = "invalid service"
        }

        else{
            
            
            if(origin_name != "" && destination_name != ""){
                //
                //garantee clean variables
                origin_name = "";
                destination_name = "";
                possibleNames = []
            }

            //match station names with nato letters
     
            natoCompare(a, b, c);



        
            if(possibleNames.length == 0){

                //
                // no stations found 
                var header = "unavailable stations"
                var speechOutput = "Stations unavailable. Try asking another one or change the service."
            } else if (possibleNames.length == 1){
                //
                // if only one name matches

                if(origin_name == ""){

                    //
                    // if name for departure

                    origin_name = possibleNames[0];
                    this.attributes['origin_name'] = origin_name
                     var header = "Departure " + this.attributes['origin_name']
                    var speechOutput = "Your departure station is "+ this.attributes['origin_name'] + ".\n Now, choose your arrival station. Say the first three letters using Nato Phonetic Alphabet."
                    possibleNames = []
                } else if (destination_name == ""){
                    //
                    // if name for arrival
                    destination_name = possibleNames[0];
                    this.attributes['destination_name'] = destination_name
                    var header = "Arrival " + this.attributes['destination_name']
                    var speechOutput = "Your arrival station is "+ this.attributes['destination_name']  +  ".\n Now, you want, next times from departure, or the stations until arrival, or both?"
                    origin = ["s"]
                    destination =  ["e"]
                 
                    // Load Departure and Arrival stops
                    initSt2(this.attributes['origin_name'], this.attributes['destination_name']) 

                    possibleNames = [];


                    // set last mode to "NORMAL"
                    this.attributes['lastMode'] = 'NORMAL'

                     
                }
            } else {

                //
                // more than one name matches

                var speechOutput = ""
                var i = 0;
                while(i<possibleNames.length){
                    //
                    // create output information
                    speechOutput = speechOutput + " " + (i+1)  + " " + possibleNames[i] + "\n" 
                    i = i+1
                }

                speechOutput = speechOutput + "choose the station number"


                //select origin or destination to set station 

                if(origin_name == ""){
                    var header = "choose your departure station"
                } else if (destination_name == ""){
                    var header = "choose your arrival station"
                }

                // set last mode to "NATO"
                this.attributes['lastMode'] = 'NATO';

                //this.handler.state = states.SELECTMODE; 
            }
        }

        
        var repromptSpeech = speechOutput;
        var imageObj = {};


        //emit response
       
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },





    //handler to invoke function to calculate next times from origin to destinantion stop
    'TripIntent' : function () {


       if(this.attributes['service'] == 0){
            //
            //service existence virification
            var speechOutput = "please first select your service:" + srvlist + "Say service's number"
            var repromptSpeech = speechOutput
            var header = "invalid service"
        } else if(destination.length == 0 && origin.length == 0){
            //
            //departure and arrival existence virification
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and arrival"
        }
        else{
            
            if( o.length == 0 || d.length == 0){
                //
                //available routes verifications
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            }  else if (origin == destination){
                //
                //same arrival and destination verification
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and arrival"
                var header = "invalid start station is the same end way"
            } else {
             
                var time ="";

                //invoke function to calculate next times 
                var horas = horario(idO.toString(), idD.toString());

                if (horas[0] == 1){
                    //
                    //times existence verification
                    var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                    var header = "No routes available"
                }

                else{
            
                    var k = 0;
                    while (k != horas.length){
                        //
                        // format times to output
                        var time = time + horas[k] + "\n"
                        var k = Number(k) + 1
                    }
            
                    var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time  + "\n for other route tell me the departure and arrival, or change the service:" + srvlist + "Say service's number"


                    var header = nameO.toUpperCase() + " to " +  nameD.toUpperCase() + " schedule."
                }

                var repromptSpeech = "for other route tell me the departure and arrival, or change the service:" + srvlist + "Say service's number";
            }
        }

        //reset variables
        origin = []
        destination = []
        var imageObj = {};

       

        //return information
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  

    },


    //handler to invoke function to calculate next stops from origin to destinantion stop
    'ListIntent' : function () {
        if(this.attributes['service'] == 0){
            //
            //service existence virification
            var speechOutput = "please first select your service:" + srvlist + "Say service's number"
            var repromptSpeech = speechOutput
            var header = "invalid service"
        } else if(destination.length == 0 && origin.length == 0){
            //
            //departure and arrival existence virification
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and arrival"
        }
        else{
           
           if( o.length == 0 || d.length == 0){
                //
                //available routes verifications
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            } else if (origin == destination){
                 //
                //same arrival and destination verification
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and arrival"
                var header = "invalid start station is the same end way"
            } else {
               

                var stp = ""

                //invoke function to check nest stops
                var paragens = nextSops(idO.toString(), idD.toString());

                if (paragens[0] == 1){
                    //
                    //stops existence verification
                    var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                    var header = "No routes available"
                }

                else{

                    var k = 0;
                    while (k != paragens.length){
                        //
                        // format stops to output
                        var stp = stp + paragens[k].toUpperCase() + "\n"
                        var k = Number(k) + 1
                    }
            

                    var speechOutput = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase() + " are: \n" + stp + "\n for other route tell me the departure and arrival, or change the service:" + srvlist + "Say service's number"


                    var header = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase()
                }

                var repromptSpeech = "for other route tell me the departure and arrival, or change the service:" + srvlist + "Say service's number"
            }
        }
    

        //Reset Variables
        origin = []
        destination = []

        var imageObj = {};

        //return nesponse
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },


    //handler to invoke functions to calculate next times and stops from origin to destinantion stop
    'TripListIntent' : function () {
        if(this.attributes['service'] == 0){
            //
            //service existence virification
            var speechOutput = "please first select your service:" + srvlist + "Say service's number"
            var repromptSpeech = speechOutput
            var header = "invalid service"

        } else if(destination.length == 0 && origin.length == 0){
            //
            //departure and arrival existence virification
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and destination"
        }
        else{
            
           if( o.length == 0 || d.length == 0){
                //
                //available routes verifications
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            } else if (origin == destination){
                //
                //same arrival and destination verification
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and destination"
                var header = "invalid start station is the same end way"
            } else {
                
               
                var time ="";

                //invoke function to calculate next times 
                var horas = horario(idO.toString(), idD.toString());

                if (horas[0] == 1){
                    //
                    //times existence verification
                    var speechOutput =  "No routes available between your stations " + nameO.toUpperCase() + " and " +  nameD.toUpperCase()
                    var header = "No routes available"
                }

                else{


                    var k = 0;
                    while (k != horas.length){
                         //
                        // format times to output
                        var time = time + horas[k] + ".\n"
                        var k = Number(k) + 1
                    }

                    var stp = ""
                    var paragens = nextSops(idO.toString(), idD.toString());
                    var k = 0;
                    while (k != paragens.length){
                        //
                        // format stops to output
                        var stp = stp + paragens[k].toUpperCase() + ".\n"
                        var k = Number(k) + 1
                    }
            
                    var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time + "\n And next stop stations are: \n" + stp + "\n" + "for other route tell me the departure and arrival, or change the service:" +  srvlist + "Say service's number"
                    var header = nameO.toUpperCase() + " to " +  nameD.toUpperCase() + " schedule and stops."
                }
                var repromptSpeech = "for other route tell me the departure and destination, or change the service:" + srvlist + "Say service's number";
            }
        }

        //reset variables
        origin = []
        destination = []

        var imageObj = {};


        //return response
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },


   //handler to return information when the system don t understand
    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },

    //handler to ask help
    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

     
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    //handler to cancel and restar skill
    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },

    //handler to stop and restar skill
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    }, 


     'Presentation': function () {    
        var speechOutput = "Hello.\n" + 
"My name is Alexa and I'll be presenting the results of João Rodrigues's summer internship at Link Consulting. The objective of his work was to create a virtual assistant from available transit open data, General Transit Feed Specification - GTFS, that could be usable on a non-supported language. The chosen platform, Amazon’s Alexa, only supports English (United States and United Kingdom) and German, so as expected using it with Portuguese train stations was a challenge. Other objectives included getting acquainted with the capabilities and limitations of this virtual assistant, architectural models, session management and the business models that will drive these implementations.\n"+
"From the first tests it was clear that presently Alexa had an hard time recognizing Portuguese names, getting less than 5 pwe hit rate, so I’ve decided to try out the NATO Phonetic Alphabet on Alexa. This alphabet, first introduced in the military but now present in many other areas, is used to disambiguate letters over a voice communication channel. The results: over 95% hit rate, which I’d say is an interesting result for non-English speakers.\n"+
"The chosen scenario exposes Lisbon public transportation operators timetables as a virtual assistant, allowing someone with an Amazon Echo to ask for the next train stops while having breakfast.\n"+

"Let’s give it a try:";
        var repromptSpeech = speechOutput;

     
        this.emit(':tell', speechOutput, repromptSpeech); 
    },
    'Conclusion': function () {    
        var speechOutput = "This virtual assistants, although still recent, have great potential and applications, from answering trivial questions to more complex scenarios like shopping and home automation. The Alexa development environment proved very simple to use and without costs for the developer.\n"+
"The lack of support for Portuguese language was successfully circumvented by using NATO Phonetic Alphabet, though is more likely for a British or an American to know such an alphabet than for a Portuguese.\n"+
"Session management was simple to implement, though maintaining a conversation context over this session was somehow challenging as Alexa doesn’t provide native conversation support for it, leaving this responsibility to the developer.\n"+
"Regarding business model Amazon is trying out a rewarding model for successful Skills to attract traffic to their ecosystem, so fill free to try your luck."

        var repromptSpeech = speechOutput;

     
        this.emit(':tell', speechOutput, repromptSpeech); 
    }
};







