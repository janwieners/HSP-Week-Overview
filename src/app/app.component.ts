import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Constants} from './constants';
import {Helpers} from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

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

  public courseTypes = [
    {
      title: 'Ballsport und Spiele',
      taxonomyId: 36,
      bgr: Constants.BACKGROUNDS[36]
    },
    {
      title: 'Budo- / Kampfsport',
      taxonomyId: 1,
      bgr: Constants.BACKGROUNDS[1]
    },
    {
      title: 'Fitness',
      taxonomyId: 3,
      bgr: Constants.BACKGROUNDS[3]
    },
    {
      title: 'Gesundheitssport',
      taxonomyId: 4,
      bgr: Constants.BACKGROUNDS[4]
    },
    {
      title: 'Individualsport',
      taxonomyId: 32,
      bgr: Constants.BACKGROUNDS[32]
    },
    {
      title: 'Natursport',
      taxonomyId: 33,
      bgr: Constants.BACKGROUNDS[33]
    },
    {
      title: 'Tanzen',
      taxonomyId: 6,
      bgr: Constants.BACKGROUNDS[6]
    },
    {
      title: 'Wassersport',
      taxonomyId: 34,
      bgr: Constants.BACKGROUNDS[34]
    },
    {
      title: 'Wintersport',
      taxonomyId: 35,
      bgr: Constants.BACKGROUNDS[35]
    },
    {
      title: 'Campus Gummersbach',
      taxonomyId: 7,
      bgr: Constants.BACKGROUNDS[7]
    }
  ];

  private resetCourses() {
    for (let day in this.courses) {
      this.courses[day].data.length = 0;
    }
  };

  private showCourse(courseId) {
  };

  private getCourses(taxonomyId) {

    this.resetCourses();


    let url;

    if (Constants.DEVELOPMENT) {
      url = Constants.API.dev.replace('TAXOID', taxonomyId);
    } else {
      url = Constants.API.prod.replace('TAXOID', taxonomyId);
    }

    this.http.get(url).subscribe((result: any) => {

        let cncl, closingDates, placeName, courseTitle;

        for (let entry of result) {

          cncl = entry.field_kursausfaelle.split('|');

          if (cncl[0] === '') {
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
          if (closingDates[0] === '') {
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
            'notes': Helpers.escapeHtml(entry.field_bemerkungen.replace('<br />', ',')),
            'closingDates': closingDates,
            'onlineRegistration': entry.field_onlineanmeldung,
            'semester': entry.field_periode,
            'placeId': entry.placeid,
            'level': entry.field_schwierigkeitslevel
          });
        }
      }
    );
  };

  ngOnInit(): void {
    this.getCourses(36);
  }
}
