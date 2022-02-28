import { DateTime } from 'luxon';

export class DateParser {
  constructor() {}
  static getStartOfDay(date: string) {
    return DateTime.fromJSDate(new Date(date), { zone: 'Asia/Seoul' })
      .startOf('day')
      .toJSDate();
  }
  static getStartOfNextDay(from: Date, add: number) {
    return DateTime.fromJSDate(new Date(from), { zone: 'Asia/Seoul' })
      .plus({ days: add })
      .startOf('day')
      .toJSDate();
  }
}
