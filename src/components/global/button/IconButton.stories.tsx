import type { Meta, StoryObj } from '@storybook/react'
import IconButton from './IconButton'
import { ButtonVariant, ButtonTheme, ButtonSize } from './button.types'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/IconButton',
  component: IconButton,
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
    iconSrc: {
      control: { type: 'text' },
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
    handleClick: () => console.log('아이콘 버튼 클릭!'),
  },
}

export const SmallIconButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.sm,
    handleClick: () => console.log('작은 아이콘 버튼 클릭!'),
  },
}

export const LargeIconButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.lg,
    handleClick: () => console.log('큰 아이콘 버튼 클릭!'),
  },
}

export const AccentIconButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.accent,
    size: ButtonSize.md,
    handleClick: () => console.log('액센트 아이콘 버튼 클릭!'),
  },
}

export const DisabledIconButton: Story = {
  args: {
    variant: ButtonVariant.filled,
    theme: ButtonTheme.primary,
    size: ButtonSize.md,
    disabled: true,
    handleClick: () => console.log('이 버튼은 비활성화되어 있습니다'),
  },
}
