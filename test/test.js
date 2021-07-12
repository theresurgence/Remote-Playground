var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('request');
const app = require('../index');


describe('Front-End Web Routing', () => {

    it('Main Playground Page Status', (done) => {
        request('https://localhost:3000' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


});