const analytixFieldsRouter = require('express').Router();
const fs = require('fs');
const path = require('path');

const FIELDS_FILE = path.join(__dirname, '../', 'analytixfields.json');

analytixFieldsRouter.route('/analytixfields/:appName')
  //---------------------------------------------------
  //--A get to api/groups will return the qvgroups.json
  //--file as a javascript object.
  //---------------------------------------------------
  .get((req, res) => {
    fs.readFile(FIELDS_FILE, (err, data) => {
      const reqAppName = req.params.appName.toLowerCase();
      const fields = JSON.parse(data);
      const appFields = fields.filter(field => field.application.toLowerCase() === reqAppName);
      res.setHeader('Cache-Control', 'no-cache');
      res.send(appFields);
    });
  });

module.exports = analytixFieldsRouter;