#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <CameraWebServer.h>
#include <opencv2/opencv.hpp>
#include <esp_camera.h>
#include <EEPROM.h>
#include <WiFiClient.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#include <ESP_Mail_Client.h>

using namespace cv;

// Replace with your network credentials
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// Replace with your SMTP server details
const char* smtpServer = "smtp.gmail.com";
const char* smtpUsername = "your-email@gmail.com";
const char* smtpPassword = "your-email-password";
int smtpPort = 465;

// Replace with your sender and recipient email addresses
const char* senderEmail = "your-email@gmail.com";
const char* recipientEmail = "recipient-email@gmail.com";

// Replace with your MySQL database details
IPAddress serverIP(192.168.1.100);  // MySQL server IP address
int serverPort = 3306;                 // MySQL server port
const char* dbUser = "username";       // MySQL username
const char* dbPassword = "password";   // MySQL password
const char* dbName = "database_name";  // MySQL database name

// Create an instance of the server
AsyncWebServer server(80);

// Initialize cascade classifier for face detection
CascadeClassifier faceCascade;

// Initialize face recognizer
Ptr<FaceRecognizer> faceRecognizer;

// Initialize motion detection variables
Mat previousFrame;
bool motionDetected = false;

// Initialize email client
ESP_Mail_Client mailClient;

// Initialize MySQL objects
WiFiClient client;
MySQL_Connection conn((Client*)&client);

void setup() {
  // Initialize serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize SPIFFS (optional, used for serving files from the flash memory)
  if (!SPIFFS.begin()) {
    Serial.println("An error occurred while mounting SPIFFS");
    return;
  }

  // Load cascade classifier for face detection
  if (!faceCascade.load(SPIFFS, "/haarcascade_frontalface_default.xml")) {
    Serial.println("Failed to load face cascade classifier");
    return;
  }

  // Load trained face recognizer model
  faceRecognizer = LBPHFaceRecognizer::create();
  faceRecognizer->read(SPIFFS, "/recognizer_model.yml");

  // Initialize the camera
  if (!CameraWebServer::initialize()) {
    Serial.println("Camera initialization failed");
    return;
  }

  // Route for serving images with face recognition
  server.on("/image", HTTP_GET, handleImageRequest);

  // Route for video streaming
  server.on("/stream", HTTP_GET, handleVideoStream);

  // Route for capturing and saving an image
  server.on("/capture", HTTP_GET, handleCaptureRequest);

  // Route for serving the web interface
  server.on("/", HTTP_GET, [](AsyncWebServerRequest* request) {
    request->send(SPIFFS, "/index.html", "text/html");
  });

  // Start the server
  server.begin();

  // Connect to MySQL server
  if (conn.connect(serverIP, serverPort, dbUser, dbPassword)) {
    Serial.println("Connected to MySQL server");
  } else {
    Serial.println("MySQL connection failed");
  }

  // Initialize email client
  mailClient.server.connect(smtpServer, smtpPort);
  mailClient.login(smtpUsername, smtpPassword);
}

void loop() {
  // Handle client requests
  server.handleClient();

  // Detect motion
  detectMotion();

  // Send email notification if motion is detected
  if (motionDetected) {
    sendEmailNotification();
    motionDetected = false;
  }
}

