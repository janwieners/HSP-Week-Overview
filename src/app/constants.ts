export class Constants {

  public static DEVELOPMENT = false;

  public static API = {
    // prod: '/json/datesbytid/TAXOID?_format=json', // Vorlesungszeit
    prod: '/json/datesbytidvorlesungsfrei/TAXOID?_format=json', // vorlesungsfreie Zeit
    dev: 'https://myhsp.hochschulsport-koeln.de/json/datesbytid/TAXOID?_format=json'
  };

  public static WEEKDAYS = {
    0: 14, // Sunday is related to taxonomy item 14 (admin/structure/taxonomy/manage/wochentage/overview)
    1: 8, // Monday is related to taxonomy item 8
    2: 9,
    3: 10,
    4: 11,
    5: 12,
    6: 13
  };

  public static WEEKDAYSREVERT = {
    14: 0,
    8: 1,
    9: 2,
    10: 3,
    11: 4,
    12: 5,
    13: 6
  };

  public static BACKGROUNDS = {
    36: 'bgr-yellow',   // Ballsport und Spiele
    1: 'bgr-orange',    // Kampfsport
    3: 'bgr-red',       // Fitness
    4: 'bgr-pink',      // Gesundheitssport
    32: 'bgr-purple',   // Individualsport
    33: 'bgr-darkblue', // Natursport
    6: 'bgr-lightblue', // Tanzen
    34: 'bgr-cyan',     // Wassersport
    35: 'bgr-green',    // Wintersport
    7: 'bgr-lightgreen' // Campus Gummersbach
  };
}
