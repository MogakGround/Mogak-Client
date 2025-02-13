import IllustBlockIcon from '@/assets/svg/illust_block.svg'
import IllustSearchIcon from '@/assets/svg/illust_search.svg'
import Image from 'next/image'

const SignUpOption = ({
  icon,
  width,
  height,
  title,
  description,
}: {
  width: number
  height: number
  icon: string
  title: string
  description: string
}) => (
  <div className="w-full h-[86px] relative rounded-[12px] border border-grayscale-600 bg-grayscale-700 overflow-hidden flex flex-col items-center justify-center px-4 py-2 hover:border-accentT-30">
    <Image src={icon} width={width} height={height} alt={title} className="absolute left-0" />
    <h3 className="semi-16 text-grayscale-50 mb-[2px] z-[2]">{title}</h3>
    <p className="reg-12 text-grayscale-400 text-center z-[2]">{description}</p>
  </div>
)

export default function SignUpComplete() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[2px] text-grayscale-50 mb-[40px]">
        <h2 className="semi-20">가입을 환영해요!</h2>
        <p className="text-grayscale-400 reg-14">모각그라운드에서 자유로운 모각작을 시작해볼까요?</p>
      </div>
      <div className="w-full flex flex-col gap-[12px] mb-[60px]">
        <SignUpOption
          icon={IllustBlockIcon}
          width={98}
          height={120}
          title="모각방을 직접 만들래요"
          description="직접 모각방장이 되어 빠르게 모각작을 시작할 수 있어요"
        />
        <SignUpOption
          icon={IllustSearchIcon}
          width={120}
          height={118}
          title="일단 둘러볼게요!"
          description="바로 홈으로 이동하여 둘러볼 수 있어요"
        />
      </div>
      <div className="flex flex-col bg-grayscale-800 rounded-lg">
        <h4 className="semi-14 text-grayscale-50 mb-[4px]">모각방이란?</h4>
        <p className="reg-12 text-grayscale-200">모각작을 위한 방이라는 뜻이에요.</p>
        <p className="reg-12 text-grayscale-200">
          모각그라운드에서 모각방을 만들거나 들어가 자유롭게 모각작을 할 수 있어요.
        </p>
      </div>
    </div>
  )
}
