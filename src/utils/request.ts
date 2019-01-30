import Taro from "@tarojs/taro";
import qs from "qs";

/**
 * 判断开发环境
 */
export const IS_DEV = process.env.NODE_ENV === "development";
/**
 * base url
 */
export const BASE_URL = IS_DEV
  ? "http://localhost:8080"
  : "http://www.sangoes.com";

/**
 * message
 */
export const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

export interface Response {
  data: any;
  msg: string;
  code: number;
  header: any;
}

/**
 * 检查http状态值
 * @param response
 * @returns {*}
 */
function checkHttpStatus(response: any) {
  if (response.code >= 200 && response.code < 300) {
    Taro.hideNavigationBarLoading();
    return response.data;
  }
  const message = codeMessage[response.code] || `ERROR CODE: ${response.code}`;
  const error: any = new Error(message);
  error.response = response;
  throw error;
}

/**
 * 检查返回值是否正常
 * @param data
 * @returns {*}
 */
function checkSuccess(data: any, resolve) {
  if (data instanceof ArrayBuffer && typeof data === "string") {
    return data;
  }

  if (typeof data.code === "number" && data.code === 200) {
    return resolve(data);
  }

  const error: any = new Error(data.message || "服务端返回异常");
  error.data = data;
  throw error;
}

/**
 * 请求错误处理
 * @param error
 * @param reject
 */
function throwError(error, reject) {
  Taro.hideNavigationBarLoading();
  if (error.errMsg) {
    reject("服务器正在维护中!");
    throw new Error("服务器正在维护中!");
  }
  throw error;
}

export default {
  request(options: any, method?: string) {
    const { url } = options;
    return new Promise((resolve, reject) => {
      Taro.showNavigationBarLoading();
      Taro.request({
        ...options,
        method: method || "GET",
        url: `${BASE_URL}${url}`,
        header: {
          "content-type": "application/x-www-form-urlencoded",
          ...options.header
        }
      })
        .then(checkHttpStatus)
        .then(res => {
          checkSuccess(res, resolve);
        })
        .catch(error => {
          throwError(error, reject);
        });
    });
  },
  get(options: any) {
    return this.request({
      ...options
    });
  },
  post(options: any) {
    return this.request(
      {
        ...options,
        data: qs.stringify(options.data)
      },
      "POST"
    );
  }
};
