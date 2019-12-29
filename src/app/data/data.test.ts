import { BMData, BMEvent, BMCamp, BMArt } from '../../BM';
import { readFileSync } from 'fs';

const isEmpty = (a: any) => a === undefined || a === null || a === "" || (a.hasOwnProperty("length") && a.length === 0);
const getYearsSince = (currYear: number = new Date().getFullYear(), years: number[] = []): number[] => currYear < 2015 ? years : getYearsSince(currYear - 1, [currYear, ...years])
const years = getYearsSince()

for (const year of years) {
  describe(`${year}.json integrity`, () => {

    const data: BMData = JSON.parse(readFileSync(`./data/${year}.json`, { encoding: 'UTF-8' }))

    it(`${year} data loaded`, () => {
      expect(data).toBeDefined();
    })

    describe('every event.located_at_art has a corresponding art', () => {
      const getArt = (uid: string) => data.art.find((a) => a.uid === uid);
      const eventsWithArt = data.events.filter((e) => !isEmpty(e.located_at_art));

      eventsWithArt.forEach((e) => {
        it(`Event "${e.title}" (UID: ${e.uid}) location art (UID# ${e.located_at_art}) exists`, () => {
          const locatedAtArt = getArt(e.located_at_art!);
          expect(locatedAtArt).toBeDefined();
        });
      });
    });

    describe('all arts and camps have a location field (even if the value is undefined) ', () => {
      const campsAndArts: (BMCamp | BMArt)[] = [...data.art, ...data.camps]
      campsAndArts.forEach((d) => {
        it(`"${d.name}" ( UID: ${d.uid} ) has a location field`, () => {
          expect(d.hasOwnProperty("location")).toBe(true);
        });
      });
    });

    describe('every event.hosted_by_camp has a corresponding camp', () => {
      const getCamp = (uid: string) => data.camps.find((c) => c.uid === uid);
      const eventsWithCamp = data.events.filter((e) => !isEmpty(e.hosted_by_camp));

      eventsWithCamp.forEach((e) => {
        it(`"${e.title}" (UID: ${e.uid}) location camp (UID: ${e.hosted_by_camp}) exists`, () => {
          const camp = getCamp(e.hosted_by_camp!);
          expect(camp).toBeDefined();
        });
      });
    });

    describe('all info items have names or titles', () => {
      const infoWithNamesAndTitles = [...data.camps, ...data.art, ...data.events].filter((i) => isEmpty(i.name) && isEmpty(i.title));

      if (!isEmpty(infoWithNamesAndTitles)) infoWithNamesAndTitles.forEach((i) => {
        it(`${i.uid} should have a name or title`, () => {
          expect(i.name || i.title).toBeDefined();
        })
      });
    });

    describe('all events have either a located_at_art or hosted_by_camp field', () => {
      const noOcc = data.events.filter(e => e.occurrence_set === undefined);
      if (!isEmpty(noOcc)) noOcc.forEach((e) => {
        it(`"${e.title}" (UID: ${e.uid}) should have located_at_art or hosted_by_camp`, () => {
          const eLocation = e.located_at_art || e.hosted_by_camp;
          expect(eLocation).toBeDefined();
        })
      })
    });

    describe('all events have occurrence_set', () => {
      const noOcc = data.events.filter(e => e.occurrence_set === undefined);
      if (!isEmpty(noOcc)) noOcc.forEach((e) => {
        it(`"${e.title}" (UID: ${e.uid}) should have an occurrence set`, () => {
          expect(e.occurrence_set).toBeDefined();
          expect(e.occurrence_set!.length).toBeGreaterThan(0);
        })
      })
    });

    describe('events', () => {
      data.events.forEach((e: BMEvent) => {
        describe(`"${e.title}" (UID: ${e.uid})`, () => {
          const formatOptions = { weekday: "short", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Los_Angeles" };
          if (!isEmpty(e.occurrence_set)) e.occurrence_set!.forEach(o => {
            const start = new Date(o.start_time)
            const startString = start.toLocaleString("en", formatOptions);
            const end = new Date(o.end_time)
            const endString = end.toLocaleString("en", formatOptions);
            it(`start ${startString} should be earlier than end ${endString}`, () => {
              expect(start.valueOf()).toBeLessThanOrEqual(end.valueOf());
            });
            it(`start ${startString} should not be the same as end ${endString}`, () => {
              expect(start.valueOf()).not.toEqual(end.valueOf());
            });
          });
        });
      });
    });

    it('Center Camp Cafe exists', () => {
      const cCamp = data.camps.filter((c) => c.hasOwnProperty("name") && typeof c.name === "string").find((c) => c.name!.toLowerCase() === 'center camp cafe');
      expect(cCamp).toBeDefined();
    });

    it('Playa Info exists', () => {
      const pInfo = data.camps.filter((c) => c.hasOwnProperty("name") && typeof c.name === "string").find((c) => c.name!.toLowerCase() === 'playa info');
      expect(pInfo).toBeDefined();
    });

    // describe('data is normalized', () => {
    //   describe('Info names, titles, descriptions, etc contain no double spaces', () => {
    //     const dblSpcs = allText.filter((o) => o.text.indexOf('  ') >= 0);
    //     dblSpcs.forEach((o) => {
    //       it(`${o.uid} should have no double spaces`, () => {
    //         const idx = o.text.indexOf('  ');
    //         expect(idx).toBe(-1);
    //       })
    //     })
    //   });
    // });
  });
}