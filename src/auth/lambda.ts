import { stringify } from 'querystring';
import axios from 'axios';
// import cognitoInfo from '@/static/cognitoInfo.ts';
// import testData from '../static/testData';
// import AWS from 'aws-sdk';
// import { getItemJson } from '../util/storageUtils';
export const domain = 'sonytest.auth.us-east-2.amazoncognito.com';
export const redirectUrl = 'http://localhost:8080/login';
export const userPoolClientId = '6mdsa320oe530p1r774mkjtt98';

const lambda = {
    getToken: (code) => {
        console.log(code)
        let params = new URLSearchParams();
        params.append('grant_type', 'authorization_code')
        params.append('redirect_uri', domain)
        params.append('code', code)
        params.append('client_id', userPoolClientId)
    }
}