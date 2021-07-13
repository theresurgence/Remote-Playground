var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('request');
const server = require('../index');


describe('Front-End Web Routing', () => {

    describe('Starting Server', () => {
        before( () => {
            server.listen(3000);
        });

        it('Should succesfully display Main Playground Page Status', (done) => {
            request('https://localhost:3000' , function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        after( () => {
            server.close();
        })
    })
    


});