import type { Meta, StoryObj } from '@storybook/react'
import BasicInput from './BasicInput'

const meta: Meta<typeof BasicInput> = {
  title: 'Components/Input/BasicInput',
  component: BasicInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    readonly: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'default-input',
    value: '',
    placeHolder: '기본 입력창',
    size: 'medium',
    handleChange: (e) => console.log('입력값:', e.target.value),
  },
}

export const WithValue: Story = {
  args: {
    name: 'with-value-input',
    value: '미리 입력된 텍스트',
    placeHolder: '텍스트를 입력하세요',
    size: 'medium',
    handleChange: (e) => console.log('입력값:', e.target.value),
  },
}

export const SmallInput: Story = {
  args: {
    name: 'small-input',
    value: '',
    placeHolder: '작은 입력창',
    size: 'small',
    handleChange: (e) => console.log('입력값:', e.target.value),
  },
}

export const PasswordInput: Story = {
  args: {
    name: 'password-input',
    value: '',
    placeHolder: '비밀번호를 입력하세요',
    size: 'medium',
    type: 'password',
    handleChange: (e) => console.log('비밀번호 입력:', e.target.value),
  },
}

export const DisabledInput: Story = {
  args: {
    name: 'disabled-input',
    value: '비활성화된 입력창',
    placeHolder: '비활성화된 입력창',
    size: 'medium',
    disabled: true,
    handleChange: (e) => console.log('이 입력창은 비활성화되어 있습니다'),
  },
}

export const ReadonlyInput: Story = {
  args: {
    name: 'readonly-input',
    value: '읽기 전용 텍스트',
    placeHolder: '읽기 전용 입력창',
    size: 'medium',
    readonly: true,
    handleChange: (e) => console.log('읽기 전용 입력창입니다'),
  },
}
