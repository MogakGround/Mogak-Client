import type { Meta, StoryObj } from '@storybook/react'
import TextChip from './TextChip'
import { ChipVariant, ChipTheme, ChipSize, DetailTextArrow } from './chip.types'

const meta: Meta<typeof TextChip> = {
  title: 'Components/Chip/TextChip',
  component: TextChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ChipVariant),
    },
    theme: {
      control: { type: 'select' },
      options: Object.values(ChipTheme),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(ChipSize),
    },
    detailTextArrow: {
      control: { type: 'select' },
      options: Object.values(DetailTextArrow),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.md,
    text: '기본 칩',
    handleClick: () => console.log('기본 칩 클릭!'),
  },
}

export const WithDetailText: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.md,
    text: '상세 정보',
    detailText: '5개',
    detailTextArrow: DetailTextArrow.RIGHT,
    handleClick: () => console.log('상세 정보 칩 클릭!'),
  },
}

export const DetailTextLeft: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.md,
    text: '왼쪽 상세 정보',
    detailText: '3개',
    detailTextArrow: DetailTextArrow.LEFT,
    handleClick: () => console.log('왼쪽 상세 정보 칩 클릭!'),
  },
}

export const SmallChip: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.sm,
    text: '작은 칩',
    handleClick: () => console.log('작은 칩 클릭!'),
  },
}

export const LargeChip: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.lg,
    text: '큰 칩',
    handleClick: () => console.log('큰 칩 클릭!'),
  },
}

export const AccentTheme: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.ACCENT,
    size: ChipSize.md,
    text: '액센트 칩',
    handleClick: () => console.log('액센트 칩 클릭!'),
  },
}

export const DarkTheme: Story = {
  args: {
    variant: ChipVariant.DEFAULT,
    theme: ChipTheme.DARK,
    size: ChipSize.md,
    text: '다크 칩',
    handleClick: () => console.log('다크 칩 클릭!'),
  },
}

export const HighlightVariant: Story = {
  args: {
    variant: ChipVariant.HIGHLIGHT,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.md,
    text: '하이라이트 칩',
    handleClick: () => console.log('하이라이트 칩 클릭!'),
  },
}

export const StrokeVariant: Story = {
  args: {
    variant: ChipVariant.STROKE,
    theme: ChipTheme.PRIMARY,
    size: ChipSize.md,
    text: '스트로크 칩',
    handleClick: () => console.log('스트로크 칩 클릭!'),
  },
}
