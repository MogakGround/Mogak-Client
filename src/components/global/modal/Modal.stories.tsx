import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Modal, { ModalBackground } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: { type: 'select' },
      options: Object.values(ModalBackground),
    },
    hasOverlay: {
      control: { type: 'boolean' },
    },
    closeOnOutsideClick: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 모달을 열고 닫을 수 있는 래퍼 컴포넌트
const ModalWrapper = ({ children, ...props }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        모달 열기
      </button>
      <Modal
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
        {...props}
      >
        {children}
      </Modal>
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">기본 모달</h2>
        <p className="mb-4">이것은 기본 모달입니다.</p>
        <button 
          onClick={() => args.handleCloseModal?.()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </ModalWrapper>
  ),
  args: {
    hasOverlay: true,
    closeOnOutsideClick: true,
    backgroundColor: ModalBackground.gray700,
  },
}

export const WithoutOverlay: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">오버레이 없는 모달</h2>
        <p className="mb-4">이 모달은 배경 오버레이가 없습니다.</p>
        <button 
          onClick={() => args.handleCloseModal?.()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </ModalWrapper>
  ),
  args: {
    hasOverlay: false,
    closeOnOutsideClick: true,
    backgroundColor: ModalBackground.gray700,
  },
}

export const DarkBackground: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">다크 배경 모달</h2>
        <p className="mb-4">이 모달은 다크 배경을 사용합니다.</p>
        <button 
          onClick={() => args.handleCloseModal?.()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </ModalWrapper>
  ),
  args: {
    hasOverlay: true,
    closeOnOutsideClick: true,
    backgroundColor: ModalBackground.gray800,
  },
}

export const WithBottomContent: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-4">하단 콘텐츠가 있는 모달</h2>
        <p className="mb-4">이 모달은 하단에 추가 콘텐츠가 있습니다.</p>
        <button 
          onClick={() => args.handleCloseModal?.()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          닫기
        </button>
      </div>
    </ModalWrapper>
  ),
  args: {
    hasOverlay: true,
    closeOnOutsideClick: true,
    backgroundColor: ModalBackground.gray700,
    renderBottomFn: () => (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 text-white text-center">
        하단 추가 콘텐츠
      </div>
    ),
  },
} 