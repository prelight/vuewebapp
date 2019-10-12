import i18n from '@/i18n';
import { getItemJson } from '../util/storageUtils';

import cognito from './cognito';

export interface User {
  id: string;
  username: string;
  pass: string;
  description?: string;
  avatar?: string;
  homePage?: string;
  serviceList: string[];
  token: string;
}

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
    id: '0',
    username: 'admin',
    pass: 'admin',
    description: 'Founder of Log:Dash',
    // avatar: 'https://www.tool.sony.biz/ux-conf/download/attachments/160021019/user-avatar',
    avatar: '/img/admin.png',
    homePage: '/logdash/format',
    serviceList: ['1', '2', '3'],
    token: 'test',
  },
  {
    id: '1',
    username: 'demo',
    pass: 'demo',
    description: 'This normal user',
    // avatar: 'https://image.flaticon.com/icons/svg/145/145843.svg',
    avatar: '/img/demo.png',
    homePage: '/logdash/format',
    serviceList: ['1', '2', '3'],
    token: 'test',
  },
  {
    id: '2',
    username: 'hpc',
    pass: 'hpc',
    description: 'This hpc user',
    // avatar: 'https://www.tool.sony.biz/ux-conf/download/attachments/160007784/user-avatar',
    avatar: '/img/demo.png',
    homePage: '/logdash/format',
    serviceList: ['2', '3'],
    token: 'test',
  },
];


const checkLogin = (username, password) => {
  //const cognitouser = cognito.getUser();
  //console.log(cognitouser);
  return DEMO_USERS.find(user => user.username === username && user.pass === password);
  
};

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

const authProvider = {
  login: (username, password): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userInfo = checkLogin(username, password);
        if (userInfo) {
          userInfo.token = 'test_token';
          resolve(userInfo);
        } else {
          reject(i18n.t('login.error'));
        }
      }, 500);
    });
  },

  logout: () => {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
  },

  getCurrentUser,

  getServiceList: (token: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const user = await getCurrentUser(token);
        if (user) {
          const serviceList = TEST_SERVICE_LIST.filter(service =>
            user.serviceList.includes(service.id)
          );
          resolve(serviceList);
        } else {
          reject(new Error('error'));
        }
      }, 200);
    });
  },
};

export default authProvider;
