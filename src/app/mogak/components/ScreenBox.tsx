'use client'

import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPerson from '@/assets/svg/person.svg'
import IconClock from '@/assets/svg/clock.svg'
import convertTime from '@/utils/convertTime'

interface ScreenBoxProps {
  nickname: string
  time: number
}
export default function ScreenBox({ nickname, time = 0 }: ScreenBoxProps) {
  const { hours, minutes, seconds } = convertTime(time)

  return (
    <div className="relative bg-grayscale-800 rounded-10 min-w-300">
      <div className="absolute top-16 left-16 flex gap-12">
        <IconTextButton
          variant={ButtonVariant.default}
          theme={ButtonTheme.white}
          size={ButtonSize.sm}
          text={nickname}
          handleClick={() => {}}
          iconArrow={IconArrow.left}
          iconSrc={IconPerson}
          className="h-36 pointer-events-none"
        />
        <IconTextButton
          variant={ButtonVariant.default}
          theme={ButtonTheme.white}
          size={ButtonSize.xs}
          handleClick={() => {}}
          iconArrow={IconArrow.left}
          iconSrc={IconClock}
          className="h-36 pointer-events-none"
        >
          <div className="med-14 flex items-center text-center h-36 whitespace-nowrap">
            <span className="w-17">{hours}</span>
            <span className="reg-14 w-24 text-grayscale-300 mr-12">시간</span>
            <span className="w-17">{minutes}</span> <span className="reg-14 w-13 text-grayscale-200 mr-12">분</span>
            <span className="w-17">{seconds}</span> <span className="reg-14 w-13 text-grayscale-200">초</span>
          </div>
        </IconTextButton>
      </div>
    </div>
  )
}
