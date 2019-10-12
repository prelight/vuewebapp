import { FORMAT_LIST } from './index';
import { getItemJson } from '../util/storageUtils';
import { versionOfServiceList as eciaFormatVersionList } from '@/static/eciaActions'; // ActionTypeIDのリスト
import sampleActionDetail from '@/static/action3000Detail';

export interface GetRequestModel {
  serviceId: string;
  version?: string;
  typeId?: number | undefined;
}

export interface GetCustomGroupRequestModel {
  serviceId: string;
  groupName: string;
  version?: string;
}

export interface GetCustomDataRequestModel {
  serviceId: string;
  groupName: string;
  version: string;
  id: number;
}

export interface CreateNewVersionRequestModel {
  serviceId: string;
  version: any;
  format: [];
}

export interface AddKeyRequestModel {
  serviceId: string;
  version: string;
  action: { typeId: string };
}
export interface FormatDataModel {
  id: string | number;
  eventId?: string;
  typeId?: string | number;
}
export interface OSDataModel {
  text: string;
  value: string;
  icon?: { name: string; color: string };
}

export interface Version {
  text: string;
  value: string;
  draft: boolean;
}

const user = getItemJson(localStorage, 'user', {});

const DEFAULT_SERVICE = {
  text: 'サービスの選択',
  value: '_none',
  icon: 'mdi-service',
};

const getCurrentService = () => {
  return getItemJson(sessionStorage, 'defaultService', DEFAULT_SERVICE);
};

const getLatestVersion = (serviceId: string, draft: boolean = true) => {
  const targetService = serviceId || getCurrentService().value;
  const versionList = getItemJson(localStorage, 'versionList', {
    ecia: eciaFormatVersionList,
  })[targetService];

  if (!versionList) {
    return {};
  }

  const filterdList = !draft ? versionList.filter(version => !version.draft) : versionList;

  return filterdList ? filterdList[0] : {};
};

const getFormatListAll = (serviceId: string) => {
  const formatList = getItemJson(localStorage, FORMAT_LIST, {})[serviceId];
  return formatList || {};
};

const getFormatData = (serviceId?: string, version?: string) => {
  const targetService = serviceId || getCurrentService().value;
  let targetVersion = version;
  if (!targetVersion) {
    targetVersion = getLatestVersion(targetService).value;
  }
  const formatList = getItemJson(localStorage, FORMAT_LIST, {})[targetService];
  return formatList ? formatList[targetVersion] : [];
};

const getDetail = (typeId: number, serviceId?: string, version?: string) => {
  const service = serviceId || getCurrentService().value;
  const formatList = getFormatData(service, version);
  return (
    formatList.find(format =>
      format.id ? format.id === String(typeId) : format.typeId === typeId
    ) || {}
  );
};

const getVersion = ({
  serviceId,
  version,
  typeId,
}: {
  serviceId?: string;
  version?: string;
  typeId?: string | number;
}) => {
  const versionList = getItemJson(localStorage, 'versionList', {});
  return serviceId ? versionList[serviceId] : versionList;
};

const getDraftVersion = ({ serviceId }) => {
  const versionList = getVersion({ serviceId }) || [];
  return versionList.filter((version: Version) => version.draft);
};

const getCustomFieldList = ({ serviceId }) => {
  const versionList = getItemJson(localStorage, 'customFieldList', {})[serviceId];
  return versionList;
};

const updateAction = ({ serviceId, version, action }: AddKeyRequestModel) => {
  const formatList = getItemJson(localStorage, FORMAT_LIST, []);
  const index = formatList[serviceId][version].findIndex(
    currentAction => currentAction.typeId === action.typeId
  );
  formatList[serviceId][version].splice(index, 1, action);

  localStorage.setItem(FORMAT_LIST, JSON.stringify(formatList));

  return action;
};

const getList = ({ serviceId, version }): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(getFormatData(serviceId, version));
    }, 200);
  });
};

const getGroupList = ({ serviceId, version }): Promise<Object> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customGroupList = getItemJson(localStorage, 'customGroupList', {})[serviceId];
      resolve(customGroupList);
    }, 200);
  });
};

const formatApi = {
  get: (request: GetRequestModel): Promise<Array<any>> => {
    const { serviceId, version, typeId } = request;
    if (typeId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(getDetail(typeId, serviceId, version));
        }, 200);
      });
    }
    return getList({ serviceId, version });
  },
  updateAction: (request: AddKeyRequestModel): Promise<{} | void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const action = updateAction(request);
        resolve(action);
      }, 200);
    });
  },
  getVersion: (request: GetRequestModel): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(getVersion(request));
      }, 200);
    });
  },

  getNextTypeId: (request: GetRequestModel): Promise<Number> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const formatData = getFormatData();
        const lastIndex = formatData.length - 1;
        const latestTypeId = formatData[lastIndex].typeId;
        resolve(latestTypeId ? Number(latestTypeId) + 1 : 0);
      }, 200);
    });
  },

  getDraftVersion: (request: GetRequestModel): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(getDraftVersion(request));
      }, 200);
    });
  },
  getCustomFieldList: (request: GetRequestModel): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(getCustomFieldList(request));
      }, 200);
    });
  },
  getEventIdMap: (request: GetRequestModel): Promise<Object> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { serviceId } = request;
        const formatList = getFormatListAll(serviceId);
        const eventIdMap = {};
        Object.keys(formatList).forEach(version => {
          eventIdMap[version] = formatList[version].map(event => event.id);
        });

        resolve(eventIdMap);
      }, 200);
    });
  },
  getCustomGroup: (request: GetCustomGroupRequestModel): Promise<Object> => {
    const { serviceId, groupName, version } = request;
    const targetService = serviceId || getCurrentService().value;
    if (groupName) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const customGroupList = getItemJson(localStorage, 'customGroupList', {})[targetService];
          const cutomGroupItem = customGroupList ? customGroupList[groupName] : {};
          resolve(version ? cutomGroupItem[version] || {} : cutomGroupItem);
        }, 200);
      });
    }
    return getGroupList({ serviceId: targetService, version });
  },
  getCustomData: (request: GetCustomDataRequestModel): Promise<Object> => {
    const { serviceId, groupName, version, id } = request;
    const targetService = serviceId || getCurrentService().value;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customGroupList = getItemJson(localStorage, 'customGroupList', {})[targetService];
        const cutomGroupItem = customGroupList[groupName][version];
        resolve(cutomGroupItem ? cutomGroupItem.data.find(item => item.id === id) : {});
      }, 200);
    });
  },
  createNewVersion: (request: CreateNewVersionRequestModel): Promise<Number | undefined> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const versionList = getVersion({});
        const { serviceId, version, format } = request;

        versionList[serviceId].unshift(version);
        localStorage.setItem('versionList', JSON.stringify(versionList));

        const formatList = getItemJson(localStorage, FORMAT_LIST, {});
        formatList[serviceId][version.value] = format;

        localStorage.setItem(FORMAT_LIST, JSON.stringify(formatList));

        resolve(1);
      }, 200);
    });
  },
};

export default formatApi;
