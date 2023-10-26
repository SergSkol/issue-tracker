const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const endPoint = '/api/issues/test';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('POST request to /api/issues/{project}', function() {

    test('Create an issue with every field', function(done) {
      chai
        .request(server)
        .post(endPoint)
        .send({
          issue_title: 'Test title 1',
          issue_text: 'Every field filled in',
          created_by: 'test-creator',
          assigned_to: 'test-assignee',
          status_text: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.req.body.issue_title, 'Test title 1');
          assert.equal(res.req.body.issue_text, 'Every field filled in');
          assert.equal(res.req.body.created_by, 'test-creator');
          assert.equal(res.req.body.assigned_to, 'test-assignee');
          assert.equal(res.req.body.status_text, 'test');
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      chai
        .request(server)
        .post(endPoint)
        .send({
          issue_title: 'Test title 2',
          issue_text: 'Required fields filled in',
          created_by: 'test-creator'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.req.body.issue_title, 'Test title 2');
          assert.equal(res.req.body.issue_text, 'Required fields filled in');
          assert.equal(res.req.body.created_by, 'test-creator');
          done();
        });
    });

    test('issue with missing required fields', function(done) {
      chai
        .request(server)
        .post(endPoint)
        .send({
          issue_title: 'Test Title 3',
          created_by: 'test-creator'
        })
        .end(function(err, res){
          assert.notEqual(res.status, 200);
          done();
        });
    });
  });

  suite('GET request to /api/issues/{project}', function() {

    test('View issues on a project', function(done) {
      chai
        .request(server)
        .get(endPoint)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });



  });


});
