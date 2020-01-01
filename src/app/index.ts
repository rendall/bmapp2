import { messageType, SearchEngineWorker } from "./searchengine.webworker";

const searchEngineWorker:SearchEngineWorker = new Worker("searchengine.webworker.js");

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
    console.log('Message posted to worker');
  }

  searchEngineWorker.onmessage = function (e) {
    console.log('Message received from worker', e);
  }
} else {
  console.log('Your browser does not support web workers.')
}

// document.querySelector("button")!.addEventListener("click", onSearchClick)