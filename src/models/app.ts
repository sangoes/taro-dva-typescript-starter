import { Model } from "../utils/dva";
import { AppState } from "./states/app";
import modelExtend from "dva-model-extend";
import { model } from "../utils/model";

/**
 * app
 */
export default modelExtend(model, {
  namespace: "app",
  state: {
    appStatus: true
  } as AppState,
  reducers: {},
  effects: {},
  subscriptions: {}
} as Model);
