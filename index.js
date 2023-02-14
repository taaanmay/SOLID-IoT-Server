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
} = require("@inrupt/solid-client");

const {
  JSDOM
} = require("jsdom");
const fs = require('fs');

const file = fs.readFileSync('./index.html', 'utf-8');
const dom = new JSDOM(file);
const {
  document
} = dom.window;

const app = express();
const port = 3000;

const HOST = 'http://localhost:3000'
const CALLBACK_URL = `${HOST}/login/callback`


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
  
  
  
  
  app.get("/login", async (req, res, next) => {
    const session = new Session();
    session.login({
      // 2. Use the authenticated credentials to log in the session.
      clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
      clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
      oidcIssuer: "https://login.inrupt.com"
    }).then(() => {
      if (session.info.isLoggedIn) {
        // 3. Your session should now be logged in, and able to make authenticated requests.
        session
        // You can change the fetched URL to a private resource, such as your Pod root.
        .fetch(session.info.webId)
        .then((response) => {
          return response.text();
        })
        .then(console.log);
        res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
      }
    });
  });
  
  app.get("/get-resources", async (req, res, next) => {
    const session = new Session();
    session.login({
      // 2. Use the authenticated credentials to log in the session.
      clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
      clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
      oidcIssuer: "https://login.inrupt.com"
    }).then(() => {
      if (session.info.isLoggedIn) {
        // 3. Your session should now be logged in, and able to make authenticated requests.
        var responseToSend;
        session
        // You can change the fetched URL to a private resource, such as your Pod root.
        .fetch('https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/')
        .then((response) => {
          responseToSend = response.text();
          return response.text();
        })
        .then(console.log);
        res.send(`<p>Logged in and got the following data :  ${responseToSend}.</p>`)
      }
    });
  });
  
  
  app.get("/login-old", async (req, res, next) => {
    // 1. Create a new Session
    const session = new Session();
    req.session.sessionId = session.info.sessionId;
    const redirectToSolidIdentityProvider = (url) => {
      // Since we use Express in this example, we can call `res.redirect` to send the user to the
      // given URL, but the specific method of redirection depend on your app's particular setup.
      // For example, if you are writing a command line app, this might simply display a prompt for
      // the user to visit the given URL in their browser.
      res.redirect(url);
    };
    // 2. Start the login process; redirect handler will handle sending the user to their
    //    Solid Identity Provider.
    await session.login({
      // After login, the Solid Identity Provider will send the user back to the following
      // URL, with the data necessary to complete the authentication process
      // appended as query parameters:
      redirectUrl: `http://localhost:${port}/redirect-from-solid-idp`,
      // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
      oidcIssuer: "https://login.inrupt.com",
      // Pick an application name that will be shown when asked 
      // to approve the application's access to the requested data.
      clientName: "Demo app",
      handleRedirect: redirectToSolidIdentityProvider,
    });
  });
  
  
  
  // app.get("/login", async (req, res, next) => {
  //   loginFunc(req,res);
  // });
  
  
  
  // async function loginFunc(req, res) {
  //   const session = new Session();
  //   req.session.sessionId = session.info.sessionId;
  //   const webID = `https://id.inrupt.com/doser001`;
  
  //   const profileUrl = new URL(webID);
  //   profileUrl.hash = "";
  
  //   const dataset = await getSolidDataset(profileUrl.href);
  //   const profile = getThing(dataset, webID);
  //   const issuer = getUrlAll(profile, 'http://www.w3.org/ns/solid/terms#oidcIssuer')[0];
  //   const redirectToOIDC = (url) => { res.redirect(url) };
  
  //   session.login({
  //     redirectUrl: `http://localhost:${port}/redirect-from-solid-idp`,
  //     oidcIssuer: issuer,
  //     clientName: 'Recipe demo',
  //     handleRedirect: redirectToOIDC
  //   })
  // };
  
  
  
  // app.get("/login", async (req, res, next) => {
  //   // 1. Create a new Session
  //   const session = new Session();
  
  
  //   var myClientId = 
  //   session.login({
  //     // 2. Use the authenticated credentials to log in the session.
  //     clientId: myClientId,
  //     clientSecret: myClientSecret,
  //     oidcIssuer: myIdentityProvider
  //   }).then(() => {
  //     if (session.info.isLoggedIn) {
  //       // 3. Your session should now be logged in, and able to make authenticated requests.
  //       session
  //         // You can change the fetched URL to a private resource, such as your Pod root.
  //         .fetch(session.info.webId)
  //         .then((response) => {
  //           return response.text();
  //         })
  //         .then(console.log);
  //     }
  //   });
  
  
  
  
  //   // 2. Start the login process; redirect handler will handle sending the user to their
  //   //    Solid Identity Provider.
  //   await session.login({
  //     // After login, the Solid Identity Provider will send the user back to the following
  //     // URL, with the data necessary to complete the authentication process
  //     // appended as query parameters:
  //     redirectUrl: `http://localhost:${port}/redirect-from-solid-idp`,
  //     // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
  //     oidcIssuer: "https://login.inrupt.com",
  //     // Pick an application name that will be shown when asked 
  //     // to approve the application's access to the requested data.
  //     clientName: "Demo app",
  //     handleRedirect: redirectToSolidIdentityProvider,
  //   });
  // });
  
  
  
  
  app.get("/redirect-from-solid-idp", async (req, res) => {
    // 3. If the user is sent back to the `redirectUrl` provided in step 2,
    //    it means that the login has been initiated and can be completed. In
    //    particular, initiating the login stores the session in storage, 
    //    which means it can be retrieved as follows.
    const session = await getSessionFromStorage(req.session.sessionId);
    
    // 4. With your session back from storage, you are now able to 
    //    complete the login process using the data appended to it as query
    //    parameters in req.url by the Solid Identity Provider:
    await session.handleIncomingRedirect(`http://localhost:${port}${req.url}`);
    
    // 5. `session` now contains an authenticated Session instance.
    if (session.info.isLoggedIn) {
      return res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
    }
  });
  
  // 6. Once you are logged in, you can retrieve the session from storage, 
  //    and perform authenticated fetches.
  // app.get("/fetch-old", async (req, res, next) => {
  //   if(typeof req.query["resource"] === "undefined") {
  //     res.send(
  //       "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
  //       );
  //     }
  //     const session = await getSessionFromStorage(req.session.sessionId);
  //     var responseFromSolid = console.log(await (await session.fetch(req.query["resource"])).text());
  //     res.send("<p>Performed authenticated fetch.</p>" + responseFromSolid );
  //   });
  
  
  
  
  app.get("/fetch", async (req, res, next) => {
    
    if (typeof req.query["resource"] === "undefined") {
      res.send(
        "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
        );
      }
      const session = new Session();
      session.login({
        // 2. Use the authenticated credentials to log in the session.
        clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
        clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
        oidcIssuer: "https://login.inrupt.com"
      }).then(async () => {
        if (session.info.isLoggedIn) {
          var responseFromSolid = await (await session.fetch(req.query["resource"])).text();
          console.log(responseFromSolid);
          res.send("<p>Performed authenticated fetch.</p>" + responseFromSolid);
        }
      });
      
      
      
    });
    
    
    
    
    // 7. To log out a session, just retrieve the session from storage, and 
    //    call the .logout method.
    app.get("/logout", async (req, res, next) => {
      const session = await getSessionFromStorage(req.session.sessionId);
      session.logout();
      res.send(`<p>Logged out.</p>`);
    });
    
    
    app.use(express.json());
    
    app.post("/post/add-device", async (req, res) => {
      
      
      
      
      
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
      
      // res.send({ success: true, message: "Data received by Server (TK)." });
      
      // podLocation = `https://storage.inrupt.com/dcc8eac4-6003-4709-b4e1-cced55a20ac3/dosing-data/`
      
      
      var podLocation = "https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/";
      var status  = await (addDevice(podLocation, id, temperature, latitude, longitude));
      if(status == true){
        res.send({ success: true, message: "Data Uploaded." });
      }else{
        res.send({ success: false, message: "Data Was Not uploaded." });
      }
      
      
      
      
    });
    
    
    // 8. On the server side, you can also list all registered sessions using the
    //    getSessionIdFromStorageAll function.
    app.get("/", async (req, res, next) => {
      const sessionIds = await getSessionIdFromStorageAll();
      for (const sessionId in sessionIds) {
        // Do something with the session ID...
        console.log("Try the notification function here:")
        
        
        //   const containerUrl = "https://storage.inrupt.com/dcc8eac4-6003-4709-b4e1-cced55a20ac3/dosing-data/Tanker1233";
        
        //   const websocket = new WebsocketNotification(
        //     containerUrl,
        //     { fetch: fetch }
        //   );
        
        //   websocket.on("message", console.log);
        
        //   websocket.connect();
      }
      //   res.send(
      //     `<p>There are currently [${sessionIds.length}] visitors.</p>`
      //   );
      res.sendFile(path.join(__dirname, "index.html"));
      
      runHTML();
    });
    
    
    app.listen(port, () => {
      console.log(
        `Server running on port [${port}]. ` +
        `Visit [http://localhost:${port}/login] to log in to [login.inrupt.com].`
        );
      });
      
      function runHTML() {
        console.log("Hey");
        const buttonCreateNewTank = document.getElementById("submit-tank");
        buttonCreateNewTank.onclick = function() {
          console.log("New Tank Button Pressed");
          //createNewTank();
        };
        
      }
      
      
      async function addDevice(podLocation, id, temperature, latitude, longitude) {
        
        // podLocation = `https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/dosing-data/`;
        // const session = await getSessionFromStorage(req.session.sessionId);
        // console.log("Add Device Function called");
        // console.log(await (await session.fetch('https://storage.inrupt.com/dcc8eac4-6003-4709-b4e1-cced55a20ac3/dosing-data/')).text());
        
        
        const session = new Session();
        session.login({
          // 2. Use the authenticated credentials to log in the session.
          clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
          clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
          oidcIssuer: "https://login.inrupt.com"
        }).then(async () => {
          if (session.info.isLoggedIn) {
            console.log(`WebID = ${session.info.webId}`);
            
            let deviceList;
            
            try {
              // Attempt to retrieve the reading list in case it already exists.
              deviceList = await getSolidDataset(podLocation);
              // Clear the list to override the whole list
              let items = getThingAll(deviceList);
              items.forEach((item) => {
                deviceList = removeThing(deviceList, item);
              });
            } catch (error) {
              if (typeof error.statusCode === "number" && error.statusCode === 404) {
                // if not found, create a new SolidDataset (i.e., the reading list)
                deviceList = createSolidDataset();
              } else {
                console.error(error.message);
              }
            }
            
            
            let item = createThing({
              name: "Doser"
            });
            item = addUrl(item, RDF.type, 'http://www.w3.org/ns/sosa/Sensor');
            // item = addStringNoLocale(item, SCHEMA_INRUPT.value, temperature);
            // // item = addStringNoLocale(item, SCHEMA_INRUPT.dateModified, time);
            // item = addStringNoLocale(item, 'http://www.w3.org/2003/01/geo/wgs84_pos/lat_lon', (latitude + ", " + longitude));
            // item = addStringNoLocale(item, 'https://schema.org/creator', session.info.webId);
            // deviceList = setThing(deviceList, item);
            
            
            try {
              // Save the SolidDataset
              let savedReadingList = await saveSolidDatasetAt(
                podLocation,
                deviceList
                );
                
              return true;  
              } catch (error) {
                console.log("Device Not saved in Solid Pod => ");
                console.error(error.message);
                return false;

              }
              
            }
          });
          
          
          
        }