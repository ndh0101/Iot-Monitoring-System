# IoT Monitoring System

A comprehensive IoT monitoring and control system using ESP32, featuring a modern web interface and powerful backend API with advanced NoSQL query capabilities.

## Table of Contents

-   [Overview](#overview)
-   [System Architecture](#system-architecture)
-   [Key Features](#key-features)
-   [Quick Start](#quick-start)
-   [Installation and Setup](#installation-and-setup)
-   [API Documentation](#api-documentation)
-   [Project Structure](#project-structure)
-   [Development](#development)
-   [Troubleshooting](#troubleshooting)
-   [Contributing](#contributing)
-   [License](#license)
-   [Support](#support)

## Overview

This project implements a complete IoT monitoring system including:

-   **Hardware**: ESP8266 device with DHT11 temperature/humidity sensor, light sensor, and 3 LED controls
-   **Backend**: API built with Express, MySQL, and MQTT integration
-   **Frontend**: Responsive web interface with real-time charts, data tables, and LED controls
-   **Communication**: MQTT protocol for real-time communication between ESP8266 and backend
-   **Advanced Features**: Data aggregation, time-based filtering, and comprehensive search

## System Architecture

```text
┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│  ESP8266 Device │            │     Backend     │            │    Frontend     │
│                 │            │   (ExpressJS)   │            │    (ReactJS)    │
│                 │    MQTT    │                 │    HTTP    │                 │
│ - DHT11 Sensor  │ ─────────► │ - MQTT Client   │ ◄───────── │ - Real-time UI  │
│ - LDR Sensor    │            │ - API           │            │ - Charts        │
│ - 3x LED Control│            │ - MySQL         │            │ - Data Tables   │
│ - WiFi + MQTT   │            │ - WebSocket     │            │ - LED Controls  │
└─────────────────┘            └─────────────────┘            └─────────────────┘
```

## Key Features

### Hardware (ESP8266)

-   **DHT11 Sensor**: Temperature and humidity readings
-   **Light Sensor**: Analog light sensor (Pin A0)
-   **LED Control**: 3 LEDs (Pins 5, 6, 7) with remote control
-   **WiFi Connectivity**: Automatic connection and reconnection
-   **MQTT Communication**: Secure connection to Mosquitto
-   **Real-time Data**: Sends sensor data every 2 second
-   **Action History**: Publishes LED status changes

### Backend

-   **API** (`/api/`) and Swagger documentation
-   **MQTT Integration**: Receives sensor data and publishes LED commands
-   **MySQL Database**: Stores sensor data and action history
-   **Real-time LED Control**: MQTT-based remote LED control
-   **Data Validation**: Comprehensive input validation and error handling
-   **Pagination & Filtering**: Advanced data filtering with time-based queries

### Frontend

-   **Dashboard Page**: Real-time sensor data, LED controls, and interactive charts
-   **Data Sensor Page**: Advanced data table with search, filtering, and pagination
-   **Action History Page**: LED control history with comprehensive filtering
-   **Profile Page**: User interface for system settings

## Quick Start

1. **Clone the repository**
2. **Set up the backend** (see [Backend Setup](#backend-setup))
3. **Configure the hardware** (see [Hardware Setup](#hardware-setup))
4. **Access the web interface** at `http://localhost:5173`

## Installation and Setup

### System Requirements

-   NodeJS installed
-   MySQL (local or cloud)
-   MQTT Broker (Mosquitto recommended)
-   ESP8266 development board
-   Arduino IDE with ESP8266 board package

### Backend Setup

1. **Clone repository and install dependencies:**

```bash
cd backend
npm install
```

2. **Configure environment variables:**
At file `mysql.common.js` in `backend/src/util` directory:

```mysql.common.js
# Database Configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot_data',
    port: 3306
});
```
At file `index.js` in `backend/src` directory:

```index.js
# MQTT Configuration (Mosquitto)
const options = {
    port: 1883,
    host: 'YOUR_IP_ADDRESS',
    clientId: 'webClient',
    username: 'YOUR_MQTT_USERNAME',
    password: 'YOUR_MQTT_PASSWORD'
};
```

3. **Run backend:**

```bash
node index.js
```

Backend will run at `http://localhost:8080`

**API Documentation**: Available at `http://localhost:8080/api-docs`

### Frontend Setup

1. **Clone repository and install dependencies:**

```bash
cd frontend
npm install
```

2. **Run frontend:**

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

### Hardware Setup

1. **Install Arduino IDE and ESP8266 board package**

2. **Hardware connections:**

```text
ESP8266 Pin Connections:
- DHT11: Pin D4
- Light Sensor: Pin A0
- LED1: Pin D5
- LED2: Pin D6
- LED3: Pin D7
```

3. **Configure WiFi and MQTT:**
   Edit parameters in [`esp8266_arduino/esp8266_arduino.ino`](esp8266_arduino/esp8266_arduino.ino) file:

```cpp
#define SSID "wifi-name"           // Tên mạng WiFi
#define PASSWORD "wifi-password"   // Mật khẩu WiFi
#define MQTT_SERVER "ip-address"   // Địa chỉ IP của MQTT Server
#define MQTT_PORT 1883             // Cổng kết nối tới Mosquitto
#define mqtt_user "username"       // Username cài đặt trong Mosquitto
#define mqtt_pass "password"       // Password cài đặt trong Mosquitto
```

4. **Upload code to ESP8266**

## API Documentation

Complete API documentation is available at `http://localhost:8080/api-docs` when the backend is running.

## Project Structure

```text
iot_application/
├── .gitignore
├── README.md
|
├── backend/
│   ├── package-lock.json
│   ├── package.json                                       # Node dependencies
|   ├── index.js                                           # Main file
|   ├── swagger.js                                         # Enable API Docs
│   └── src/
│       ├── controller/                                    # Blueprints
│       │   ├── action.controller.js
│       │   └── sensor.controller.js
│       ├── model/                                         # Configuration and database
│       │   ├── action.model.js
│       │   └── sensor.model.js
│       ├── route/                                         # Route configuration
│       │   ├── action.route.js
│       │   └── sensor.route.js
│       └── util/                                          # Business logic and queries
│           └── mysql.common.js
|
├── frontend/
│   ├── package-lock.json
│   ├── package.json                                       # Node dependencies
|   ├── index.html                                         # Main file
|   ├── vite.config.js                                     # Frontend configuration
│   └── src/
│       ├── documents/
│       │   └── avatar.jpg
│       ├── pages/                                         # Page loaders
│       │   ├── ActionHistory.jsx
│       │   ├── Dashboard.jsx
│       │   ├── DataSensor.jsx
│       │   └── Profile.jsx
│       ├── services/                                      # API services
│       │   ├── api.js
│       │   └── ws.js
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css                                     # CSS files
|
└── esp8266_arduino/
    └── esp8266_arduino.ino                                # ESP8266 code
```

## Development

### Backend Development

Backend uses ExpressJS with MVC architecture:

-   **Route** for API organization
-   **Util** for business logic
-   **Model** for data structures
-   **Controller** for configuration and utilities

### Frontend Development

Frontend uses ReactJS with modular architecture:

-   **Pages** display UI components
-   **Services** manage API communication
-   **Components** reusable UI elements

### Testing MQTT

Use mosquitto client to test MQTT:

```bash
# Subscribe to sensor data
mosquitto_sub -h your-ip-address -p 1883 -u username -P password -t sensorPub

# Subscribe to action history
mosquitto_sub -h your-ip-address -p 1883 -u username -P password -t actionPub

# Send LED control command
mosquitto_pub -h your-ip-address -p 1883 -u username -P password -t actionPub -m '{"fan","on"}'

# Send test sensor data
mosquitto_pub -h your-ip-address -p 1883 -u username -P password -t sensorPub -m '{"humidity":60.0,"temperature":25.0,"light":80.0}'
```

## Troubleshooting

### Common Issues

#### Hardware Issues

1. **ESP8266 cannot connect to WiFi:**

    - Check SSID and password in [`esp8266_arduino/esp8266_arduino.ino`](esp8266_arduino/esp8266_arduino.ino)
    - Ensure WiFi is on
    - Verify signal strength

2. **LED control not working:**
    - Check MQTT broker connection
    - Verify LED control topic subscription
    - Check ESP8266 MQTT client status

#### Backend Issues

3. **MQTT connection failed:**

    - Check broker host and port in `index.js` file
    - Verify username/password
    - Test with mosquitto client (see [Testing MQTT](#testing-mqtt))

4. **Backend not receiving data:**

    - Check MQTT broker connection
    - Verify topic names match configuration
    - Check MySQL connection

#### Frontend Issues

6. **Frontend not displaying data:**
    - Check browser console for errors
    - Verify API endpoints are accessible at `http://localhost:8080/api-docs`
    - Ensure backend is running on correct port

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

-   Follow the existing code structure and patterns
-   Add appropriate comments and documentation
-   Test your changes thoroughly
-   Ensure all existing tests pass

## License

This project is developed for educational and research purposes.

## Support

For support, questions, or contributions, please:

-   Create an issue on the GitHub repository
-   Check the [Troubleshooting](#troubleshooting) section first
-   Review the [API Documentation](http://localhost:8080/api-docs) when the backend is running
