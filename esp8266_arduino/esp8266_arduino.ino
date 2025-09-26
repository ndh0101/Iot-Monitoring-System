#include <ESP8266WiFi.h>  // Quản lý kết nối WiFi cho ESP8266
#include <PubSubClient.h> // Thư viện MQTT cho ESP8266
#include <DHT.h>          // Thư viện cho cảm biến DHT11
#include <ArduinoJson.h>  // Xử lý dữ liệu JSON
#include <NTPClient.h>    // Cung cấp thời gian hiện tại từ NTP server
#include <WiFiUdp.h>
#include <ctime>

#define SSID "your-wifi-name"          // Tên mạng WiFi
#define PASSWORD "your-wifi-password"  // Mật khẩu WiFi
#define MQTT_SERVER "your-ip-address"  // Địa chỉ IP của MQTT Server
#define MQTT_PORT 1883                 // Cổng kết nối tới Mosquitto
#define mqtt_user "your-username"      // Username cài đặt trong Mosquitto
#define mqtt_pass "your-password"      // Password cài đặt trong Mosquitto

// Các chân GPIO trên ESP8266 được sử dụng
#define FAN D5
#define AIR D6
#define LAMP D7
#define DHTPIN D4
#define LDR A0
#define DHT_DELAY 2000                           // 2 giây đọc dữ liệu một lần

WiFiUDP ntpUDP;                                  // Đối tượng để nhận dữ liệu NTP.
WiFiClient espClient;                            // Đối tượng để quản lý kết nối WiFi.
PubSubClient mqttClient(espClient);              // Đối tượng để giao tiếp với MQTT broker.
DHT dht(DHTPIN, DHT11);                          // Đối tượng cảm biến DHT11.
NTPClient timeClient(ntpUDP, "vn.pool.ntp.org"); // Đối tượng NTPClient để lấy thời gian từ server.

int fan = LOW, air = LOW, lamp = LOW;             // Các biến trạng thái của đèn
int pre_fan = LOW, pre_air = LOW, pre_lamp = LOW; // Các biến lưu trạng thái trước của đèn
unsigned long startDhtTime = 0;                   // Thời điểm bắt đầu để thực hiện việc đọc dữ liệu từ cảm biến DHT11.

// Khởi tạo các chân GPIO và cảm biến DHT11
void setup_esp() {
  dht.begin();
  pinMode(FAN, OUTPUT);
  pinMode(AIR, OUTPUT);
  pinMode(LAMP, OUTPUT);
}
// Kết nối mạng Wifi và in ra thông tin kết nối
void setup_wifi() {
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.println(SSID);
  Serial.println(WiFi.localIP());
  Serial.println(MQTT_SERVER);
}
// Kết nối ESP8266 với MQTT broker và thiết lập callback
void setup_mqtt() {
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.connect("esp8266", mqtt_user, mqtt_pass);
  mqttClient.setCallback(data_sub);
}
// Khởi tạo, cấu hình TG với NTPClient, thiết lập múi giờ
void setup_time() {
  timeClient.begin();
  timeClient.setTimeOffset(7*3600);
}

// Xử lý dữ liệu nhận được từ MQTT broker
void data_sub(char *topic, byte *payload, unsigned int length) {
  if(strcmp(topic, "actionSub") == 0) {
    String data = "";
    for(int i=0; i<length; i++) {
      data += (char)payload[i];
    }
    action_sub(String(data));
  }
}

// Lấy thời gian từ NTPClient, định dạng theo chuỗi
String get_time() {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  time_t t = static_cast<time_t>(epochTime);
  struct tm *tm = localtime(&t);
  char buffer[20];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", tm);
  return String(buffer);
}

// Chuyển đổi dữ liệu JSON nhận được thành đối tượng DynamicJsonDocument
DynamicJsonDocument subJsonAction(String data) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, data.c_str());
  return doc;
}

// Tạo chuỗi JSON từ Sensor
String pubJsonSensorString(double h, double t, int l) {
  char buffer[10];
  DynamicJsonDocument sensor(1024);
//sensor["device_id"] = "DHT11";
  dtostrf(h, 4, 2, buffer);
  sensor["humidity"] = atof(buffer);
  dtostrf(t, 4, 2, buffer);
  sensor["temperature"] = atof(buffer);
  sensor["light"] = l;
  sensor["time"] = get_time();
  String ss;
  serializeJson(sensor, ss);
  return ss;
}

// Tạo chuỗi JSON cho Action
String pubJsonActionString(String device_id, String status) {
  DynamicJsonDocument actionDoc(1024);
  actionDoc["device_id"] = device_id;
  actionDoc["status"] = status;
  actionDoc["time"] = get_time();
  String as;
  serializeJson(actionDoc, as);
  return as;
}

// Cập nhật trạng thái thiết bị
void setState(String data, int &state) {
  if(data == "on") {
    state = HIGH;
  }
  if(data == "off") {
    state = LOW;
  }
}

// Cập nhật trạng thái của thiết bị và công bố trên MQTT
void setAction(String data, int pin, int state, int &preState) {
  if(state != preState) {
    digitalWrite(pin, state);
    preState = state;
    mqttClient.publish("actionPub", data.c_str());
  }
}

// Xử lý hành động từ dữ liệu nhận được
void action_sub(String data) {
  DynamicJsonDocument actionJson = subJsonAction(data);
  if (actionJson["device_id"] == "fan") {
    setState(actionJson["status"], fan);
    setAction(data, FAN, fan, pre_fan);
  }
  if (actionJson["device_id"] == "air") {
    setState(actionJson["status"], air);
    setAction(data, AIR, air, pre_air);
  }
  if (actionJson["device_id"] == "lamp") {
    setState(actionJson["status"], lamp);
    setAction(data, LAMP, lamp, pre_lamp);
  }
}

// Đọc dữ liệu từ cảm biến và gửi nó qua MQTT
void sensor_pub() {
  double h = dht.readHumidity();
  double t = dht.readTemperature();
  int l = 1024 - analogRead(LDR);
  String sensor = pubJsonSensorString(h, t, l);
  Serial.println(sensor);
  mqttClient.publish("sensorPub", sensor.c_str());
}

void setup() {
  Serial.begin(115200); // Khởi tạo giao tiếp Serial với tốc độ baud 115200
  setup_esp();          // Cấu hình chân GPIO và khởi tạo cảm biến DHT11
  randomSeed(micros()); // Khởi tạo seed cho hàm random() bằng giá trị micros() để tạo số ngẫu nhiên
  setup_wifi();         // Kết nối ESP8266 với mạng WiFi
  setup_mqtt();         // Kết nối ESP8266 với MQTT broker và thiết lập callback
  setup_time();         // Khởi tạo NTPClient để đồng bộ hóa thời gian
}
void loop() {
  unsigned long currentMillis = millis(); // Trả về số mili giây kể từ khi chương trình bắt đầu
  if(mqttClient.connected()){
    mqttClient.loop();                    // Giữ cho kết nối MQTT hoạt động và xử lý các tin nhắn đến
    mqttClient.subscribe("actionSub");    // Đăng ký để nhận các tin nhắn từ chủ đề actionSub
    if(currentMillis - startDhtTime >= DHT_DELAY) {
      startDhtTime = currentMillis;       // Kiểm tra nếu đã đến thời gian để |
      sensor_pub();                       // đọc dữ liệu từ cảm biến DHT11 và gửi dữ liệu qua MQTT
    }
  }
  else{
    setup_wifi();
    setup_mqtt();
    delay(1000);
  }
}
