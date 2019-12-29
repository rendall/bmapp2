import { SearchEngine } from "../search/search"
let search: SearchEngine
fetch("./data/2019.json").then(r => r.json()).then(j => {
  search = new SearchEngine(j)
})

const onSearchClick = (e:any) => {
  console.log({e})

  const searchInput = document.querySelector("input[type=search]") as HTMLInputElement;
  const searchTerm = searchInput.value;

  const searchResult = search.getResultsByTerm(searchTerm)
  console.log({ searchResult })


}
document.querySelector("button")!.addEventListener("click", onSearchClick)