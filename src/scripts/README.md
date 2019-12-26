# Scripts source

Build these files with this command: `tsc -p tsconfig.scripts.json`. They will be built and deployed to `./scripts` directory. Then to use them, in terminal from project root, write: `node scripts/<filename>`

## getdata

Before building, ensure that the `.env` file exists in the project root directory, populated according to `.env.example`. This will require a Burning Man API key, for which you can apply by emailing the Burning Man organization.

This command is intended to download and collate data from the BM API. When it's complete, there should be a `./data` directory in project root that has a series of `.json` files beginning with the year 2015 until the latest year available, i.e. `2015.json`, `2016.json`, `2017.json`, etc.

Each file has this interface:

```typescript
interface BMData {
    camps: BMCamp[];
    art: BMArt[];
    events: BMEvent[];
}
```

For more information about the data models and types for the Burning Man data, see the file `BM.d.ts`. For example, the data interface for `BMCamp` looks more-or-less like this:

```typescript
interface BMCamp {
    UID: string;
    name?: string | null;
    description: string | null;
    print_description?: string;
    year: number;
    url: string | null;
    contact_email: string | null;
    hometown?: string | null;
    location: BMCampLocation;
    location_string: string;
}
```

### testing

After downloading the data, you may want to run the data integrity tests. This will highlight issues with the data such as events that have no location, or have ending times earlier than their start time. Yes, this will test all data throughout time. You can change that in `data.test.ts`

First, compile the tests by typing `npx tsc -p tsconfig.tests.json` into the console from project root. To run the data integrity tests, type `npx jest data`. Be forewarned: it may take 5 minutes or longer for the tests to complete. The tests themselves do not take so long (~ 90s) , but currently, jest feels the need to list every single successful test with no way to output only failing tests. As there are over 100 thousand separate tests (`101743` to be exact), most of them successful, it can take awhile for all of them to output.

Props to the Burning Man IT department though: only `337` tests fail out of those `101743` total.

You will see output similar to this:

```text
2019.json integrity › events › Correlation and Cocktails ( UID: ctUnjpGdBE4EAdtgTmS3 ) › start Fri, Aug 30, 04:30 PM should be earlier than end Sun, Aug 25, 07:30 PM

    expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 1566786600000
    Received:    1567207800000
```

This is telling us that in the `2019.json` data file, the event _Correlation and Cocktails_ with uid `ctUnjpGdBE4EAdtgTmS3` has a starting time of August 30th at 4:30 PM but it ends a week earlier on August 25th at 7:30 PM! Probably what's going on here is that they meant to say it should end on Sunday, the _last_ day of Burning Man, but they clicked on the wrong date when entering their info. But it's anyone's guess! If time machines are a thing, they will be at Burning Man.

Another example:

```text
2019.json integrity › every event.located_at_art has a corresponding art › Frequency symphony - Official Opening:ghcj5jP5u79Qy8dGqxqS has a corresponding art

    expect(received).toBeDefined()

    Received: undefined
```

This is telling us that the event _Frequency symphony - Official Opening_ with uid `ghcj5jP5u79Qy8dGqxqS` is supposed to be located at an artwork, but the artwork is unknown.

Finding the event `ghcj5jP5u79Qy8dGqxqS` in `2019.json`, it looks like this:

```json
{
  "uid": "ghcj5jP5u79Qy8dGqxqS",
  "title": "Frequency symphony - Official Opening",
  "event_id": 33607,
  "description": "Party with us, deep playa for the official revealing of: Videosynthesis, a large light sculpture by British Artist Elvis Ellis.\r\nMusic, love and light",
  "event_type": {
    "id": 2,
    "label": "Gathering/Party",
    "abbr": "prty"
  },
  "year": 2019,
  "print_description": "Party with us, deep playa for the official revealing of: Videosynthesis, a large light sculpture by British Artist Elvis Ellis. Music, love and light",
  "slug": "ghcj5jP5u79Qy8dGqxqS-frequency-symphony-official-opening",
  "hosted_by_camp": null,
  "located_at_art": "a2I0V000001TA5IUAW",
  "other_location": "",
  "check_location": 1,
  "url": "http://elvisellis.com",
  "all_day": null,
  "contact": "info@elvisellis.com",
  "occurrence_set": [
    {
      "start_time": "2019-08-28T21:00:00-07:00",
      "end_time": "2019-08-29T00:00:00-07:00"
    }
  ]
}
```

It appears that the value `"a2I0V000001TA5IUAW"` for the key `"located_at_art"` does not have a corresponding artwork with that UID. Neither is there another mention of _Videosynthesis_, _Elvis Ellis_, nor _Frequency Symphony_. We have to make a decision about whether to include such information in BMApp. At this point, all anyone can tell is that maybe there is an event at a specific time somewhere in the vastness of the Playa. Which, you know. That's not so bad. It might become a quest for someone. We should highlight the mystery in the UI somehow, I think.
