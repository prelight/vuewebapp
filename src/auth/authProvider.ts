import i18n from '@/i18n';
import { getItemJson } from '../util/storageUtils';
import cognitoInfo from '@/static/cognitoInfo';
import axios, { AxiosResponse } from 'axios';
import { userInfo } from 'os';
import Amplify,{ Auth,API } from 'aws-amplify';

export interface User {
  // id: string;// いらない?
  username: string; // email?
  // pass: string; // いらないはず
  description?: string;
  avatar?: string; // 権限取得後？
  homePage?: string; // 権限取得後？
  serviceList: string[]; // 権限取得後？

  accessToken: string;
  idToken: string;
  refreshToken: string;
  sub: string;
}// 

export interface ServiceIdInfo {
  text: string;
  value: string;
  icon?: string;
}

const TEST_SERVICE_LIST = [
  { id: '1', text: 'ECIA', value: 'ecia', icon: 'mdi-application' },
  { id: '2', text: 'Music Center (旧SongPal)', value: 'songpal', icon: 'mdi-application' },
  { id: '3', text: 'HPC', value: 'hpc', icon: 'mdi-application' },
];


export const DEMO_USERS: User[] = [
  {
    // id: '0',
    username: 'admin',
    // pass: 'admin',
    description: 'Founder of Log:Dash',
    // avatar: 'https://www.tool.sony.biz/ux-conf/download/attachments/160021019/user-avatar',
    avatar: '/img/admin.png',
    homePage: '/logdash/format',
    serviceList: ['1', '2', '3'],
    // token: 'test',
    accessToken: '',
    idToken: '',
    refreshToken: '',
    sub: '',
  },
  {
    // id: '1',
    username: 'demo',
    // pass: 'demo',
    description: 'This normal user',
    // avatar: 'https://image.flaticon.com/icons/svg/145/145843.svg',
    avatar: '/img/demo.png',
    homePage: '/logdash/format',
    serviceList: ['1', '2', '3'],
    // token: 'test',
    accessToken: '',
    idToken: '',
    refreshToken: '',
    sub: '',    
  },
  {
    // id: '2',
    username: 'hpc',
    // pass: 'hpc',
    description: 'This hpc user',
    // avatar: 'https://www.tool.sony.biz/ux-conf/download/attachments/160007784/user-avatar',
    avatar: '/img/demo.png',
    homePage: '/logdash/format',
    serviceList: ['2', '3'],
    // token: 'test',
    accessToken: '',
    idToken: '',
    refreshToken: '',
    sub: '',
  },
];


// const checkLogin = (username, password) => {
//   // const cognitouser = cognito.getUser();
//   // console.log(cognitouser);
//   return DEMO_USERS.find(user => user.username === username && user.pass === password);
// };

// const checkLogin = code => {
//   const token = cognito.getToken(code);
//   DEMO_USERS[0].token = token;
//   // const user = new User;
//   return DEMO_USERS[0];
//   // return DEMO_USERS.find(user => user.username === username && user.pass === password);
// };

const getCurrentUser = (token: string): Promise<User | void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getItemJson(localStorage, 'user', undefined);
      if (user) {
        resolve(user);
      } else {
        reject(i18n.t('login.error'));
      }
    }, 200);
  });
};

