// 'use strict';
// import Vue from 'vue';
import AWS from 'aws-sdk';
// import colors from 'vuetify/es5/util/colors';

// const ge = require('./errors');
// const ApiException = require('./apiException');
// const logger = require('../common/logger');
// const AWS = require('aws-sdk');
// const config = require('../common/config');

const cognito = {
    // login: (username, password): Promise<User> => {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         const userInfo = checkLogin(username, password);
    //         if (userInfo) {
    //           userInfo.token = 'test_token';
    //           resolve(userInfo);
    //         } else {
    //           reject(i18n.t('login.error'));
    //         }
    //       }, 500);
    //     });
    //   },

    //getUser : (userPoolId, displayId) => {
    getUser : () => {    
        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({region: 'us-west-2'});
   
        return cognitoIdentityServiceProvider.adminGetUser(
                {UserPoolId: userPoolId, Username: displayId}).promise()
        .then((user) => {
            if (!user) return null;
            console.log(user);
            // return new CognitoUser(displayId,
            // this.constructor.extractCognitoAttributeValue(user.UserAttributes, 'sub'),
            // this.constructor.extractCognitoAttributeValue(user.UserAttributes, 'email'),
            // user.Enabled);
        });
    }
    
}


// class Cognito {
//   constructor (koyane, region) {
//     this.cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({region: region});
//     this.koyane = koyane;
//   }

//   /**
//    * Cognito UserPools から登録情報を取得する
//    */
//   getUser (userPoolId, displayId) {
//     return this.cognitoIdentityServiceProvider.adminGetUser(
//           {UserPoolId: userPoolId, Username: displayId}).promise()
//     .then((user) => {
//       if (!user) return null;
//       return new CognitoUser(displayId,
//         this.constructor.extractCognitoAttributeValue(user.UserAttributes, 'sub'),
//         this.constructor.extractCognitoAttributeValue(user.UserAttributes, 'email'),
//         user.Enabled);
//     });
//   }

//   /**
//    * Cognito UserPools のユーザのAttirbutesを更新する
//    */
//   updateUserAttributes (userPoolId, displayId, userAttributes) {
//     return Promise.resolve()
//       .then(() => {
//         return this.getUser(userPoolId, displayId)
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       })
//       .then((cognitoUser) => {
//         if (cognitoUser === null) {
//           return Promise.reject('cognitoUser was not found.');
//         }
//         return this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(
//               {UserPoolId: userPoolId, Username: displayId, UserAttributes: userAttributes}).promise()
//         .then((result) => {
//           if (result) {
//             return Promise.resolve(result);
//           }
//           return Promise.reject('user attributes update was failed');
//         })
//         .catch((err) => {
//           return Promise.reject(err);
//         });
//       });
//   }

//   /**
//    * Cognito UserPools のユーザを再作成する
//    * isAllowNewUser は Cognito にユーザが未存在でも許容するかどうか
//    * dbTransaction は users へ Cognito UserPools の id を更新する際のトランザクション
//    *
//    * 処理手順
//    * 1. Cognito から User の username, email を取得する
//    * 2. Cognito から User を削除する
//    * 3. Cognito に User を登録する。仮パスワードが指定されている場合は設定する
//    * 4. users に新しい UserPools の UserId (sub) を更新する
//    */
//   recreateUser (userPoolId, poolUrl, userId, displayId, isAllowNewUser, dbTransaction, temporaryPassword) {
//     return Promise.resolve()
//       .then(() => {
//         return this.getUser(userPoolId, displayId)
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       })
//       .then((cognitoUser) => {
//         return Promise.resolve()
//           .then(() => {
//             let providerUserId = (cognitoUser) ? cognitoUser.providerUserId : null;
//             logger.info(`delete ${providerUserId}, ${displayId} on recreateUser.`);
//             return this.cognitoIdentityServiceProvider.adminDeleteUser(
//               {UserPoolId: userPoolId, Username: displayId}).promise();
//           })
//           .then(() => {
//             cognitoUser = cognitoUser || new CognitoUser(displayId); // 新規登録のケース
//             let providerUserId = (cognitoUser) ? cognitoUser.providerUserId : null;
//             logger.info(`create ${providerUserId}, ${displayId} on recreateUser.`);
//             return Promise.all([providerUserId, this.createCognitoUser(userPoolId, cognitoUser, temporaryPassword)]);
//           })
//           .catch((error) => {
//             throw new ApiException(ge.internalServerError, 'recreate error', error, logger.LEVELS.FATAL);
//           });
//       })
//       .then((results) => {
//         let preProviderUserId = results[0];
//         let cognitoUserId = results[1];
//         logger.info(`update authenticationId of ${displayId} from ${preProviderUserId} to ${cognitoUserId} on recreateUser.`);
//         // users テーブルを更新する
//         return this.koyane.user.updateProviderUserId(
//             userId, cognitoUserId, poolUrl,
//             {transaction: dbTransaction})
//           .then((result) => {
//             if (result) return;
//             return Promise.reject('Failed updating providerUserId in user.');
//           });
//       });
//   }

