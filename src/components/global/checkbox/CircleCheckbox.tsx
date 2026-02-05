import { ICheckboxProps } from './checkbox.types'
import { checkboxSize, getCheckboxSrc, checkboxBgColor } from './checkboxStyle'

export default function CircleCheckbox({
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
      <label
        htmlFor={id}
        className={`${checkboxSize[size]} ${isChecked ? checkboxBgColor[color] : checkboxBgColor['default']} cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}
      >
        <CheckboxIcon className="w-full h-full" />
      </label>
      <span className="ml-[6px] text-white">{text || ''}</span>
    </div>
  )
}
