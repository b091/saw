/// <reference path="../references.ts" />
import * as TypeMoq from 'typemoq';
import {findAPI} from '../../src/SCORM/findAPI';
import {SCORMAPI} from '../../src/SCORM/API';
import {SCORMAPIClass} from '../../src/SCORM/SCORMAPIClass';
import {APIWrapper} from '../../src/SCORM/APIWrapper';
import Mock = TypeMoq.Mock;
import It = TypeMoq.It;

console.log(typeof TypeMoq);
describe('SCORM API Wrapper', () => {

  let findAPIMock:Mock<(win:any) => SCORMAPI> = Mock.ofInstance(findAPI);
  let scormAPI:Mock<SCORMAPI> = Mock.ofType<SCORMAPI>(SCORMAPIClass);
  let apiWrapper:APIWrapper;
  let window:any;

  beforeEach(() => {
    apiWrapper = new APIWrapper();
    findAPIMock.setup(x => x(It.isAny())).returns(x => scormAPI.object);
  });

  afterEach(() => {
    apiWrapper = null;
  });

  describe('initially', () => {

    it('API is not configured', () => {
      const result:boolean = apiWrapper.isConfigured();
      result.should.equals(false);
    });

  });

  it('search for API when', () => {
    // given
    // findAPIMock.setup(x => x(It.isAny())).returns(x => scormAPI.object);

    // when

    // then
  });

  /**
   * saw.configure()
   */
  describe('configure()', () => {
    describe('configure() with a not available API Adapter', () => {

      it('should throw an error if no API Adapter is available', () => {
        (() => {
          apiWrapper.configure();
        }).should.throw(Error, 'A valid SCORM API Adapter can not be found in the window or in the window.opener');

        apiWrapper.isConfigured().should.equals(false);
      });
    });

    describe('configure() with an available API Adapter', () => {

      it('should be initialized after init invocation if the adapter is defined in the current window', () => {
        apiWrapper.configure();
        apiWrapper.isConfigured().should.equals(true);
      });

      it('should be initialized after init invocation if the API is defined in the window.opener', () => {
        const opener:any = window.opener;
        let parent:any = {};
        // building the nested parent structure with max level of deep in parent search
        for (let i:number = 0; i++; i <= 7) {
          parent = {'parent': parent};
        }
        window.parent = parent;
        window.opener = {};
        window.opener.API = {};

        apiWrapper.configure();
        chai.expect(apiWrapper.isConfigured()).should.equals(true);
        window.opener = opener;
      });
    });
  });

});
