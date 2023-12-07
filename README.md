# GET BETTER ATTENDANCE IN ROBOTICS CLUB TEJASSSSSSSSSSSSSSSSS

# Attendance
Attendance Application for the SBHS Computer Science Club

## Project Idea
The Computer Science Club is one of the largest clubs at SBHS, but we only have one scanner with which we can take attendance, making it quite a long and inefficient procedure. Making an app that allows all of the club's officers to be able to record attendance would improve things greatly.

## Planning
In order to plan for this project, I first created a Figma for how I envisioned the UI to look. After that, I looked into what I would use to make it. I chose React Native for the front end, as our officers have both iPhones and Android devices, so we would need something that would be cross compatible. Because all of our previous records were stored on Google Sheets, for the sake of consistency I decided to use an API that would allow me to use Google Sheets as the backend of the application, sheet.best.

Figma Link: https://www.figma.com/file/nDNvLO0Ui3uXc0toPVeQd1/CS-Club-Attendance?type=design&node-id=1-2&mode=design&t=FxOaiwyB5cLrYVJG-0

## Development
First, I created the UI using React Native and Expo. I included barcode scanning capabilities using the expo-barcode-scanner, and I also allowed for manually typing the ID number, in case members forgot their ID card. Then, I implemented the backend using Google Sheets and sheet.best. Doing some research, I realized quickly that we would most likely run over the amount of API calls allowed on the free tier of sheet.best, so I also implemented Google Cloud's own Sheets API for reading data from sheets. Next, in order to better organize the sheet, I created seperate sheets for each meeting date, and the application would use the current date to sort the data properly. In addition, I used SQL within Google Sheets in order to create a master sheet with all of the club's members and how much attendance they have earned.

## How the Application Works
First, the officer enters a password for security purposes. Then, they scan in the ID of a student. This ID is converted to a number using expo-barcode-scanner, and a google sheet with all students is queried to find the correlating student. Once the officer decides how much credit the student has earned, the application calls upon a REST API to write to a google sheet, and the google sheet updates all needed sheets using SQL. 

## The Future
There are many things that could be done to improve this project. For one, I could implement Firebase Authentication, which would likely be a bit more secure. Then, I could change the UI to support dropdown menus instead of text boxes, as they would probably be more fitting in some scenarios. Alerts of success and error could also be added on submission.

[![My Skills](https://skillicons.dev/icons?i=react,figma,github,firebase)](https://skillicons.dev)

## Demo Link 
https://youtube.com/shorts/lLc6-vMYbSM
