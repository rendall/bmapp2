import { BMData, BMEvent, BMCamp, BMArt } from '../BM';
import { SearchEngine } from './search'

const mockData: BMData = {
  camps: [
    {
      uid: "a1X0V0000048WdaUAE",
      year: 2019,
      name: "Shmit16",
      url: null,
      contact_email: null,
      hometown: "Moscow",
      description: "Welcome to our camp for conversations and chilled tea lounge.",
      location: {
        string: null,
        frontage: null,
        intersection: null,
        intersection_type: null,
        dimensions: null
      },
      location_string: null
    },
    {
      uid: "a1X0V0000047LvrUAE",
      year: 2019,
      name: "Camp LoompaLand",
      url: null,
      contact_email: "loompaland@yahoo.com",
      hometown: "Reno",
      description: "A Willy Wonka Themed camp bringing back all of your childhood memories in an life sized, shenanigan filled environment with adult beverages, sweet edible indulgences and more!\r\nDon't miss out on your chance to win the golden ticket in our LoompaWalk contest!",
      location: {
        string: null,
        frontage: null,
        intersection: null,
        intersection_type: null,
        dimensions: null
      },
      location_string: null
    }
  ],
  art: [
    {
      uid: "a2I0V000001AXjEUAW",
      year: 2019,
      name: "BRC Wheels On Meals - Year #8",
      url: "https://www.facebook.com/groups/BRCWheelsOnMeals/",
      contact_email: "lysajoy@gmail.com",
      hometown: "Livermore, CA",
      description: "The BRC Wheels on Meals \"rig\"  is a 4 x 8 trailer with a shade structure and bright yellow and black banners. Our rig is pulled by a truck with our logo on the side or by our golf cart.",
      artist: "Lysa J. Morgan",
      category: "Open Playa",
      program: "Self-Funded",
      donation_link: null,
      guided_tours: 0,
      self_guided_tour_map: 0,
      location: {
        string: null,
        hour: null,
        minute: null,
        distance: null,
        category: null,
        gps_latitude: null,
        gps_longitude: null
      },
      location_string: null,
      images: [
        {
          gallery_ref: 0,
          thumbnail_url: "https://embed.widencdn.net/img/burningman/0pch7vjo5u/640px/a2I0V000001AXjEUAW-1.jpeg?keep=c&crop=yes&u=r3rtjx"
        }
      ]
    },
    {
      uid: "a2I0V000001T9tlUAC",
      year: 2019,
      name: "Playa putt",
      url: null,
      contact_email: null,
      hometown: "boulder, colorado",
      description: "Come play playa putt (miniature golf). See if you can maneuver your ball through a miniature Black Rock City complete with the black hole, orgy dome, Sound camp, the man, the temple, a herd of sparkle pony's and much more. Watch out for the mutant vehicle! If you make it through you get an amazing prize!",
      artist: "Swarm of misfits art collective",
      category: "Art in Camp",
      program: "Self-Funded",
      donation_link: null,
      guided_tours: 0,
      self_guided_tour_map: 0,
      location: {
        string: null,
        hour: null,
        minute: null,
        distance: null,
        category: null,
        gps_latitude: null,
        gps_longitude: null
      },
      location_string: null,
      images: [
        {
          gallery_ref: 0,
          thumbnail_url: "https://embed.widencdn.net/img/burningman/wmk2ncusni/640px/a2I0V000001T9tlUAC-1.jpeg?keep=c&crop=yes&u=r3rtjx"
        }
      ]
    }
  ],
  events: [
    {
      event_id: 33040,
      title: "Itâ€™s a Zoo at the Pond!",
      uid: "SkVqq5F8UrcGBQyV5HDa",
      description: "Get ready for a wild time! Heavy Petting Zoo is rolling into the Pond for an afternoon of dancing with your favorite party animals.",
      event_type: {
        id: 2,
        label: "Gathering/Party",
        abbr: "prty"
      },
      year: 2019,
      print_description: "Get ready for a wild time! Heavy Petting Zoo is rolling into the Pond for an afternoon of dancing with your favorite party animals.",
      slug: "SkVqq5F8UrcGBQyV5HDa-its-a-zoo-at-the-pond",
      hosted_by_camp: "a1X0V0000047U2dUAE",
      located_at_art: null,
      other_location: "",
      check_location: 0,
      url: "",
      all_day: null,
      occurrence_set: [
        {
          start_time: "2019-08-30T13:00:00-07:00",
          end_time: "2019-08-30T18:00:00-07:00"
        }
      ]
    },
    {
      event_id: 30152,
      title: "Low Hanging Fruit Ecstatic Dance",
      uid: "TUa2sM8dZRHftsq92m93",
      description: "Ecstatic dance empowers people of all shapes, sizes, and backgrounds to freely express themselves. Dance without inhibition. In Tiara.",
      event_type: {
        id: 2,
        label: "Gathering/Party",
        abbr: "prty"
      },
      year: 2019,
      print_description: "Ecstatic dance empowers people of all shapes, sizes, and backgrounds to freely express themselves. Dance without inhibition. In Tiara.",
      slug: "TUa2sM8dZRHftsq92m93-low-hanging-fruit-ecstatic-dance",
      hosted_by_camp: "a1X0V000003e8KgUAI",
      located_at_art: null,
      other_location: "",
      check_location: 0,
      url: "",
      all_day: null,
      occurrence_set: [
        {
          start_time: "2019-08-29T09:30:00-07:00",
          end_time: "2019-08-29T11:00:00-07:00"
        }
      ]
    }
  ]
}

describe(`Search test`, () => {

  it(`data loaded`, () => {
    expect(mockData).toBeDefined();
  })

  const search = new SearchEngine(mockData)

  it(`search for "playa" yields results`, () => {
    const results = search.getResultsByTerm("playa")
    expect(results).toHaveLength(1)
  });

  it(`search for "XXPPXXP" yields no results`, () => {
    const results = search.getResultsByTerm("XXPPXXP")
    expect(results).toHaveLength(0)
  });
});