void handleImageRequest(AsyncWebServerRequest* request) {
  // Perform authentication
  if (!isAuthenticated(request)) {
    request->send(401, "text/plain", "Authentication required");
    return;
  }

  // Capture a new image
  if (CameraWebServer::capture()) {
    // Load the captured image for face recognition
    Mat capturedImage = imread("/capt0000.jpg", IMREAD_GRAYSCALE);

    // Detect faces in the image
    std::vector<Rect> faces;
    faceCascade.detectMultiScale(capturedImage, faces);

    // Perform face recognition on detected faces
    for (const Rect& face : faces) {
      // Extract the face region
      Mat faceROI = capturedImage(face);

      // Resize face image for recognition (optional, based on your training data)
      Mat resizedFace;
      resize(faceROI, resizedFace, Size(100, 100));

      // Predict the label for the face
      int predictedLabel = faceRecognizer->predict(resizedFace);

      // Draw rectangle around the face
      rectangle(capturedImage, face, Scalar(0, 255, 0), 2);

      // Draw predicted label on the image
      putText(capturedImage, "Label: " + std::to_string(predictedLabel), Point(face.x, face.y - 10),
              FONT_HERSHEY_SIMPLEX, 0.9, Scalar(0, 255, 0), 2);

      // Save the recognized user ID to EEPROM
      EEPROM.write(eepromAddress, predictedLabel);
      EEPROM.commit();
    }

    // Save the modified image with face recognition results
    std::string filename = "/capt" + getTimestamp() + "_recognized.jpg";
    imwrite(filename, capturedImage);

    // Serve the modified image
    request->send(SPIFFS, filename.c_str(), "image/jpeg");
  } else {
    request->send(500, "text/plain", "Camera capture failed");
  }
}

void handleVideoStream(AsyncWebServerRequest* request) {
  // Perform authentication
  if (!isAuthenticated(request)) {
    request->send(401, "text/plain", "Authentication required");
    return;
  }

  // Set content type and stream video
  request->send(CameraWebServer::stream(), "multipart/x-mixed-replace; boundary=frame");
}

void handleCaptureRequest(AsyncWebServerRequest* request) {
  // Perform authentication
  if (!isAuthenticated(request)) {
    request->send(401, "text/plain", "Authentication required");
    return;
  }

  // Capture a new image
  if (CameraWebServer::capture()) {
    // Save the captured image with timestamp
    std::string filename = "/capt" + getTimestamp() + ".jpg";
    rename("/capt0000.jpg", filename.c_str());

    // Send response with the captured image filename
    request->send(200, "text/plain", filename);
  } else {
    request->send(500, "text/plain", "Camera capture failed");
  }
}

bool isAuthenticated(AsyncWebServerRequest* request) {
  // Check for basic authentication headers
  if (request->authenticate("admin", "password")) {
    return true;
  }

  return false;
}

String getTimestamp() {
  char timestamp[20];
  time_t now = time(nullptr);
  strftime(timestamp, sizeof(timestamp), "%Y%m%d_%H%M%S", localtime(&now));
  return String(timestamp);
}

void detectMotion() {
  // Capture a new frame
  Mat currentFrame;
  if (!CameraWebServer::capture(currentFrame)) {
    Serial.println("Camera capture failed");
    return;
  }

  // Convert frame to grayscale
  Mat grayFrame;
  cvtColor(currentFrame, grayFrame, COLOR_BGR2GRAY);

  // Apply Gaussian blur to reduce noise
  GaussianBlur(grayFrame, grayFrame, Size(21, 21), 0);

  // If this is the first frame, initialize it
  if (previousFrame.empty()) {
    grayFrame.copyTo(previousFrame);
    return;
  }

  // Compute absolute difference between the current and previous frame
  Mat frameDiff;
  absdiff(previousFrame, grayFrame, frameDiff);

  // Apply threshold to detect motion
  Mat thresholdedDiff;
  threshold(frameDiff, thresholdedDiff, 30, 255, THRESH_BINARY);

  // Find contours of the thresholded difference
  std::vector<std::vector<Point>> contours;
  findContours(thresholdedDiff, contours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);

  // Check if motion is detected
  motionDetected = !contours.empty();

  // Update the previous frame
  grayFrame.copyTo(previousFrame);
}

void sendEmailNotification() {
  // Create email message
  String subject = "Motion Detected!";
  String message = "Motion has been detected.";

  // Send email
  ESP_Mail_Message email;
  email.subject = subject;
  email.message = message;
  email.sender = senderEmail;
  email.recepient = recipientEmail;
  email.cc = "";
  email.bcc = "";
  email.requestReceipt = false;

  mailClient.sendMail(email);

  Serial.println("Email notification sent");
}
