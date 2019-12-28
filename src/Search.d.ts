export interface BMResultItem {
    uid: string;
    name: string;
    type: BMInfoType;
    event_type?: BMEventType;
    location?: BMCampLocation | BMArtLocation;
    matches?: ResultMatches[],
    score?: number,
    final: Date | null,
    xy?: [number, number]
}