import { getItemJson } from '../util/storageUtils';
import i18n from '@/i18n';

interface LoginToken {
  token: string;
}

export interface ApplyStatus {
  itemId: string;
  date: string;
  title: string;
  description: string;
  version: string;
  applicant: string;
  approver: [];
  approvalStatus: string;
  action: ApplyAction;
  updatedAt: string;
  comment?: Comment[] | string;
  draft?: boolean;
}

export interface ApplyItem {
  record: ApplyRecord;
  comment?: Comment[];
}

export enum ApplyAction {
  None,
  Apply,
  Confirm,
  Cancel,
  Reapply,
}

export interface ApplyRecord {
  itemId: string;
  date: string;
  title: string;
  version: string;
  applicant: string;
  approver: string;
  approvalStatus: string;
  updatedAt: string;
  comment: Comment;
}

export interface Comment {
  commentId?: string; // TODO: 本来必須
  datetime: string;
  content: string;
  commenter: string;
  category?: string;
}

const user = getItemJson(localStorage, 'user', {});

const getApplyId = () => {
  const applyId = localStorage.getItem('applyId') || '0';
  const next = (Number(applyId) + 1).toString();
  localStorage.setItem('applyId', next);
  return next;
};

const applyApi = {
  getList: (serviceId: string): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applyStatusList = JSON.parse(localStorage.getItem('applyStatusList'));
        resolve(applyStatusList ? applyStatusList[serviceId] : []);
      }, 500);
    });
  },

  create: (serviceId, status): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newStatus = status;

        let applyStatusList = getItemJson(localStorage, 'applyStatusList', {});

        newStatus.itemId = getApplyId();

        if (applyStatusList[serviceId]) {
          applyStatusList[serviceId].push(newStatus);
        } else {
          applyStatusList = { [serviceId]: [newStatus] };
        }

        localStorage.setItem('applyStatusList', JSON.stringify(applyStatusList));
        resolve(newStatus.itemId);
      }, 500);
    });
  },

  update: (serviceId, applyId, updateStatus: ApplyStatus): Promise<any | void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applyStatusAll = getItemJson(localStorage, 'applyStatusList', {});
        const applyStatusList = applyStatusAll[serviceId] || [];

        const applyStatus: ApplyStatus = applyStatusList.find(
          (status: ApplyStatus) => status.itemId === applyId
        );

        if (applyStatus) {
          applyStatus.draft = false;
          applyStatus.title = updateStatus.title;
          applyStatus.description = updateStatus.description;
          applyStatus.comment = updateStatus.comment;
          applyStatus.approvalStatus = updateStatus.approvalStatus;
          applyStatus.approver = updateStatus.approver;
          applyStatus.applicant = updateStatus.applicant;
          localStorage.setItem('applyStatusList', JSON.stringify(applyStatusAll));
          return resolve(applyStatus);
        }
        return reject(new Error('指定された申請リクエストは存在しません'));
      }, 500);
    });
  },

  cancel: (serviceId, applyId, status: ApplyStatus): Promise<string | void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applyStatusListAll = getItemJson(localStorage, 'applyStatusList', {});
        const applyStatusList = applyStatusListAll[serviceId];

        if (applyStatusList) {
          const updateApplyStatus = applyStatusList.find(
            (applyStatus: ApplyStatus) => applyStatus.itemId === applyId
          );
          updateApplyStatus.draft = false;
          updateApplyStatus.comment = status.comment;
          updateApplyStatus.approvalStatus = 'canceled';
          // updateapplyStatus.approver = user.username;
          // updateapplyStatus.applicant = '';
          updateApplyStatus.updatedAt = new Date().toLocaleString();
          localStorage.setItem('applyStatusList', JSON.stringify(applyStatusListAll));
          resolve(applyId);
        }
      }, 500);
    });
  },
};

export default applyApi;
