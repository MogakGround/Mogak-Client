import type { Meta, StoryObj } from '@storybook/react'
import BasicButton from './BasicButton'
import { ButtonVariant, ButtonTheme, ButtonSize } from './button.types'

const meta: Meta<typeof BasicButton> = {
  title: 'Components/Button/BasicButton',
  component: BasicButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
    },
    theme: {
      control: { type: 'select' },
      options: Object.values(ButtonTheme),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(ButtonSize),
    },
    disabled: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.md,
    text: '기본 버튼',
    handleClick: () => console.log('버튼 클릭!'),
  },
}

export const TextButton: Story = {
  args: {
    variant: ButtonVariant.default,
    theme: ButtonTheme.text,
    size: ButtonSize.md,
    text: '텍스트 버튼',
    handleClick: () => console.log('텍스트 버튼 클릭!'),
  },
}

export const AccentButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.accent,
    size: ButtonSize.md,
    text: '액센트 버튼',
    handleClick: () => console.log('액센트 버튼 클릭!'),
  },
}

export const WhiteButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.white,
    size: ButtonSize.md,
    text: '화이트 버튼',
    handleClick: () => console.log('화이트 버튼 클릭!'),
  },
}

export const SmallButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.sm,
    text: '작은 버튼',
    handleClick: () => console.log('작은 버튼 클릭!'),
  },
}

export const LargeButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.lg,
    text: '큰 버튼',
    handleClick: () => console.log('큰 버튼 클릭!'),
  },
}

export const DisabledButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.md,
    text: '비활성화 버튼',
    disabled: true,
    handleClick: () => console.log('이 버튼은 비활성화되어 있습니다'),
  },
}

export const FullWidthButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.md,
    text: '전체 너비 버튼',
    fullWidth: true,
    handleClick: () => console.log('전체 너비 버튼 클릭!'),
  },
}
