/// <reference path="../references.ts" />
import * as SAW from '../../src/index';

describe('SCORM API Wrapper', () => {

  let saw:any;

  beforeEach(() => {
    saw = SAW;
    console.log('HERE', SAW);
  });

  afterEach(() => {
    saw = null;
  });

  it('should have an attribute to store the API handle', () => {
    chai.expect(saw.API).should.not.be.undefined;
  });

  it('should have an attribute to store the LMS initialization status', () => {
    chai.expect(saw.LMS_INITIALIZED).should.not.be.undefined;
  });

  it('should have an attribute to store session logs (interactio with the API hanlde)', () => {
    chai.expect(saw.sessionLogs).should.not.be.undefined;
    chai.expect(saw.sessionLogs.length).equals(0);
  });

  it('should not be configured before init invocation', () => {
    chai.expect(saw.isConfigured()).equals(false);
  });

  it('should not be initialize before init invocation', () => {
    chai.expect(saw.isInitialized()).equals(false);
  });

  it('should have a logOperation function', () => {
    chai.expect(saw.logOperation).should.not.be.undefined;
  });

  it('should have a commit function', () => {
    chai.expect(saw.commit).should.not.be.undefined
  });

  it('should have a finish function', () => {
    chai.expect(saw.finish).should.not.be.undefined;
  });

  it('should have an unset function', () => {
    chai.expect(saw.unset).should.not.be.undefined;
  });

});
