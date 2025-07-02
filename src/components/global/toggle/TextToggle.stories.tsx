import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TextToggle from './TextToggle'
import { ToggleTheme } from './toggle.types'

const meta: Meta<typeof TextToggle> = {
  title: 'Components/Toggle/TextToggle',
  component: TextToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: Object.values(ToggleTheme),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 토글 상태를 관리하는 래퍼 컴포넌트
const ToggleWrapper = ({ isOn: initialIsOn, ...props }: any) => {
  const [isOn, setIsOn] = useState(initialIsOn)

  return <TextToggle isOn={isOn} onToggle={() => setIsOn(!isOn)} {...props} />
}

export const Default: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    theme: ToggleTheme.LIGHT,
    isOn: true,
    textl: '켜기',
    textr: '끄기',
  },
}

export const DarkTheme: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    theme: ToggleTheme.DARK,
    isOn: false,
    textl: 'On',
    textr: 'Off',
  },
}

export const CustomText: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    theme: ToggleTheme.LIGHT,
    isOn: true,
    textl: '활성화',
    textr: '비활성화',
  },
}

export const InitiallyOff: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    theme: ToggleTheme.LIGHT,
    isOn: false,
    textl: '예',
    textr: '아니오',
  },
}
