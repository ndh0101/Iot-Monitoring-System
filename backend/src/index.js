const app = require('express')();
require('./route/action.route')(app);
require('./route/sensor.route')(app);
const setupSwagger = require('./swagger');
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    server: server
});
const Sensor = require('./model/sensor.model');
const Action = require('./model/action.model');
const mqtt = require('mqtt');
const options = {
    port: 1883,
    host: '192.168.1.14',
    clientId: 'webClient',
    username: 'Ost007',
    password: 'Hoang2004'
};
// Check connection to MQTT broker
const mqttClient = mqtt.connect(options);
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('sensorPub');
    mqttClient.subscribe('actionPub');
});
mqttClient.on('message', (topic, message) => {
    if (topic === 'sensorPub') {
        Sensor.insertData(JSON.parse(message.toString()), (result) =>{});
    }
    else if (topic === 'actionPub') {
        console.log('Client Receive: %s', message.toString());
        Action.insertData(JSON.parse(message.toString()), (result) =>{});
    }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
});
wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', (message) => {
        var data = JSON.parse(message); /* convert string to json */
        mqttClient.publish('actionSub', JSON.stringify(data)); /* convert json to string */
//      console.log('Client Publish: %s', data);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
server.listen(8080, () => console.log('HTTP + WS running on :8080'));
// setup swagger docs
setupSwagger(app);