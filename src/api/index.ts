export * from './applyApi';
export * from './formatApi';

const STORAGE_KEY_PREFIX = 'logdash';
export const FORMAT_LIST = `${STORAGE_KEY_PREFIX}:format:list`;
export const OS_LIST = `${STORAGE_KEY_PREFIX}:os:list`;
