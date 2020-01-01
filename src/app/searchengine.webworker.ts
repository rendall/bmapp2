export enum messageType {
  data, query, results, accept
}

export interface MessageData {
  type: messageType,
  year: number,
  value?: any
}

interface ReceiveMessageEvent extends MessageEvent {
  data:MessageData
}

export interface SearchEngineWorker extends Worker {
  onmessage: ((this: Worker, ev: ReceiveMessageEvent) => any) | null;
  postMessage: { (message: MessageData, transfer: Transferable[]): void; (message: MessageData, options?: PostMessageOptions | undefined): void; };
}

import { SearchEngine } from "../search/SearchEngine"

let searchEngines: SearchEngine[] = []

// const onSearchClick = (e: any) => {
//   console.log({ e })
//   const resultsList = document.querySelector("ul.results-list") as HTMLUListElement
//   resultsList.innerHTML = ""

//   const searchInput = document.querySelector("input[type=search]") as HTMLInputElement;
//   const searchTerm = searchInput.value;

//   const searchResult = search.getResultsByTerm(searchTerm)
//   console.log({ searchResult })

// }
const receive = (e: ReceiveMessageEvent) => {
  console.log("searchengine.webworker.onmessage", e)
  const data: MessageData = e.data

  switch (data.type) {
    case messageType.data:
      searchEngines[data.year] = new SearchEngine(data.value)
      const message:MessageData = {
        type: messageType.accept,
        year: data.year
      }
      postMessage(message)
      break;

    case messageType.query:
      const search = searchEngines[data.year]
      if (!search) { 
        postMessage(`unknown year ${data.year}`)
        return;
      }
      const searchResult = search.getResultsByTerm(data.value)
      postMessage(searchResult)

      break


    default: console.error(`Unknown message type '${data.type}'`); break;
  }
  postMessage("message sent")
}
self.onmessage = receive