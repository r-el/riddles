import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
dayjs.extend(duration);

export default class Player {
  constructor(name, times = []) {
    this.name = name;
    this.times = Array.isArray(times) ? times.filter(Number.isFinite) : []; // MS durations per riddle
  }

  recordTime(start, end) {
    if (!(start instanceof Date) || !(end instanceof Date)) return;

    const duration = end.getTime() - start;
    if (Number.isFinite(duration) && duration >= 0) {
      this.times.push(duration);
    }
  }

  // display total and average time
  showStats() {
    const count = this.times.length;
    const totalMs = this.times.reduce((total, time) => total + time, 0);
    const avgMs = count > 0 ? totalMs / count : 0;

    const totalFormatted = dayjs.duration(totalMs).format("H:mm:ss");
    const avgFormatted = dayjs.duration(avgMs).format("m:ss");

    console.log(`Total time: ${totalFormatted}`);
    console.log(`Average time per riddle: ${avgFormatted}`);
  }

  static fromObject = (obj) => new Player(obj.name, obj.times);
}
