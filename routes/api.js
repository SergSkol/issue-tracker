'use strict';

const myDB = require('./connection');
const mongo = require('mongodb');

const databaseName = "issue-tracker";

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const query = req.query || {};
    
      myDB(async client => {
        const db = await client.db(databaseName);

        const data = [];
        await db.collection(project).find(query).forEach(doc => {
            data.push(doc);
          });
        res.send(data);
      
      });

    })
    
    .post(function (req, res){
      let project = req.params.project;
      
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      }

      myDB(async client => {
        const db = await client.db(databaseName);

        db.collection(project)
          .insertOne(issue, function(err, doc) {
            if (err) {
              console.error('POST error', err);
            } else {
              res.json({issue})
            }
        })
      })
    })
    
    .put(function (req, res){
      const project = req.params.project;

      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        updated_on: new Date(),
        open: req.body.open === 'false' ? false : true,
      }

      const _id = new mongo.ObjectId(req.body._id);

      for(let item in issue) {
        if (issue[item] === '') {
          delete issue[item];
        }
      }

      myDB(async client => {
        const db = await client.db(databaseName);

        db.collection(project).findOneAndUpdate({_id}, {$set: issue}, {new: true}, function(err, doc) {
            if (err) {
              console.error('PUT error', err);
            } else {
              res.send('Successfully updated!')
            }
        })
      })
      
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      const _id = new mongo.ObjectId(req.body._id);
      
      myDB(async client => {
        const db = await client.db(databaseName);

        db.collection(project).deleteOne({_id}, function(err, doc) {
            if (err) {
              console.error('DELETE error', err);
            } else {
              res.send('Successfully deleted!')
            }
        })
      })
    });
    
};