//   // Cognito UserPools にユーザを作成し、作成時に決定されるCognitoUserId(sub)を返す
//   createCognitoUser (userPoolId, cognitoUser, temporaryPassword) {
//     return this.cognitoIdentityServiceProvider.adminCreateUser(
//       this.constructor.generateCreateUserParameter(userPoolId, cognitoUser, temporaryPassword, true)).promise()
//     .then((data) => {
//       let cognitoUserId = this.constructor.extractCognitoAttributeValue(data.User.Attributes, 'sub');
//       if (cognitoUserId) {
//         return Promise.resolve(cognitoUserId);
//       }
//       return Promise.reject('failed created user subject.');
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     });
//   }

//   // Cognito UserPools の登録時にユーザをロックする
//   lockUser (dbName, userRole, displayId) {
//     let key = `cognito_user_${dbName}_${userRole}_${displayId}`;
//     return this.koyane.sequelize.query('SELECT get_lock(:injKey, 0) as result', {
//       replacements: {
//         injKey: key
//       },
//       type: this.koyane.sequelize.QueryTypes.SELECT
//     })
//     .then((results) => {
//       if (!results || !results[0] || results[0].result === 0) {
//         return Promise.reject('failed lock : ' + key);
//       }
//       return Promise.resolve();
//     });
//   }

//   // ロックをリリースする
//   releaseLock (dbName, userRole, displayId) {
//     let key = `cognito_user_${dbName}_${userRole}_${displayId}`;
//     return this.koyane.sequelize.query('SELECT release_lock(:injKey) as result', {
//       replacements: {
//         injKey: key
//       },
//       type: this.koyane.sequelize.QueryTypes.SELECT
//     })
//     .then((results) => {
//       if (!results || !results[0] || results[0].result === 0) {
//         return Promise.reject('failed release lock : ' + key);
//       }
//       return Promise.resolve();
//     });
//   }

//   getCognitoUser (providerUserId) {
//     let params = {
//       UserPoolId: config.cognito.student.poolId,
//       Filter: `sub="${providerUserId.replace(/"/g, '\\"')}"`
//     };
//     return this.cognitoIdentityServiceProvider.listUsers(params).promise()
//     .then((users) => {
//       if (users.Users.length <= 0) {
//         throw new ApiException(ge.internalServerError, 'cognito user was not found', null, logger.LEVELS.ERROR);
//       }
//       return users.Users[0];
//     });
//   }

//   defaultCognitoUserAttribute (cognitoUser, attributeName, defaultValue) {
//     let attribute = cognitoUser.Attributes.find((attr) => attr.Name === attributeName);
//     return attribute ? attribute.Value : defaultValue;
//   }

//   getStudentName (cognitoUser) {
//     const familyName = this.defaultCognitoUserAttribute(cognitoUser, 'family_name', '');
//     const name = this.defaultCognitoUserAttribute(cognitoUser, 'name', '');
//     if (familyName && name) {
//       return `${familyName} ${name}`;
//     } else if (name) {
//       return name;
//     } else if (familyName) {
//       return familyName;
//     } else {
//       throw new ApiException(ge.internalServerError, 'student name was blank', null, logger.LEVELS.ERROR);
//     }
//   }

//   getStudentGender (cognitoUser) {
//     const gender = this.defaultCognitoUserAttribute(cognitoUser, 'gender', '');
//     if (!gender) {
//       return 0;// 不明
//     } else if (gender.toLowerCase() === 'm') {
//       return 1;// 男
//     } else if (gender.toLowerCase() === 'f') {
//       return 2;// 女
//     } else {
//       return 3;// その他
//     }
//   }

//   static generateCreateUserParameter (userPoolId, user, temporaryPassword, suppress) {
//     let parameter = {
//       UserPoolId: userPoolId,
//       Username: user.displayId
//     };
//     if (user.email) {
//       parameter['UserAttributes'] = [{Name: 'email', Value: user.email}];
//     }
//     if (temporaryPassword) {
//       parameter['TemporaryPassword'] = temporaryPassword;
//     }
//     if (suppress) {
//       parameter['MessageAction'] = 'SUPPRESS';
//     }
//     return parameter;
//   }

//   // Cognito から取得したユーザデータから指定した key の Attribute を取得する
//   // adminCreateUser と adminGetUser では取得できる Attributes のオブジェクト名が異なるので注意
//   static extractCognitoAttributeValue (cognitoUserAttributes, key) {
//     let attrs = cognitoUserAttributes;
//     for (let i = 0; i < attrs.length; i++) {
//       if (attrs[i].Name === key) {
//         return attrs[i].Value;
//       }
//     }
//     return null;
//   }
// }

// class CognitoUser {
//   constructor (displayId, providerUserId, email, enabled) {
//     this.displayId = displayId;
//     this.providerUserId = providerUserId;
//     this.email = email;
//     this.enabled = enabled;
//   }
// }

export default cognito;
//module.exports = Cognito;
