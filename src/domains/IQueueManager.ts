import {ConsumerResponse, QueueSettings, Message} from "../models";

export interface IQueueManager {

  settings(): QueueSettings;

  settings(settings: QueueSettings): void;

  initialize(): Promise<boolean>;

  sendToQueue(message: JSON): boolean;

  consume(callback: (message: Message) => ConsumerResponse): void;

  consumeAsync(callback: (message: Message) => Promise<ConsumerResponse>): Promise<void>;

  close(): void;
}

