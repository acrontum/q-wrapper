import {ConnectionOptions} from "./ConnectionOptions";

export interface QWrapperSettings {
  connection: string | ConnectionOptions;
  queue: string;
  dleQueue: string;
  exchange: string;
  exchangeType: string;
}
