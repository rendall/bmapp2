import { messageType, SearchEngineWorker, ReceiveMessageEvent } from "./searchengine.webworker";
import { BMResultItem } from "../BM";

const searchEngineWorker: SearchEngineWorker = new Worker("searchengine.webworker.js");

fetch("./data/2019.json")
  .then(r => r.json())
  .then(j => searchEngineWorker.postMessage({ type: messageType.data, value: j, year: 2019 }))
  .then(() => {
    document.querySelector("input[type=search]")!.removeAttribute("disabled");
    document.querySelector("button")!.removeAttribute("disabled");
    document.querySelector("p")!.innerText = "Enter search term:";
  })

if (window.Worker) {
  const searchInput = document.querySelector("input[type=search]")! as HTMLInputElement;

  searchInput.onchange = function () {
    searchEngineWorker.postMessage({ type: messageType.query, value: searchInput.value, year: 2019 });
  }

  searchEngineWorker.onmessage = function (e: ReceiveMessageEvent) {
    console.log("received message from searchEngineWorker", e)

    if (e.data.type === messageType.results) {

      const resultsList = document.querySelector("ul.results-list") as HTMLUListElement
      resultsList.innerHTML = ""

      const searchResult: BMResultItem[] = e.data.value;
      searchResult.forEach(result => {
        const li = document.createElement("li")
        li.innerText = `${result.item.name || result.item.title}`
        resultsList.appendChild(li);
      });
    }
  }
} else {
  console.log('Your browser does not support web workers.')
}

// document.querySelector("button")!.addEventListener("click", onSearchClick)