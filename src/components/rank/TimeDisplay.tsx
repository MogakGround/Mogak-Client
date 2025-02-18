export enum TimeDisplayType {
  small = 'small',
  large = 'large',
}
interface ITimeDisplayProps {
  hours: number
  minutes: number
  seconds: number
  type: TimeDisplayType
}

function TimeUnit({ value, unit, isLarge }: { value: number; unit: string; isLarge: boolean }) {
  return (
    <span>
      <span className={`text-white mr-[2px] ${isLarge ? 'semi-24' : 'semi-18'}`}>{value}</span>
      <span className={`text-grayscale-200 ${isLarge ? 'reg-18' : 'reg-16'}`}>{unit}</span>
    </span>
  )
}
function TimeDisplay({ hours, minutes, seconds, type }: ITimeDisplayProps) {
  return (
    <div className="flex items-center gap-[14px]">
      <TimeUnit value={hours} unit="시간" isLarge={type === TimeDisplayType.large} />
      <TimeUnit value={minutes} unit="분" isLarge={type === TimeDisplayType.large} />
      <TimeUnit value={seconds} unit="초" isLarge={type === TimeDisplayType.large} />
    </div>
  )
}

export default TimeDisplay
