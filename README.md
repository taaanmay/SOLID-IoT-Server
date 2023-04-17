# SOLID-Play Web Server

This project is for Sever Side of SOLID-Play Application


## To run the application:

`npm i`

`npm start`


## Example Requests to Run

### GET ALL THE DEVICES.
URL to test: `http://localhost:3000/getDevices/?resource=https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/dosing-data/`


### Upload IoT Devices
URL to test: `http://localhost:3000/post/add-device`


Body for Request: 
`{
  "id":98765,
  "value": 90,
  "latitude": 23,
  "longitude": 121,
  "webID": "https://id.inrupt.com/mickey"
}
` 





