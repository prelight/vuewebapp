
// // https://sonytest.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=6mdsa320oe530p1r774mkjtt98&redirect_uri=http://localhost:8081/login
// export const cognitoInfo = {
//   domain : 'sonytest.auth.us-east-2.amazoncognito.com',
//   redirectUrl : 'http://localhost:8081/login',
//   userPoolClientId : '6mdsa320oe530p1r774mkjtt98'
// };

export namespace cognitoInfo {
  export const NAME = "myLibrary";
  export const LICENSE = "MIT";
  export const VERSION = "1.0.1";
  export const PATH = "http://example.jp/path/to/"
  export const domain = 'sonytest.auth.us-east-2.amazoncognito.com';
  export const redirectUrl = 'http://localhost:8081/login';
  export const userPoolClientId = '6mdsa320oe530p1r774mkjtt98';
}

export default cognitoInfo;