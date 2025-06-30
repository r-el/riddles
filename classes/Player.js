import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
dayjs.extend(duration);

/**
 * Represents a player who solves riddles and tracks the time taken for each attempt.
 *
 * @class Player
 * @classdesc Stores the player's name and an array of time durations (in milliseconds) for each riddle solved.
 *
 * @param {string} name - Name of the player.
 * @param {number[]} [times=[]] - An optional array of time durations (in milliseconds) for each riddle solved.
 *
 * @property {string} name - Player's name.
 * @property {number[]} times - Array of time durations (in milliseconds) for each riddle solved.
 *
 * @example
 * const player = new Player('Ariel');
 * player.recordTime(new Date(start), new Date(end));
 * player.showStats();
 */
export default class Player {
  /**
   * Creates a new Player instance.
   * @param {string} name - The name of the player.
   * @param {number[]} [times=[]] - An optional array of time durations (in milliseconds) for each riddle solved.
   */
  constructor(name, times = []) {
    this.name = name;
    this.times = Array.isArray(times) ? times.filter(Number.isFinite) : []; // MS durations per riddle
  }

  /**
   * Records the time taken to solve a riddle.
   * @param {Date} start - The start time of the riddle attempt.
   * @param {Date} end - The end time of the riddle attempt.
   * @returns {void}
   */
  recordTime(start, end) {
    if (!(start instanceof Date) || !(end instanceof Date)) return;

    const duration = end.getTime() - start;
    if (Number.isFinite(duration) && duration >= 0) {
      this.times.push(duration);
    }
  }

  /**
   * Displays the total and average time taken to solve riddles for the player.
   * Times are formatted as H:mm:ss (total) and m:ss (average).
   * Outputs the results to the console.
   * @returns {void}
   */
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
