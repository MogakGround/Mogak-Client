export default function convertTime(totalSeconds: number) {
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(1, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(1, '0'),
    seconds: String(totalSeconds % 60).padStart(1, '0'),
  }
}
