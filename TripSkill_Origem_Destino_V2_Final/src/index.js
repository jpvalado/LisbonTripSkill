
var Alexa = require('alexa-sdk');
var _ = require('underscore');
var dateFormat = require('dateformat');
const durastamp = require('time-funcs/durastamp');
const timestamp = require('time-funcs/timestamp');
const removeAccents = require('remove-accents-diacritics');
var TimeFormat = require('hh-mm-ss');
var fs = require('fs');


/********************************************/ 

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
var possibleNames2 = [];

function data(agency_nr){
    
    /* if (agency_nr == 1){

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
var srvlist = "\n 2 - Metro de Lisboa \n 3 - CP \n 13 - Fertagus.\n"


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


function seconds(time){
    var a = time.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
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
        str = parseInt(str);
        return str;
    } 
    return str;
}

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


    var actual = seconds(time.toString());
    var actualfim = actual + 3600;


    var horario = [];
    if (trp.length == 0){
        horario = [1];
    }
    else{

        var k = 0;
        while(k < trp.length){
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
    
    return(_.sortBy(horario));
}



function nextSops(origem_id, destino_id){

    var origem_id = idCheck(origem_id);
    var destino_id = idCheck(destino_id);

    

    var trpOri = _.where(stop_times, {stop_id: origem_id});
    var trpDest = _.where(stop_times, {stop_id: destino_id});

    var trp = [];

    var paragens = [];
    
   
    
    var i = 0;
    var j = 0;

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
        paragens = [1];
    }

    else{

      
        var max = [];
        var i = 0;
        while(i < trp.length){
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
          var aux = _.where(stop_times, {trip_id: tp_id, stop_sequence: j});
          var par = _.where(stops, {stop_id: aux[0].stop_id});
          paragens.push(par[0].stop_name);

            j=j+1;

        }
    }

    return paragens;    
}




/********************************************/
 

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for userid:session.attributes

    alexa.registerHandlers( newSessionHandlers, startModeHandlers, selectModeHandlers, selectMode2Handlers, endModeHandlers);
    alexa.execute();
};

var states = {
    STARTMODE: '_STARTMODE',
    SELECTMODE: '_SELECTMODE',
    SELECTMODE2: '_SELECTMODE2',
    ENDMODE: '_ENDMODE'
};



var newSessionHandlers = {

     // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
            this.attributes['service'] = 0;
        }
        this.handler.state = states.STARTMODE;

        var speechOutput = "Welcome Trip Skill! I can tell you a route from a departure to arrival station.\n Please, first select the service:" + srvlist + "Say the number"
        var repromptSpeech = "Please, first select the service: " + srvlist + "Say the number"
        var header = "Trip Skill"
        var imageObj = {} 

         this.emit(':askWithCard',  speechOutput, repromptSpeech, header, speechOutput, imageObj);
    },


    
    
    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },


    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    } 
};

var startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {

    'AllIntent': function () {


        if (this.event.request.intent.slots.Service.value != null){

            this.attributes['service'] = parseInt(this.event.request.intent.slots.Service.value);
    
            data(this.attributes['service']);
            this.attributes['serviceName'] = _.where(agency, {agency_id: this.attributes['service']})[0].agency_name
        }

        else if (this.attributes['service'] == 0){
            var speechOutput = "please first select your service:" + srvlist + "Say the number"
            var header = "invalid service"
        }

        else{
            if (this.event.request.intent.slots.ActionA.value == null && this.event.request.intent.slots.ActionB.value == null){
                this.attributes['action'] = 0;
            } else if (this.event.request.intent.slots.ActionA.value != null && this.event.request.intent.slots.ActionB.value == null){
                this.attributes['action'] = 1;
            } else if (this.event.request.intent.slots.ActionA.value == null && this.event.request.intent.slots.ActionB.value != null){
                this.attributes['action'] = 2;
            } else if (this.event.request.intent.slots.ActionA.value != null && this.event.request.intent.slots.ActionB.value != null){
                this.attributes['action'] = 3;
            }


            var nato1 = this.event.request.intent.slots.NatoA.value.toString();
            var nato2 = this.event.request.intent.slots.NatoB.value.toString();
            var nato3 = this.event.request.intent.slots.NatoC.value.toString();

            var a = nato1.charAt(0).toUpperCase()
            var b = nato2.charAt(0).toUpperCase()
            var c = nato3.charAt(0).toUpperCase()

            var e;
            var f;
            var g;

            var nato4 = this.event.request.intent.slots.NatoD.value.toString();
            var nato5 = this.event.request.intent.slots.NatoE.value.toString();
            var nato6 = this.event.request.intent.slots.NatoF.value.toString();

            var h = nato4.charAt(0).toUpperCase()
            var i = nato5.charAt(0).toUpperCase()
            var j = nato6.charAt(0).toUpperCase()

            var l;
            var m;
            var n;

            var k = 0;
            while(k < stops.length){
                e =  stops[k].stop_name.charAt(0).toUpperCase()
                f =  stops[k].stop_name.charAt(1).toUpperCase()
                g =  stops[k].stop_name.charAt(2).toUpperCase()

                l =  stops[k].stop_name.charAt(0).toUpperCase()
                m =  stops[k].stop_name.charAt(1).toUpperCase()
                n =  stops[k].stop_name.charAt(2).toUpperCase()

                if (removeAccents.remove(a) == removeAccents.remove(e) && 
                    removeAccents.remove(b) == removeAccents.remove(f) && removeAccents.remove(c) == removeAccents.remove(g)){
                    possibleNames.push(stops[k].stop_name)
                }

                if (removeAccents.remove(h) == removeAccents.remove(l) && 
                    removeAccents.remove(i) == removeAccents.remove(m) && removeAccents.remove(j) == removeAccents.remove(n)){
                    possibleNames2.push(stops[k].stop_name)
                } 

                k= k+1
            }

            if(possibleNames.length == 0 || possibleNames2.length == 0){
                var header = "unavailable stations"
                var speechOutput = "Stations unavailable. Try asking another one or change the service."
                var imageObj = {};
                this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);
            } 

            else{ 
                if (possibleNames.length == 1){
                    origin_name = possibleNames[0];
                    this.attributes['origin_name'] = origin_name;
                    possibleNames = [];
                    origin = ["s"];
                }

                else {
                    var speechOutput = ""
                    var p = 0;
                        while(p<possibleNames.length){
                            speechOutput = speechOutput + " " + (p+1)  + " " + possibleNames[p] + "\n" ;
                            p = p+1;
                        }

                    speechOutput = speechOutput + "choose the departure station number"
                    var header = "choose the departure station number"
                    var imageObj = {};
                    this.handler.state = states.SELECTMODE2;
                    this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);
                }

                if (possibleNames2.length == 1){
                    destination_name = possibleNames2[0];
                    destination =  ["e"];
                }
                else {

                    var speechOutput = ""
                    var p = 0;
                        while(p<possibleNames2.length){
                            speechOutput = speechOutput + " " + (p+1)  + " " + possibleNames2[p] + "\n"; 
                            p = p+1;
                        }

                    speechOutput = speechOutput + "choose the arrival station number"
                    var header = "choose the arrival station number"
                    var imageObj = {};
                    this.handler.state = states.SELECTMODE2; 
                    this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);
                }
            }


            if (destination[0] == "e" && origin[0] == "s"){
                initSt2(this.attributes['origin_name'], this.attributes['destination_name'])

                if (this.attributes['action'] == 0){
                    var speechOutput = "Your departure station is "+ this.attributes['origin_name'] + " arrival station is "+ this.attributes['destination_name']  +  ".\n Now, you want, next times from departure, or the stations until arrival, or both?"
                    
                    this.handler.state = states.ENDMODE; 
                    var imageObj = {};
                    this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);

                } else if (this.attributes['action'] == 1){
                     this.emit('TripIntent')

                } else if (this.attributes['action'] == 2){
                     this.emit('ListIntent')

                } else if (this.attributes['action'] == 3){
                     this.emit('TripListIntent')
                }
            }     
        }
    },
    

    'ServiceIntent': function () {
       
        this.attributes['service'] = parseInt(this.event.request.intent.slots.Service.value);
    
        data(this.attributes['service']);
        this.attributes['serviceName'] = _.where(agency, {agency_id: this.attributes['service']})[0].agency_name

        var speechOutput = "You have choosen service number " + this.attributes['service'] + " " + this.attributes['serviceName'] + ".\n" + "Now, what is your departure station? Say the first three letters using Nato Phonetic Alphabet."
        var repromptSpeech = "what is your arrival and departure stations?"
        var header = "You choosen service number " + this.attributes['service'] + " " + this.attributes['serviceName']
        var imageObj = {};
       
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);
    },
    

    NatoIntent : function () {

        var nato1 = this.event.request.intent.slots.NatoA.value.toString();
        var nato2 = this.event.request.intent.slots.NatoB.value.toString();
        var nato3 = this.event.request.intent.slots.NatoC.value.toString();

        var a = nato1.charAt(0).toUpperCase()
        var b = nato2.charAt(0).toUpperCase()
        var c = nato3.charAt(0).toUpperCase()

        var e;
        var f;
        var g;

        if (this.attributes['service'] == 0){
            var speechOutput = "please first select your service:" + srvlist + "Say the number"
            var header = "invalid service"
        }

        else{
    
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
                    this.attributes['origin_name'] = origin_name
                    var header = "Departure"
                    var speechOutput = "Your departure station is "+ this.attributes['origin_name'] + ".\n Now, choose your arrival station. Say the first three letters using Nato Phonetic Alphabet."
                    possibleNames = []
                } else if (destination_name == ""){
                    destination_name = possibleNames[0];
                    this.attributes['destination_name'] = destination_name
                    var header = "Arrival"
                    var speechOutput = "Your arrival station is "+ this.attributes['destination_name']  +  ".\n Now, you want, next times from departure, or the stations until arrival, or both?"
                    origin = ["s"]
                    destination =  ["e"]
                 
                    initSt2(this.attributes['origin_name'], this.attributes['destination_name']) 
                    this.handler.state = states.ENDMODE; 
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
                this.handler.state = states.SELECTMODE; 
            }
        }

        
        var repromptSpeech = speechOutput;
        var imageObj = {};
       
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },

    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },


    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    } 
});


