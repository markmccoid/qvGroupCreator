const groupAppRouter = require('express').Router();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const X2JS = require('x2js'); //npm module to convert js object to XML

const GROUPS_FILE = path.join(__dirname, '../', 'qvGroups.json');

groupAppRouter.route('/groups/app')
  //---------------------------------------------------
  //--A GET to api/groups/app will return an
  //--array containing a unique list of applications
  //--contained in the qvgroups.json file
  //---------------------------------------------------
  .get((req, res) => {
    fs.readFile(GROUPS_FILE, (err, data) => {
    	let qvGroups = JSON.parse(data);
    	//pull out the application into an array, then use lodash to grab uniques and sort it.
      //the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
    	let applicationList = _(qvGroups.map(groupObj => groupObj.application)).uniq().sortBy();
      res.setHeader('Cache-Control', 'no-cache');
      //Looks like .send without the JSON.parse does the same as res.json(...)
      //res.send(data);
      res.send(applicationList);
    });
  });

groupAppRouter.route('/groups/app/:appName')
  //---------------------------------------------------
  //--A GET to api/groups/:application will return an
  //--array containing only the qvvariable objects for that
  //--specific application as a javascript object.
  //--Also expecting a querystring/url-encoded data
  //--"?format=xml" OR "?format=json" default is json.
  //--If format is xml, then file will also be written to server
  //---------------------------------------------------
  .get((req, res) => {
    fs.readFile(GROUPS_FILE, (err, data) => {
      let qvGroups = JSON.parse(data); //convert json to js object
      let appName = req.params.appName.toLowerCase(); //get querystring if available
  		let appNameSansSpaces = appName.replace(/\s+/g, '');
      let applicationGroups = qvGroups.filter(qvGroup => qvGroup.application.toLowerCase() === appName);
  		//If requesting XML, get XML Data.
  		if (req.query.format === 'xml') {
  			const x2js = new X2JS();
  			let xmlString = x2js.js2xml({variable: applicationGroups});
        //Enclose xml created with the appName, otherwise Qlik won't recognize properly
  			applicationGroups = `<${appNameSansSpaces}>${xmlString}</${appNameSansSpaces}>`;
  			//write the groups array back to the server disk navigating to the include directory
        console.log(path.join(__dirname, '../Spreadsheets/',`${appName}Groups.xml`));
  			fs.writeFile(path.join(__dirname, '../Spreadsheets/',`${appName}Groups.xml`), applicationGroups, (err) => {
  				if (err) console.log(`Error Writing: ${appName}Groups.xml`, err)
  				console.log(`file written: ${appName}Groups.xml`);
  			});
  		}
      res.setHeader('Cache-Control', 'no-cache');
      res.send(applicationGroups);
    });
  });

module.exports = groupAppRouter;