const getToken = async (code: string): Promise<AxiosResponse | void> => {
  let params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', cognitoInfo.REDIRECT_URL);
  params.append('code', code);
  params.append('client_id', cognitoInfo.USERPOOL_CLIENTID);

  try {
    const token = await axios.post(`${cognitoInfo.BASE_URL}/oauth2/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return Promise.resolve(token);
  } catch (e) {
    return Promise.reject(i18n.t('login.error'));
  }
};

const getUserInfo = async (token: any): Promise<AxiosResponse | void> => {
  const bearer = `Bearer ${token.data.access_token}`;
  try {
    const userInfo = await axios.post(`${cognitoInfo.BASE_URL}/oauth2/userInfo`, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': bearer,
      },
    });
    return Promise.resolve(userInfo);
  } catch (e) {
    Promise.reject(i18n.t('login.error'));
  }
};

const authProvider = {
  login: async (code : string): Promise<User> => {
    // return new Promise(async (resolve, reject) => {
    //  return async (resolve, reject) => {
      try {
        const token: any = await getToken(code);
        const userInfo: any = await getUserInfo(token);
        const user: User = {
          // username: userInfo.data.email,
          username: userInfo.data.username,
          sub: userInfo.data.sub,
          accessToken: token.data.access_token,
          idToken: token.data.id_token,
          refreshToken: token.data.refresh_token,
          homePage: '/logdash/format',
          avatar: '/img/admin.png',
          serviceList: ['1', '2', '3'], // 権限取得後？
        };
        return Promise.resolve(user);
      }
      catch (e) {
        Promise.reject(i18n.t('login.error'));
      }
      // ---------------------------------
      // let params = new URLSearchParams();
      // params.append('grant_type', 'authorization_code');
      // params.append('redirect_uri', cognitoInfo.REDIRECT_URL);
      // params.append('code', code);
      // params.append('client_id', cognitoInfo.USERPOOL_CLIENTID);

      // return axios.post(`${cognitoInfo.BASE_URL}/oauth2/token`, params, {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // })
      // .then(token => {
      //   let bearer = 'Bearer ' + token.data.access_token
      //   axios.post(`${cognitoInfo.BASE_URL}/oauth2/userInfo`, {}, {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //       'Authorization': bearer
      //     }
      //   })
      //   .then(userInfo => {
      //     let user : User =  {
      //       username: userInfo.data.email, // ???
      //       sub: userInfo.data.sub,
      //       access_token: token.data.access_token,
      //       id_token: token.data.id_token,
      //       refresh_token: token.data.refresh_token,
      //       homePage: '/logdash/format',
      //       avatar: '/img/admin.png', // 権限取得後？
      //       serviceList: ['1', '2', '3'] // 権限取得後？
      //     }
      //     resolve(user);
      //   })
      //   .catch(e => {
      //     reject(i18n.t('login.error'));
      //   });
      // })
      // .catch(e => {
      //   reject(i18n.t('login.error'));
      // });
    // });
  },

  // login: (username, password): Promise<User> => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('kokoha torunoka');
  //       const userInfo = checkLogin(username, password);
  //       if (userInfo) {
  //         userInfo.token = 'test_token';
  //         resolve(userInfo);
  //       } else {
  //         reject(i18n.t('login.error'));
  //       }
  //     }, 500);
  //   });
  // },

  logout: () => {
    // remove user from local storage to log user out
    const user: string = localStorage.getItem('user');
    localStorage.removeItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.LastAuthUser`);
    localStorage.removeItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.accessToken`);
    localStorage.removeItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.idToken`);
    localStorage.removeItem(`CognitoIdentityServiceProvider.${cognitoInfo.USERPOOL_CLIENTID}.${user.sub}.refreshToken`);
    localStorage.removeItem('user');
  },

  getCurrentUser,

  getServiceList: async (token: string): Promise<any> => {
    Amplify.configure({
      Auth: {
        identityPoolId: 'us-east-2:407c0b68-9a34-4fa1-a916-47bd46686284',
        region: 'us-east-2',
        userPoolId: 'us-east-2_I3nRjackN',
        userPoolWebClientId: '6mdsa320oe530p1r774mkjtt98',
      },
      API: {
        endpoints: [
          {
            name: "AmplifyTest",
            endpoint: "https://pwoihyr22i.execute-api.us-east-2.amazonaws.com/v1",
            region: 'us-east-2',
            //endpoint: "https://gi94xc5bhj.execute-api.us-west-2.amazonaws.com/alpha1"
          }
        ]
      }
    });

    // Amplify.API.get('AmplifyTest', '/logdash/auth/ssss')
    // const ret = await Amplify.API.get('AmplifyTest', '/logdash/auth/ssss')
    // const ret = await Amplify.API.get('AmplifyTest', '/guest')
    const ret = await Amplify.API.get('AmplifyTest', '/member')
    console.log('******* 005');
    console.log(ret);
    return ret;
    // .then(res => {
    //   console.log('******* 005');
    //   console.log(res);
    //   return Promise.resolve(res);
    // })
    // .cache(e => {
    //   return Promise.reject(e);
    // });
    // // console.log('******* 006');

    // .then((
    //   return 
    // ))

    // return new Promise((resolve, reject) => {
    //   setTimeout(async () => {
    //     const user = await getCurrentUser(token);
    //     if (user) {
    //       const serviceList = TEST_SERVICE_LIST.filter(service =>
    //         user.serviceList.includes(service.id)
    //       );
    //       resolve(serviceList);
    //     } else {
    //       reject(new Error('error'));
    //     }
    //   }, 200);
    // });
  },
};

export default authProvider;
