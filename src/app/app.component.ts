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

  private resetCourses() {
    for (let day in this.courses) {
      this.courses[day].data.length = 0;
    }
  };

  private getCourses(taxonomyId) {

    let url = 'https://myhsp.hochschulsport-koeln.de/json/coursedatesbytid/' + taxonomyId + '?_format=json';

    this.http.get(url).subscribe((result: any) => {

        this.resetCourses();

        let cncl, closingDates, placeName, courseTitle;

        for (let entry of result) {

          cncl = entry.field_kursausfaelle.split('|');

          if (cncl[0] === "") {
            cncl.length = 0;
            entry.bgrClass = Constants.BACKGROUNDS[taxonomyId];
          } else {
            entry.bgrClass = 'cancelled';
          }

          // Check if place is currently closed
          if (Helpers.placeClosed(entry.field_schliesszeiten, entry.field_wochentagId)) {
            entry.bgrClass = 'cancelled';
          }

          if (!entry.field_wochentagId) {
            continue;
          }

          closingDates = entry.field_schliesszeiten.split(',');
          if (closingDates[0] === "") {
            closingDates.length = 0;
          }

          if (entry.field_kurzname) {
            placeName = entry.field_kurzname;
          } else {
            placeName = entry.field_ort;
          }

          if (entry.field_kurztitel_event) {
            courseTitle = entry.field_kurztitel_kurs;
          } else {
            courseTitle = entry.field_kursverknuepfung;
          }

          courseTitle = Helpers.escapeHtml(courseTitle);

          if (!courseTitle) {
            console.log('Empty course title at node #' + entry.nid);
          }

          this.courses[entry.field_wochentagId].data.push({
            'title': courseTitle,
            'starttime': entry.field_uhrzeit_beginn,
            'endtime': entry.field_uhrzeit_ende,
            'place': placeName,
            'nId': entry.nid,
            'cancelDates': cncl,
            'bgrClass': entry.bgrClass,
            'notes': entry.field_bemerkungen,
            'closingDates': closingDates,
            'onlineRegistration': entry.field_onlineanmeldung,
            'semester': entry.field_periode,
            'placeId': entry.placeid
          });
        }
        console.log(this.courses)
      }
    );
  };

  ngOnInit(): void {
    this.getCourses(36);
  }
}