var selectModeHandlers = Alexa.CreateStateHandler(states.SELECTMODE, {

    'SelectIntent' : function () {
        var nr = this.event.request.intent.slots.Nr.value;

        if(possibleNames.length == 0){
            var header = "unavailable stations"
            var speechOutput = "Stations unavailable. Try asking another one or change the service."
        } else if(origin_name.length == 0){
            origin_name = possibleNames[nr-1];
             this.attributes['origin_name'] = origin_name
            var header = "Departure"
            var speechOutput = "Your departure station is "+  this.attributes['origin_name'] + "\n Now, choose your arrival station. Say the first three letters using Nato Phonetic Alphabet."
            possibleNames = []
            this.handler.state = states.STARTMODE;
        } else if (destination_name.length == 0){
            destination_name = possibleNames[nr-1];
            this.attributes['destination_name'] = destination_name
            var header = "Arrival"
            var speechOutput = "Your arrival station is "+  this.attributes['destination_name']   + "\n Now, you want, next times from departure, or the stations until arrival, or both?"
            origin = ["s"]
            destination =  ["e"]
            initSt2(this.attributes['origin_name'], this.attributes['destination_name'])
            this.handler.state = states.ENDMODE;
        }
        var repromptSpeech = speechOutput;
        var imageObj = {};

        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  

    },

    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },


    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    } 
});



var selectMode2Handlers = Alexa.CreateStateHandler(states.SELECTMODE2, {

    'AllSelectIntent' : function () {
        var nr = this.event.request.intent.slots.Nr.value;


        if(possibleNames.length != 0){ 
            origin_name = possibleNames[nr-1];
            this.attributes['origin_name'] = origin_name
            possibleNames = [];
            origin = ["s"];

            if (possibleNames2.length != 0){
                speechOutput = speechOutput + "choose the arrival station number"
                var header = "choose the arrival station number"
                var imageObj = {};
                this.handler.state = states.SELECTMODE2; 
                this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);
            }
        }

        else if(possibleNames2.length != 0 && possibleNames.length == 0){
            destination_name = possibleNames2[nr-1];
            this.attributes['destination_name'] = destination_name
            possibleNames2 = [];
            destination_name = ["e"];
        }


        if (destination[0] == "e" && origin[0] == "s"){
            initSt2(this.attributes['origin_name'], this.attributes['destination_name'])

            if (this.attributes['action'] == 0){
                var speechOutput = "Your departure station is "+ this.attributes['origin_name'] + " arrival station is "+ this.attributes['destination_name']  +  ".\n Now, you want, next times from departure, or the stations until arrival, or both?"
                        
                this.handler.state = states.ENDMODE; 
                var imageObj = {};
                this.emit(':askWithCard', speechOutput, speechOutput, header, speechOutput, imageObj);

            } else if (this.attributes['action'] == 1){
                this.emit('TripIntent')
            } else if (this.attributes['action'] == 2){
                this.emit('ListIntent')
            } else if (this.attributes['action'] == 3){
                this.emit('TripListIntent')
            }
        }

    },

    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },


    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    } 
});



