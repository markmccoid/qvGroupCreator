const varAppRouter = require('express').Router();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const X2JS = require('x2js'); //npm module to convert js object to XML

const DATA_FILE = path.join(__dirname, '../', 'qvvariables.json');

varAppRouter.route('/variables/app')
  //---------------------------------------------------
  //--A GET to api/variables/app will return an
  //--array containing a unique list of applications
  //--contained in the qvvariables.json file
  //---------------------------------------------------
  .get((req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
    	let qvVars = JSON.parse(data);
    	//pull out the application into an array, then use lodash to grab uniques and sort it.
      //the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
    	let applicationList = _(qvVars.map(varObj => varObj.application)).uniq().sortBy();
      res.setHeader('Cache-Control', 'no-cache');
      //Looks like .send without the JSON.parse does the same as res.json(...)
      //res.send(data);
      res.send(applicationList);
    });
  });

varAppRouter.route('/variables/app/:appName')
  //---------------------------------------------------
  //--A GET to api/variables/:application will return an
  //--array containing only the qvvariable objects for that
  //--specific application as a javascript object.
  //--Also expecting a querystring/url-encoded data
  //--"?format=xml" OR "?format=json" default is json.
  //--If format is xml, then file will also be written to server
  //---------------------------------------------------
  .get((req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
      let qvVars = JSON.parse(data); //convert json to js object
      let appName = req.params.appName.toLowerCase(); //get querystring if available
  		let appNameSansSpaces = appName.replace(/\s+/g, '');
      let applicationVars = qvVars.filter(qvVar => qvVar.application.toLowerCase() === appName);
  		//If requesting XML, get XML Data.
  		if (req.query.format === 'xml') {
  			const x2js = new X2JS();
  			let xmlString = x2js.js2xml({variable: applicationVars});
        //Enclose xml created with the appName, otherwise Qlik won't recognize properly
  			applicationVars = `<${appNameSansSpaces}>${xmlString}</${appNameSansSpaces}>`;
  			//write the variables array back to the server disk navigating to the include directory
        console.log(path.join(__dirname, '../Spreadsheets/',`${appName}.xml`));
  			fs.writeFile(path.join(__dirname, '../Spreadsheets/',`${appName}.xml`), applicationVars, (err) => {
  				if (err) console.log(`Error Writing: ${appName}.xml`, err)
  				console.log(`file written: ${appName}.xml`);
  			});
  		}
      res.setHeader('Cache-Control', 'no-cache');
      res.send(applicationVars);
    });
  });

module.exports = varAppRouter;
