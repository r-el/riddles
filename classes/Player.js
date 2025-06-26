export default class Player {
  constructor(name, times = []) {
    this.name = name;
    this.times = Array.isArray(times) ? times.filter(Number.isFinite) : []; // durations per riddle
  }
}
