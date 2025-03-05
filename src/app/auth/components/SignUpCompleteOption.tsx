import Image from 'next/image'
import Link from 'next/link'
interface ISignUpCompleteOptionProps {
  icon: string
  width: number
  height: number
  title: string
  description: string
  link: string
}

export default function SignUpCompleteOption({
  icon,
  width,
  height,
  title,
  description,
  link,
}: ISignUpCompleteOptionProps) {
  return (
    <Link href={link}>
      <div className="w-full h-[86px] relative rounded-[12px] border border-grayscale-600 bg-grayscale-700 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-accentT-30">
        <Image src={icon} width={width} height={height} alt={title} className="absolute left-0" />
        <h3 className="semi-16 text-grayscale-50 mb-[2px] z-[2]">{title}</h3>
        <p className="reg-12 text-grayscale-400 text-center z-[2]">{description}</p>
      </div>
    </Link>
  )
}
