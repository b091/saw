import * as TypeMoq from 'typemoq';

function someGlobalFuncWithArgs(a:any, b:any, c:any):any {
  return 'someGlobalFuncWithArgs was called';
}
function someGlobalFunc() {
 return 'someGlobalFunc';
}

describe('testing tests', () => {

  let container:any;

  someGlobalFunc();

  beforeEach(() => {
    container = window;
  });

  describe('initially', () => {

    it('should check that global no args function is auto sandboxed', () => {

      const mock:any = TypeMoq.GlobalMock.ofInstance(someGlobalFunc, null, container);

      mock.verify(x => x(), TypeMoq.Times.never());

      TypeMoq.GlobalScope.using(mock).with(() => {
        container.someGlobalFunc();
        container.someGlobalFunc();
        mock.verify(x => x(), TypeMoq.Times.exactly(2));
      });

      container.someGlobalFunc();
      mock.verify(x => x(), TypeMoq.Times.exactly(2));
    });

  });

});
