export interface BMData {
    camps: BMCamp[];
    art: BMArt[];
    events: BMEvent[];
    timestamp: number;
}

interface BMInfo extends Object {
    uid: string;
    name?: string | null;
    title?: string;
    hometown?: string | null;
    description: string | null;
    print_description?: string;
    year: number;
    url: string | null;
}

export interface BMCamp extends BMInfo {
    name?: string | null;
    contact_email: string | null;
    hometown?: string | null;
    location: BMCampLocation;
    location_string: string | null;
}

export interface BMCampView extends BMCamp {
    events: BMEvent[];
}

export interface BMCampLocation {
    string: string | null;
    frontage: string | null;
    intersection: string | null;
    intersection_type: string | null;
    dimensions: string | null;
}

export interface BMArt extends BMInfo {
    name: string | null;
    contact_email: string | null;
    hometown: string | null;
    artist: string | null;
    category: string | null;
    program: string | null;
    donation_link: string | null;
    guided_tours: number;
    self_guided_tour_map: number;
    location: BMArtLocation;
    location_string: string | null;
    images?: BMArtImage[];
}

export enum BMInfoType {
    art,
    camp,
    event
}

export interface BMArtView extends BMArt {
    events: BMEvent[];
}

export interface BMArtLocation {
    string: string | null;
    hour: number | null;
    minute: number | null;
    distance: number | null;
    category: string | null;
    gps_latitude: number | null;
    gps_longitude: number | null;
}

export interface BMArtImage {
    gallery_ref: number | null;
    thumbnail_url: string | null;
}

export interface BMEvent extends BMInfo {
    event_id: number;
    title: string;
    event_type: BMEventType;
    print_description: string;
    slug: string;
    hosted_by_camp: string | null;
    located_at_art: string | undefined | null;
    other_location: string;
    check_location: number;
    all_day: number | null;
    contact?: string;
    occurrence_set?: BMEventOccurrence[];
}

export interface BMEventView extends BMEvent {
    camp?: BMCamp;
    art?: BMArt;
}

export interface BMEventOccurrence {
    start_time: string;
    end_time: string;
}

export interface BMEventType {
    id: number;
    label: string;
    abbr: string
}

export interface BMResultItem {
  item: BMInfo,
  score: number;
  matches: any;
}