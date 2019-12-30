import { SearchEngine } from "../search/search"
let search: SearchEngine
fetch("./data/2019.json")
  .then(r => r.json())
  .then(j => { search = new SearchEngine(j) })
  .then(() => {
    document.querySelector("input[type=search]")!.removeAttribute("disabled");
    document.querySelector("button")!.removeAttribute("disabled");
    document.querySelector("p")!.innerText = "Enter search term:";
  })

const onSearchClick = (e: any) => {
  console.log({ e })

  const resultsList = document.querySelector("ul.results-list") as HTMLUListElement
  resultsList.innerHTML = ""


  const searchInput = document.querySelector("input[type=search]") as HTMLInputElement;
  const searchTerm = searchInput.value;

  const searchResult = search.getResultsByTerm(searchTerm)
  console.log({ searchResult })

  searchResult.forEach(result => {
    const li = document.createElement("li")
    li.innerText = `${result.item.name || result.item.title}`
    resultsList.appendChild(li);

    console.log({ li })
  });




}
document.querySelector("button")!.addEventListener("click", onSearchClick)