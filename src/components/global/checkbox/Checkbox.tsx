import { ICheckboxProps } from './checkbox.types'
import { checkboxSize, getCheckboxSrc } from './checkboxStyle'

export default function Checkbox({
  id,
  text,
  size = 'small',
  color,
  isChecked,
  isDisabled,
  handleChange,
}: ICheckboxProps) {
  const CheckboxIcon = getCheckboxSrc(isChecked ? color : 'default', isChecked)

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
        <CheckboxIcon className="w-full h-full" />
      </label>
      <span className="ml-[3px] text-white">{text || ''}</span>
    </div>
  )
}
