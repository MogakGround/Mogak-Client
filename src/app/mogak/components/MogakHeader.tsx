'use client'

import Image from 'next/image'
import MogakSvg from '@/assets/svg/mogak-banner-bg.svg'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPerson from '@/assets/svg/person.svg'
import IconLink from '@/assets/svg/link.svg'
import IconMenu from '@/assets/svg/menu.svg'
import IconClose from '@/assets/svg/close.svg'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconButton from '@/components/global/button/IconButton'
import Modal from '@/components/global/modal/Modal'
import { useState } from 'react'
import BasicButton from '@/components/global/button/BasicButton'

export default function MogakHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStopModalOpen, setIsStopModalOpen] = useState(false)

  const dummyUsers = [
    { id: 1, name: '대기업 가고싶어요' },
    { id: 2, name: '대기업 가고싶어요' },
    { id: 3, name: '대기업 가고싶어요' },
    { id: 4, name: '대기업 가고싶어요' },
    { id: 5, name: '대기업 가고싶어요' },
  ]

  return (
    <div className="relative w-full min-h-142">
      <Image src={MogakSvg} alt="모각방 배경" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-[#0F1220] opacity-90"></div>
      <div className="relative z-10 flex justify-between h-full px-80 py-40">
        <div className="flex flex-col">
          <h1 className="text-24 font-ria">방 제목</h1>
          <p className="text-14 text-grayscale-200 reg-14">어쩌고저쩌고 설명</p>
        </div>
        <div className="flex items-center gap-8">
          <IconTextButton
            variant={ButtonVariant.filled}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            text="초대하기"
            handleClick={() => {}}
            iconArrow={IconArrow.right}
            iconSrc={IconLink}
          />
          <IconTextButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            handleClick={() => {
              setIsModalOpen(true)
            }}
            iconArrow={IconArrow.left}
            iconSrc={IconPerson}
            iconWidth={24}
          >
            <div className="ml-5">
              <span className="med-14">1 </span>
              <span className="reg-14 text-gray-400">/ 5</span>
            </div>
          </IconTextButton>
          <div className="relative">
            <IconButton
              variant={ButtonVariant.default}
              theme={ButtonTheme.white}
              size={ButtonSize.xl}
              handleClick={() => {
                setIsMenuOpen(!isMenuOpen)
              }}
              iconSrc={IconMenu}
              className="h-36 w-36 px-0"
            />
            {isMenuOpen && (
              <div className="absolute right-0 top-48 bg-grayscale-700 rounded-12 p-16 z-10">
                <div className="flex flex-col text-grayscale-70 gap-16 whitespace-nowrap med-14">
                  <button className="text-left">방 정보 수정하기</button>
                  <button className="text-left" onClick={() => setIsStopModalOpen(true)}>
                    작업 그만하기
                  </button>
                  <button className="text-grayscale-300 text-left">모각방 삭제하기</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)}>
        <div>
          <header className="flex justify-between text-grayscale-50 mb-12">
            <div className="flex gap-11 items-center">
              <span className="semi-20">모각방 인원</span>
              <span className="reg-16 text-grayscale-400">5명</span>
            </div>
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex gap-6 items-center semi-16">
              <span>닫기</span>
              <Image src={IconClose} alt="닫기" className="pb-1" />
            </button>
          </header>
          <div className="med-16 grid grid-col-1 divide-y divide-grayscale-600 text-grayscale-100">
            {dummyUsers.map((user) => (
              <div key={user.id} className="py-14">
                {user.name}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal isOpen={isStopModalOpen} handleCloseModal={() => setIsStopModalOpen(false)}>
        <p className="semi-20 mb-8">작업을 그만하고 나갈까요?</p>
        <p className="reg-14 mb-40 text-grayscale-200">모각방은 언제든 다시 들어올 수 있어요</p>
        <div className="flex justify-between">
          <BasicButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.text}
            size={ButtonSize.xxl}
            fullWidth
            text="작업계속하기"
            handleClick={() => {
              setIsStopModalOpen(false)
            }}
          />
          <BasicButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.primary}
            size={ButtonSize.xxl}
            fullWidth
            text="모각방 나가기"
            handleClick={() => {}}
          />
        </div>
      </Modal>
    </div>
  )
}
