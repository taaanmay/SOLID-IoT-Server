const express = require("express");

const cookieSession = require("cookie-session");
const path = require("path");
const {
    WebsocketNotification,
} = require("@inrupt/solid-client-notifications");

const {
    getSessionFromStorage,
    getSessionIdFromStorageAll,
    Session,
    fetch
} = require("@inrupt/solid-client-authn-node");


const { SCHEMA_INRUPT, RDF, AS, OWL } = require("@inrupt/vocab-common-rdf");

const {
    getSolidDataset,
    getThing,
    getStringNoLocale,
    getUrlAll,
    addUrl,
    addStringNoLocale,
    createSolidDataset,
    createThing,
    getPodUrlAll,
    getThingAll,
    getUrl,
    removeThing,
    saveSolidDatasetAt,
    setThing,
    getAgentAccess,
    getAgentAccessAll,
} = require("@inrupt/solid-client");

const app = express();
const port = 3000;

// The following snippet ensures that the server identifies each user's session
// with a cookie using an express-specific mechanism
app.use(
    cookieSession({
        name: "session",
        // These keys are required by cookie-session to sign the cookies.
        keys: [
            "Required, but value not relevant for this demo - key1",
            "Required, but value not relevant for this demo - key2",
        ],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
    );

app.use(express.json());    
    
    const session = new Session();
    session.login({
        // 2. Use the authenticated credentials to log in the session.
        clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
        clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
        oidcIssuer: "https://login.inrupt.com"
    });
    

    // Server Function 1 (SF001): GET ALL THE DEVICES.
    // URL to test: http://localhost:3000/getDevices/?resource=https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/dosing-data/
    app.get("/getDevices", async (req, res, next) => {
      
        if (typeof req.query["resource"] === "undefined") {
          res.send(
            "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
            );
        }
          
            if (session.info.isLoggedIn) {
                var responseFromSolid = await (await session.fetch(req.query["resource"])).text();
                console.log(responseFromSolid);            
                res.send("<p>Performed authenticated fetch.</p>" + responseFromSolid);
            }            
    });



    // Server Function 2 (SF002): UPLOAD DEVICE DATA.
    // URL to test:
    app.post("/post/add-device", async (req, res) => {
        // If the request is not JSON then reject and ask for JSON.        
        if (req.headers["content-type"] !== "application/json") {
            return res.status(400).send({
            error: "Content-type must be JSON"
            });
        }
        
        const deviceData = req.body;
        const {
            id,
            temperature,
            latitude,
            longitude
        } = deviceData;
        
        console.log(`id: ${id}`);
        console.log(`temperature: ${temperature}`);
        console.log(`latitude: ${latitude}`);
        console.log(`longitude: ${longitude}`);
    
        // Hardcoded SOLID Pod Location
        var podLocation = "https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/dosing-data/";
        
        var status  = await (addDevice(podLocation, id, temperature, latitude, longitude));
        if(status == true){
            res.send({ success: true, message: "Data Uploaded." });
        }else{
            res.send({ success: false, message: "Data Was Not uploaded." });
        } 
    
    });

    async function addDevice(podLocation, id, temperature, latitude, longitude){

        if (session.info.isLoggedIn) {
            console.log(`WebID = ${session.info.webId}`);
            
            
            let deviceList;
            
            try {
                // Attempt to retrieve the reading list in case it already exists.
                deviceList = await getSolidDataset(podLocation, 
                { fetch: session.fetch });
                // Clear the list to override the whole list
                let items = getThingAll(deviceList);
                items.forEach((item) => {
                    deviceList = removeThing(deviceList, item);
                });
            } catch (error) {
                if (typeof error.statusCode === "number" && error.statusCode === 404) {
                    // if not found, create a new SolidDataset (i.e., the reading list)
                    deviceList = createSolidDataset();
                } 
                else {
                    console.error(error.message);
                }
            }
                
                var currentdate = new Date(); 
                var datetime = "Last Sync: " + currentdate.getDate() + "/"
                                + (currentdate.getMonth()+1)  + "/" 
                                + currentdate.getFullYear() + " @ "  
                                + currentdate.getHours() + ":"  
                                + currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();
                
                console.log("Date - "+datetime);                                
                
                let item = createThing({
                name: "Tank"+id
                });
                item = addUrl(item, RDF.type, 'http://www.w3.org/ns/sosa/Sensor');
                item = addStringNoLocale(item, SCHEMA_INRUPT.value, temperature);
                item = addStringNoLocale(item, SCHEMA_INRUPT.dateModified, datetime);
                item = addStringNoLocale(item, 'http://www.w3.org/2003/01/geo/wgs84_pos/lat_lon', (latitude + ", " + longitude));
                item = addStringNoLocale(item, 'https://schema.org/creator', session.info.webId);
                deviceList = setThing(deviceList, item);
                
                
                try {
                // Save the SolidDataset
                let saveDeviceList = await saveSolidDatasetAt(
                    podLocation,
                    deviceList, 
                    { fetch: session.fetch }
                    );
                    console.log('Saved Data '+ saveDeviceList); 
                    return true; 
                    
                    
                } catch (error) {
                    console.log("Device Not saved in Solid Pod => ");
                    console.error(error.message);
                    res.status(400).send({
                        error: "Device Data could not be saved in Solid Pod"
                    });
                    return false;

                    
                }
                
                
                
        }
    }    
    


    app.listen(port, () => {
        console.log(
          `Server running on port [${port}]. `
          );
        });