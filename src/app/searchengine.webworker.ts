export enum messageType {
  data = "data", query = "query", results = "results", accept = "accept", error="error"
}

export interface MessageData {
  type: messageType,
  year: number,
  value?: any
}

export interface ReceiveMessageEvent extends MessageEvent {
  data: MessageData
}

export interface SearchEngineWorker extends Worker {
  onmessage: ((this: Worker, ev: ReceiveMessageEvent) => any) | null;
  postMessage: { (message: MessageData, transfer: Transferable[]): void; (message: MessageData, options?: PostMessageOptions | undefined): void; };
}

import { SearchEngine } from "../search/SearchEngine"

let searchEngines: SearchEngine[] = []

const receive = (e: ReceiveMessageEvent) => {
  const data: MessageData = e.data

  switch (data.type) {
    case messageType.data:
      searchEngines[data.year] = new SearchEngine(data.value)
      const message: MessageData = {
        type: messageType.accept,
        year: data.year
      }
      postMessage(message)
      break;

    case messageType.query:
      const search = searchEngines[data.year]
      if (!search) {
        postMessage({ type: messageType.error, year: data.year, value: `unknown year ${data.year}` })
        return;
      }
      const searchResult = search.getResultsByTerm(data.value)
      const resultsMessage: MessageData = {
        type: messageType.results,
        year: data.year,
        value: searchResult
      }
      postMessage(resultsMessage)

      break


    default: console.error(`Unknown message type '${data.type}'`); break;
  }
}
self.onmessage = receive