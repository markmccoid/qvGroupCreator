const settingsRouter = require('express').Router();
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const _ = require('lodash');

const DATA_FILE = path.join(__dirname, '../', 'qvvariables.json');
const APPNAME_DATA = path.join(__dirname, '../', 'appnames.json');

//==========================================================
//--API info for /api/settings/...
//==========================================================


settingsRouter.route('/settings/appnames')
  .get((req, res) => {
  	fs.readFile(APPNAME_DATA, (err, data) => {
  		const appnames = JSON.parse(data);
  		res.setHeader('Cache-Control', 'no-cache');
  		res.send(appnames);
  	});
  })
  //---------------------------------------------------
  //--A POST to api/settings/appnames will cause the object sent
  //--to be added to the appnames.json file.
  //--A new object of all appnames will be returned
  //---------------------------------------------------
  .post((req, res) => {
  	//If we send an JS object to a post, req.body will have the object in it.
    let newAppName = req.body.appName;
    fs.readFile(APPNAME_DATA, (err, data) => {
      const appnames = JSON.parse(data);
      //Check to make sure new name doesn't already exist
      //Filtering and then checking the length of array return and converting to a boolean
  		const dupAppName = appnames.filter(name => name.appName === newAppName).length > 0;
      if (dupAppName) {
        res.setHeader('Cache-Control', 'no-cache');
        //return error response
        res.json({
  					response: appnames,
  					error: 'Duplicate Application Name'
  				});
        return;
      }
      const newAppNameObj = {
  			id: uuid.v4(),
  			appName: req.body.appName
  		};
  		//--add this new variable object too the variables array
      appnames.push(newAppNameObj);
      //write the variables array back to disk
      fs.writeFile(APPNAME_DATA, JSON.stringify(appnames), () => {
        res.setHeader('Cache-Control', 'no-cache');
        //return the variables file so application can update it's
        res.json(appnames);
      });
    });
  })
  //---------------------------------------------------
  //--A PUT to api/settings/appnames will cause the object sent
  //--to be updated in the appnames.json file.
  //--an empty object {} will be returned
  //-- @apiParams - {id, appName} (appName being the new application name)
  //-- @apiSuccess(return) - {Object} emptyObject An Empty Object.
  //---------------------------------------------------
  .put((req, res) => {
    fs.readFile(APPNAME_DATA, (err, data) => {
      const appnames = JSON.parse(data);
      //Get the old appName that we will be updating
      const oldAppName = appnames.filter(appname => appname.id === req.body.id)[0].appName;
      console.log(oldAppName);
      //Find the appname to be updated
      appnames.forEach(app => {
      	if (app.id === req.body.id) {
  				app.appName = req.body.appName;
      	}
      });
      //Now read the qvVariables.json file and change all the application names
      //that match the oldAppName to the new appName
      fs.readFile(DATA_FILE, (err, data) =>{
        const variables = JSON.parse(data);
        const newVariablesArray = _.forEach(variables, variable => {
          if (variable.application === oldAppName) {
            variable.application = req.body.appName;
          }
        });
        fs.writeFile(DATA_FILE, JSON.stringify(newVariablesArray), (err)=> {
          if (err) {
            console.log(`error writing file - ${DATA_FILE} - in PUT api/seeting/appnames`)
          }
        });
      });
      //write the appnames array back to disk
      fs.writeFile(APPNAME_DATA, JSON.stringify(appnames), () => {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({});
        res.end();
      });
    });
  });

settingsRouter.route('/settings/appnames/:id')
  //---------------------------------------------------
  //--A DELETE to api/variables will cause the object with
  //--the id sent to be deleted
  //--an empty object {} will be returned
  //---------------------------------------------------
  .delete((req, res) => {
    const appNamesFile = JSON.parse(fs.readFileSync(APPNAME_DATA));
    //Get the appName to delete since we are only getting the id
    console.log(req.params.id);

    const newAppNames = appNamesFile.filter(obj => obj.id !== req.params.id);
    fs.writeFile(APPNAME_DATA, JSON.stringify(newAppNames), (err) => {
      if (err) {
        console.log(`Error deleting ${req.params.id} from appnames.json`);
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json({});
        res.end();
      }
    })
  //The chunk below can be used if we want to delete stuff from the qvVariables.json file
  //when deleting an appname from the appnames file
  //  appNameToDelete = appNamesFile.filter(obj => obj.id === req.params.id)[0].appName;
    // fs.readFile(DATA_FILE, (err, data) => {
    //   const variables = JSON.parse(data);
    //   //Find out if any variables have the appName to be deleted as the application property
    //   const varsToKeep = variables.filter(qvVar => qvVar.application !== appNameToDelete);
    //   //write the variables array back to disk
    //   fs.writeFile(DATA_FILE, JSON.stringify(varsToKeep), (err) => {
    //     res.setHeader('Cache-Control', 'no-cache');
    //     //return the variables file so application can update it's
    //     res.json({});
    //     res.end();
    //   });
    // });
  });

module.exports = settingsRouter;
