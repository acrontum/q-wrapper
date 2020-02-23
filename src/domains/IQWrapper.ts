import {ConsumerResponse, QWrapperSettings, Message} from "../models";

export interface IQWrapper {

  settings(): QWrapperSettings;

  settings(settings: QWrapperSettings): void;

  initialize(): Promise<boolean>;

  sendToQueue(message: JSON): boolean;

  consume(callback: (message: Message) => ConsumerResponse): void;

  consumeAsync(callback: (message: Message) => Promise<ConsumerResponse>): Promise<void>;

  close(): void;
}

