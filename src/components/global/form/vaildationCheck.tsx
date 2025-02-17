import Image from 'next/image'

import checkDefaultIcon from '@/assets/svg/check-default.svg'
import checkAccentIcon from '@/assets/svg/check-accent.svg'

interface IValidationCheckProps {
  isValid: boolean
  text: string
}

export default function ValidationCheck({ isValid, text }: IValidationCheckProps) {
  return (
    <div className="flex items-center">
      <Image src={isValid ? checkAccentIcon : checkDefaultIcon} width={20} height={20} alt="check" />
      <span className={`${isValid ? 'text-accent-100' : 'text-grayscale-400'} reg-12`}>{text}</span>
    </div>
  )
}
