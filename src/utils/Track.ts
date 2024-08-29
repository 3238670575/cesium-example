import Compose from "./Compose";

export default class Track {
  public target;
  public parent!: Compose;
  public start: Date;
  public timeLen: number;
  public loop: boolean;
  onEnd: () => void;
  prevTime: number;
  keyMap: Map<string, number[][]>;
  constructor(target: { x: number; y: number; pointSize: number; alpha: number }) {
    this.target = target;
    // this.parent = null;
    this.start = new Date();
    this.timeLen = 5;
    this.loop = false;
    this.keyMap = new Map();
    this.onEnd = () => {};
    this.prevTime = 0;
  }
  update(t: Date) {
    const { keyMap, timeLen, target, loop, start, prevTime } = this;
    let time = t.getTime() - start.getTime();
    if (timeLen >= prevTime && timeLen < time) {
      this.onEnd();
    }
    this.prevTime = time;
    if (loop) {
      time = time % timeLen;
    }
    for (const [key, fms] of keyMap) {        
      const last = fms.length - 1;
      if (time < fms[0][0]) {
        target[key]  = fms[0][1];
      } else if (time > fms[last][0]) {
        target[key] = fms[last][1];
      } else {
        target[key] = getValBetweenFms(time, fms, last);
      }
    }
  }
}

function getValBetweenFms(time: number, fms: any[], last: number) {
  for (let i = 0; i < last; i++) {
    const fm1 = fms[i];
    const fm2 = fms[i + 1];
    if (time >= fm1[0] && time <= fm2[0]) {
      const delta = {
        x: fm2[0] - fm1[0],
        y: fm2[1] - fm1[1],
      };
      const k = delta.y / delta.x;
      const b = fm1[1] - fm1[0] * k;
      return k * time + b;
    }
  }
}
//优雅解决字符串当对象的key报错
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}