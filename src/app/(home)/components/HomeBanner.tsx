import Image from 'next/image'

import UpArrowIcon from '@/assets/svg/arrow-up-right.svg'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import { useRouter } from 'next/navigation'

export default function HomeBanner() {
  const { push } = useRouter()
  return (
    <div className="relative bg-grayscale-800 rounded-[12px] w-full min-h-[224px] overflow-hidden pt-[34px] px-[40px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col text-white">
          <span className="med-20 mb-[2px]">IT 작업자들의 작업터,</span>
          <span className="font-riasans text-[44px]">모각그라운드</span>
        </div>
        <div className="flex gap-[9px]">
          <IconTextButton
            variant={ButtonVariant.filled}
            theme={ButtonTheme.primary}
            size={ButtonSize.md}
            handleClick={() => {
              push('/room/new')
            }}
            iconSrc={UpArrowIcon}
            text="모각방 만들기"
            iconArrow={IconArrow.right}
          />
          <IconTextButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            handleClick={() => {
              window.open('https://mogakjak.framer.website/?editSite', '_blank')
            }}
            iconSrc={UpArrowIcon}
            text="모각그라운드, 뭐하는 곳이에요?"
            iconArrow={IconArrow.right}
          />
        </div>
      </div>
      <Image src="/images/bg-banner.svg" alt="home-banner" className="absolute top-0 right-0" width={558} height={224} />
    </div>
  )
}
