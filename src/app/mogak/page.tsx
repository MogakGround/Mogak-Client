import ScreenBox from './components/ScreenBox'
import MyStatus from './components/MyStatus'
import MogakHeader from './components/MogakHeader'

export default function MogakPage() {
  return (
    <div className="min-w-[1280px] overflow-hidden">
      <MogakHeader />
      <div className="px-80 pt-16 flex gap-15 min-h-500 h-full">
        <MyStatus />
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <ScreenBox nickname="aeong" time={0} />
          <ScreenBox nickname="aeong" time={0} />
          <ScreenBox nickname="aeong" time={0} />
          <ScreenBox nickname="aeong" time={0} />
        </div>
      </div>
    </div>
  )
}
