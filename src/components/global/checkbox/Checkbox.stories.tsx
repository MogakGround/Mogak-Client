import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Checkbox from './Checkbox'
import { CheckboxColor } from './checkbox.types'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'select' },
      options: Object.values(CheckboxColor),
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 체크박스 상태를 관리하는 래퍼 컴포넌트
const CheckboxWrapper = ({ isChecked: initialIsChecked, ...props }: any) => {
  const [isChecked, setIsChecked] = useState(initialIsChecked)

  return <Checkbox isChecked={isChecked} handleChange={() => setIsChecked(!isChecked)} {...props} />
}

export const Default: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'default-checkbox',
    text: '기본 체크박스',
    size: 'small',
    color: CheckboxColor.primary,
    isChecked: false,
  },
}

export const Checked: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'checked-checkbox',
    text: '체크된 체크박스',
    size: 'small',
    color: CheckboxColor.primary,
    isChecked: true,
  },
}

export const WhiteColor: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'white-checkbox',
    text: '화이트 색상 체크박스',
    size: 'small',
    color: CheckboxColor.white,
    isChecked: false,
  },
}

export const AccentColor: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'accent-checkbox',
    text: '액센트 색상 체크박스',
    size: 'small',
    color: CheckboxColor.accent,
    isChecked: false,
  },
}

export const MediumSize: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'medium-checkbox',
    text: '중간 크기 체크박스',
    size: 'medium',
    color: CheckboxColor.primary,
    isChecked: false,
  },
}

export const LargeSize: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'large-checkbox',
    text: '큰 크기 체크박스',
    size: 'large',
    color: CheckboxColor.primary,
    isChecked: false,
  },
}

export const Disabled: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'disabled-checkbox',
    text: '비활성화된 체크박스',
    size: 'small',
    color: CheckboxColor.primary,
    isChecked: false,
    isDisabled: true,
  },
}

export const DisabledChecked: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'disabled-checked-checkbox',
    text: '비활성화된 체크된 체크박스',
    size: 'small',
    color: CheckboxColor.primary,
    isChecked: true,
    isDisabled: true,
  },
}

export const WithoutText: Story = {
  render: (args) => <CheckboxWrapper {...args} />,
  args: {
    id: 'no-text-checkbox',
    size: 'small',
    color: CheckboxColor.primary,
    isChecked: false,
  },
}
