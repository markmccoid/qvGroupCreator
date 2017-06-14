const groupRouter = require('express').Router();
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');

const GROUPS_FILE = path.join(__dirname, '../', 'qvgroups.json');

groupRouter.route('/groups')
  //---------------------------------------------------
  //--A get to api/groups will return the qvgroups.json
  //--file as a javascript object.
  //---------------------------------------------------
  .get((req, res) => {
		console.log('in get');
    fs.readFile(GROUPS_FILE, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(JSON.parse(data));
    });
  })
  //---------------------------------------------------
  //--A POST to api/groups will cause the object sent (in body)
  //--to be added to the qvgroups.json file.
  //--A new array of objects with just the application that the
  //--group was added to will be returned
  //---------------------------------------------------
  .post((req, res) => {
    //If we send an JS object to a post, req.body will have the object in it.
    fs.readFile(GROUPS_FILE, (err, data) => {
      const groups = JSON.parse(data);

      const newGroup = {
        id: uuid.v4(),
        application: req.body.application,
        groupName: req.body.groupName,
        groupType: req.body.groupType,
        groupNotes: req.body.groupNotes || '',
				fields: req.body.fields,
        createDate: req.body.createDate,
        modifyDate: '',
        createUser: req.body.createUser,
        modifyUser: ''
      };

      //--add this new variable object too the variables array
      groups.push(newGroup);
      console.log('newGroup', newGroup);
      //write the variables array back to disk
      fs.writeFile(GROUPS_FILE, JSON.stringify(groups), () => {
        let applicationGroups = groups.filter(qvGroup => qvGroup.application.toLowerCase() === req.body.application.toLowerCase());
        res.setHeader('Cache-Control', 'no-cache');
        //return the new Group record.
        res.json(newGroup);
      });
    });
  })
  //---------------------------------------------------
  //--A PUT to api/groups will cause the object sent
  //--to be updated in the qvgroups.json file.
  //--an empty object {} will be returned
  //---------------------------------------------------
  /**
   * @api {put} /api/groups update a single variable object
   * @apiParam(data) {Object} QVGroupObject QV Group Object.
   * @apiSuccess(return) {Object} emptyObject An Empty Object.
   */
  .put((req, res) => {
    //console.log(req.query);
    fs.readFile(GROUPS_FILE, (err, data) => {
      const groups = JSON.parse(data);
      //Find the variable to be updated
      groups.forEach(qvGroup => {
      	if (qvGroup.id === req.body.id) {
  				qvGroup.application = req.body.application;
  				qvGroup.groupName = req.body.groupName;
					qvGroup.groupType = req.body.groupType;
					qvGroup.fields = req.body.fields;
  				qvGroup.groupNotes = req.body.groupNotes;
  				qvGroup.modifyDate = req.body.modifyDate,
          qvGroup.modifyUser = req.body.modifyUser;
      	}
      });
      //write the variables array back to disk
      fs.writeFile(GROUPS_FILE, JSON.stringify(groups), () => {
        res.setHeader('Cache-Control', 'no-cache');
        //return the variables file so application can update it's
        res.json({});
        res.end();
      });
    });
  });

  groupRouter.route('/groups/:id')
    //---------------------------------------------------
    //--A get to api/groups/:id will return the matching
    // group from the qvgroups.json file as a javascript object.
    //---------------------------------------------------
    .get((req, res) => {
      fs.readFile(GROUPS_FILE, (err, data) => {
        let groups = JSON.parse(data);
        let returnGroup = groups.filter(group => group.id === req.params.id)
        res.setHeader('Cache-Control', 'no-cache');
        res.json(returnGroup);
      });
    })
    //---------------------------------------------------
    //--A delete to api/groups/:id will delete the matching
    // group from the qvgroups.json file
    //---------------------------------------------------
    .delete((req, res) => {
      fs.readFile(GROUPS_FILE, (err, data) => {
        let groups = JSON.parse(data);
        let filteredGroups = groups.filter(group => group.id !== req.params.id)
        //write the variables array back to disk
        fs.writeFile(GROUPS_FILE, JSON.stringify(filteredGroups), () => {
          res.setHeader('Cache-Control', 'no-cache');
          //return the variables file so application can update it's
          res.json({});
          res.end();
        });
      })
    });

    //---------------------------------------------------
    //--A get to api/groups/:id/fields will return the fields for
    // the matching group from the qvgroups.json file as an
    // array of field objects.
    //---------------------------------------------------
    groupRouter.route('/groups/:id/fields')
      .get((req, res) => {
        fs.readFile(GROUPS_FILE, (err, data) => {
          let groups = JSON.parse(data);
          let fields = groups.filter(group => group.id === req.params.id)[0].fields;
          res.setHeader('Cache-Control', 'no-cache');
          res.send(fields);
        })
      })
    //---------------------------------------------------
    //--A put to api/groups/:id/fields will update the fields array
    // for the matching group from the qvgroups.json file and
    // return an empty object
    //---------------------------------------------------
      .put((req, res) => {
        fs.readFile(GROUPS_FILE, (err, data) => {
          let groups = JSON.parse(data);
          groups.forEach(group => {
            if (group.id === req.params.id) {
              group.fields = req.body.fields;
              group.modifyUser = req.body.modifyUser;
            }
          });
          fs.writeFile(GROUPS_FILE, JSON.stringify(groups), () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json({});
          });
        });
      });

  module.exports = groupRouter;