var endModeHandlers = Alexa.CreateStateHandler(states.ENDMODE, { 

 'TripIntent' : function () {


       if(this.attributes['service'] == 0){
            var speechOutput = "please first select your service:" + srvlist + "Say the number"
            var repromptSpeech = speechOutput
            var header = "invalid service"
        } else if(destination.length == 0 && origin.length == 0){
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and arrival"
        }
        else{
            
            if( o.length == 0 || d.length == 0){
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            }  else if (origin == destination){
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and arrival"
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
            
                    var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time  + "\n for other route tell me the departure and arrival, or change the service:" + srvlist + "Say the number"


                    var header = nameO.toUpperCase() + " to " +  nameD.toUpperCase()
                }

                var repromptSpeech = "for other route tell me the departure and arrival, or change the service:" + srvlist + "Say the number";
            }
        }

        origin = []
        destination = []


        var imageObj = {};
        this.handler.state = states.STARTMODE;
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  

    },

    'ListIntent' : function () {
        if(this.attributes['service'] == 0){
            var speechOutput = "please first select your service:" + srvlist + "Say the number"
            var repromptSpeech = speechOutput
            var header = "invalid service"
        } else if(destination.length == 0 && origin.length == 0){
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and arrival"
        }
        else{
           
           if( o.length == 0 || d.length == 0){
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            } else if (origin == destination){
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and arrival"
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
            

                    var speechOutput = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase() + " are: \n" + stp + "\n for other route tell me the departure and arrival, or change the service:" + srvlist + "Say the number"


                    var header = nameO.toUpperCase() + " next stops to " + nameD.toUpperCase()
                }

                var repromptSpeech = "for other route tell me the departure and arrival, or change the service:" + srvlist + "Say the number"
            }
        }
    

    
        origin = []
        destination = []

        var imageObj = {};
        this.handler.state = states.STARTMODE;
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },


    'TripListIntent' : function () {
        if(this.attributes['service'] == 0){
            var speechOutput = "please first select your service:" + srvlist + "Say the number"
            var repromptSpeech = speechOutput
            var header = "invalid service"

        } else if(destination.length == 0 && origin.length == 0){
            var speechOutput = "please first select your departure and arrival stations"
            var repromptSpeech = speechOutput
            var header = "invalid departure and destination"
        }
        else{
            
           if( o.length == 0 || d.length == 0){
                var speechOutput = "that way isn't in that service. Try asking another one or change the service."
                var repromptSpeech = "try asking about another departure and arrival station or change the service"
                var header = "invalid way"
            } else if (origin == destination){
                var speechOutput = "that departure and arrival stations are the same.\ntry asking about another departure and arrival"
                var repromptSpeech = "try asking about another departure and destination"
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
                        var time = time + horas[k] + ".\n"
                        var k = Number(k) + 1
                    }

                    var stp = ""
                    var paragens = nextSops(idO.toString(), idD.toString());
                    var k = 0;
                    while (k != paragens.length){
                        var stp = stp + paragens[k].toUpperCase() + ".\n"
                        var k = Number(k) + 1
                    }
            
                    var speechOutput =  nameO.toUpperCase() +  " " +"next trains to " + nameD.toUpperCase() + " are:\n" + time + "\n And next stop stations are: \n" + stp + "\n" + "for other route tell me the departure and arrival, or change the service: \n 2 - Metro de Lisboa \n 3 - CP. \n Say the number"
                    var header = nameO.toUpperCase() + " to " +  nameD.toUpperCase()
                }
                var repromptSpeech = "for other route tell me the departure and destination, or change the service:" + srvlist + "Say the number";
            }
        }

        origin = []
        destination = []

        var imageObj = {};
        this.handler.state = states.STARTMODE;
        this.emit(':askWithCard', speechOutput, repromptSpeech, header, speechOutput, imageObj);  
    },
    'Unhandled': function () {
        this.emit(':ask', 'I don\'t get it! Or the command is not supported!', 'I don\'t get it! Or the command is not supported!');
    },


    'AMAZON.HelpIntent': function () {    
        var speechOutput = "i can tell you a route from one departure to arrival station\n anytime, first you can choose the service:" + srvlist + "Next, choose departure and arrival stations. \n In the end, schedule from departure stations or next stops until arrival station";
        var repromptSpeech = speechOutput;

        this.handler.state = states.STARTMODE;
        this.emit(':ask', speechOutput, repromptSpeech); 
    },

    'AMAZON.CancelIntent': function () {
        this.emit('NewSession') 
    },
    'AMAZON.StopIntent': function () {
        this.emit('NewSession')  
    } 
});







