import { ICheckboxProps } from './checkbox.types'
import { checkboxSize, getCheckboxSrc } from './checkboxStyle'
import Image from 'next/image'

export default function Checkbox({
  id,
  text,
  size = 'small',
  color,
  isChecked,
  isDisabled,
  handleChange,
}: ICheckboxProps) {
  const checkboxColor = getCheckboxSrc(isChecked ? color : 'default', isChecked)

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="hidden peer"
        id={id}
        disabled={isDisabled}
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={id} className={`${checkboxSize[size]} cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}>
        <Image src={checkboxColor} alt={isChecked ? 'Checked' : 'Unchecked'} className="w-full h-full" />
      </label>
      <span className="ml-[3px] text-white">{text || ''}</span>
    </div>
  )
}
