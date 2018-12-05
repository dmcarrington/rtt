/*https://api.rtt.io/api/v1/json/service/P83002/2018/12/05
https://api.rtt.io/api/v1/json/service/P83020/2018/12/05
Username: rttapi_david.carrington
Password: 

https://username:password@endpoint

*/

const https = require('https');
const http = require('http');

const username = "rttapi_david.carrington";
const password = "";

var train1 = "https://" + username + ':' + password + "@api.rtt.io/api/v1/json/service/P83002/2018/12/05";
var train2 = "https://" + username + ':' + password + "@api.rtt.io/api/v1/json/service/P83020/2018/12/05";


'use strict';
var request = require('request');

function getJson(url){
    return new Promise(function(resolve, reject) {
        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
            console.log('Error:', err);
            reject(err);
            } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            reject(res);
            } else {
            // data is already parsed as JSON:
            //console.log(data);
            resolve(data);
            }
        });
    });
}

const homeStn = 'WOS';
const workStn = 'BHM';

function getLateness(origin, destination, data)
{
    let haveOrigin = false;
    let haveDestination = false;
    for(ii = 0; ii < data.locations.length; ii++){
        if(data.locations[ii].crs === origin) {
            haveOrigin = true;
            const time = data.locations[ii].realtimeDeparture;
            const lateness = data.locations[ii].realtimeGbttDepartureLateness;
            console.log("Departed " + origin + " at " + time + " (" + lateness + ") mins late");
        } else if(data.locations[ii].crs === destination) {
            haveDestination = true;
            const time = data.locations[ii].realtimeArrival;
            const lateness = data.locations[ii].realtimeGbttArrivalLateness;
            console.log("Arrived " + destination + " at " + time + " (" + lateness + ") mins late");
        }
    }
    if(haveOrigin == false) {
        console.log("Origin station " + origin + " not present!");
    }
    if(haveDestination == false) {
        console.log("Destination station " + destination + " not present!");
    }
}

getJson(train1).then(function(data){
    getLateness(homeStn, workStn, data);

});

getJson(train2).then(function(data){
    getLateness(workStn, homeStn, data);
})
