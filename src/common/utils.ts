import { BMInfo } from "../BM";

export const isEmpty = (a: any) => a === undefined || a === null || a === "" || (a.hasOwnProperty("length") && a.length === 0);
export const isArt = (i: BMInfo) => i.hasOwnProperty("artist");
export const isEvent = (i: BMInfo) => i.hasOwnProperty("event_id");
export const isCamp = (i: BMInfo) => i.hasOwnProperty("contact_email") && !i.hasOwnProperty("artist");
export const getType = (i: BMInfo) => isArt(i) ? 'art' : isEvent(i) ? 'event' : isCamp(i) ? 'camp' : '';