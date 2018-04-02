import {Constants} from "./constants";

export class Helpers {

  public static escapeHtml(str) {
    return str.replace(/&amp;/g, '&').replace(/&#039;/g, '\'').replace(/&#x2F;/g, '/');
  }

  public static placeClosed(dates, weekdayId) {

    if (!dates || !weekdayId) {
      return false;
    }

    let closingDates = dates.split(','),
      cur, startDate, endDate,
      today:string, now = new Date(), i = 0,
      dd:number = now.getDate(),
      day: string,
      mm:number = now.getMonth() + 1,
      month: string,
      year = now.getFullYear(),
      dateDay;

    if (dd < 10) {
      day = '0' + dd;
    }
    if (mm < 10) {
      month = '0' + mm;
    }

    today = day + '.' + month + '.' + year;

    for (; i < closingDates.length; i++) {

      cur = closingDates[i].replace(/ /g, '').split('-');

      // Check one day
      if (cur.length === 1) {

        if (cur[0] === today) {
          return true;
        }
      } else if (cur.length === 2 && weekdayId) {

        // Check time span
        startDate = cur[0].split('.');
        endDate = cur[1].split('.');

        // new Date(year, month [starts with 0], day)
        startDate = Math.round(new Date(startDate[2], startDate[1] - 1, startDate[0]).getTime() / 1000);
        endDate = Math.round(new Date(endDate[2], endDate[1] - 1, endDate[0]).getTime() / 1000);

        now = new Date();

        dateDay = Math.round(new Date(now.getFullYear(), now.getMonth(),
          now.getDate() - now.getDay() + Constants.WEEKDAYSREVERT[weekdayId]).getTime() / 1000);

        if (dateDay >= startDate && dateDay <= endDate) {
          return true;
        }
      }
    }

    return false;

    // ToDo: Check current semester
  }
}
