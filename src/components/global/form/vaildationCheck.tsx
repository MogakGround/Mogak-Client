import CheckDefaultIcon from '@/assets/svg/check-default.svg'
import CheckAccentIcon from '@/assets/svg/check-accent.svg'

interface IValidationCheckProps {
  isValid: boolean
  text: string
}

export default function ValidationCheck({ isValid, text }: IValidationCheckProps) {
  const CheckIcon = isValid ? CheckAccentIcon : CheckDefaultIcon
  return (
    <div className="flex items-center">
      <CheckIcon width={20} height={20} />
      <span className={`${isValid ? 'text-accent-100' : 'text-grayscale-400'} reg-12`}>{text}</span>
    </div>
  )
}
