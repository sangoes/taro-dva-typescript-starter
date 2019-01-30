/**
 * 工具
 */
/**
 * 统一处理action
 * @param type
 */
export const createAction = (type: any) => (payload: any) => ({
  type,
  payload
});

/**
 * 统一处理action
 * @param {*} type
 */
export const createActions = (type: any) => (payload: any) => (
  callback: any
) => ({ type, payload, callback });

/**
 * 网络检查
 * @param {*} response
 */
export const net = (response: any) => response && response.code == 200;
