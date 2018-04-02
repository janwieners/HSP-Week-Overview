import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {Constants} from "./constants";
import {Helpers} from "./helpers";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private dateIds = [
    8, 9, 10, 11, 12, 13, 14
  ];

  private courses = {
    8: {
      title: 'Montag',
      data: []
    },
    9: {
      title: 'Dienstag',
      data: []
    },
    10: {
      title: 'Mittwoch',
      data: []
    },
    11: {
      title: 'Donnerstag',
      data: []
    },
    12: {
      title: 'Freitag',
      data: []
    },
    13: {
      title: 'Samstag',
      data: []
    },
    14: {
      title: 'Sonntag',
      data: []
    }
  };

  constructor(private http: HttpClient) {
  }

  resetCourses() {
    for (let day in this.courses) {
      this.courses[day].data = [];
    }
  };

  ngOnInit(): void {

    let taxonomyId = 36;
    let url = 'https://myhsp.hochschulsport-koeln.de/json/coursedatesbytid/' + taxonomyId + '?_format=json';

    this.http.get(url).subscribe((result: any) => {

        this.resetCourses();

        let cur, cncl, closingDates, placeName, courseTitle;

        for (let entry of result) {

          cur = entry;

          cncl = cur.field_kursausfaelle.split('|');
          if (cncl[0] === "") {
            cncl.length = 0;
            cur.bgrClass = Constants.BACKGROUNDS[taxonomyId];
          } else {
            cur.bgrClass = 'cancelled';
          }

          // Check if place is currently closed
          if (Helpers.placeClosed(cur.field_schliesszeiten, cur.field_wochentagId)) {
            cur.bgrClass = 'cancelled';
          }

          if (!cur.field_wochentagId) {
            continue;
          }

          closingDates = cur.field_schliesszeiten.split(',');
          if (closingDates[0] === "") {
            closingDates.length = 0;
          }

          if (cur.field_kurzname) {
            placeName = cur.field_kurzname;
          } else {
            placeName = cur.field_ort;
          }

          if (cur.field_kurztitel_event) {
            courseTitle = cur.field_kurztitel_kurs;
          } else {
            courseTitle = cur.field_kursverknuepfung;
          }

          courseTitle = Helpers.escapeHtml(courseTitle);

          this.courses[cur.field_wochentagId].data.push({
            'title': courseTitle,
            'starttime': cur.field_uhrzeit_beginn,
            'endtime': cur.field_uhrzeit_ende,
            'place': placeName,
            'nId': cur.nid,
            'cancelDates': cncl,
            'bgrClass': cur.bgrClass,
            'dateId': cur.nid_1,
            'weekday': cur.field_wochentag,
            'weekdayId': cur.field_wochentagId,
            'notes': cur.field_bemerkungen,
            'closingDates': closingDates,
            'onlineRegistration': cur.field_onlineanmeldung,
            'semester': cur.field_periode,
            'placeId': cur.placeid
          });
        }
        console.log(this.courses)
      }
    );
  }
}
