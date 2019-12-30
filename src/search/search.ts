import Fuse from "fuse.js"
import { BMData, BMInfo } from "../BM";
import { getType } from "../common/utils";

export class SearchEngine {
  readonly getResultsByTerm: (term: string) => BMResultItem[];
  constructor(data: BMData) {

    const options = {
      shouldSort: true,
      findAllMatches: true,
      // 'true as true' below prevents type casting to Boolean
      // q.v. https://github.com/krisk/Fuse/issues/303
      includeScore: true as true,
      includeMatches: true as true,
      threshold: 0.15,
      location: 0,
      distance: 1999,
      maxPatternLength: 32,
      minMatchCharLength: 10,
      keys: [ { "name": "name", "weight": 0.5 }, { "name": "title", "weight": 0.5 }, { "name": "description", "weight": 0.375 }, { "name": "artist", "weight": 0.5 }, { "name": "event_type.label", "weight": 1 }, { "name": "hometown", "weight": 0.25 }, { "name": "location.string", "weight": 1 }, { "name": "type", "weight": 1 } ]
    };
    const allInfo: BMInfo[] = (data.art as BMInfo[]).concat(data.camps as BMInfo[]).concat(data.events as BMInfo[]).map((i: BMInfo) => ({ ...i, type: getType(i) }));
    const allWithDescriptions = allInfo.map((i: BMInfo) => i.description === null ? ({ ...i, description: "" }) : i);
    const fuse = new Fuse(allWithDescriptions, options); // "list" is the item array
    const search = (term: string) => fuse.search(term);

    this.getResultsByTerm = (term: string) => search(term);
    //     this.getResultsByTerm = (term: string) => search(term).map((r) => isEvent(r.item) ? addEventLocationToFuseResult(r) : r).map(resultFromFuseResult);

  }
}

interface BMResultItem {
    item: BMInfo,
    score: number;
    matches: any;
}