'use client'

import Image from 'next/image'
import MogakSvg from '@/assets/svg/mogak-banner-bg.svg'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPerson from '@/assets/svg/person.svg'
import IconLink from '@/assets/svg/link.svg'
import IconMenu from '@/assets/svg/menu.svg'
import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconButton from '@/components/global/button/IconButton'
import Modal from '@/components/global/modal/Modal'
import { useState } from 'react'
import BasicButton from '@/components/global/button/BasicButton'
import { useGetRoomInfo, useGetRoomMembers, usePostLeaveRoom } from '../api/queries'
import MemberModal from './MemberModal'
import { useRouter } from 'next/navigation'
import cn from '@/utils/cn'
import RoomEditModal from './RoomEditModal'
import { useUserStore } from '@/store/userStore'
import AutoDisappearIconToast from '@/components/global/toast/AutoDisappearIconToast'
import { ToastTheme, ToastSize } from '@/components/global/toast/toast.types'

interface MogakHeaderProps {
  id: string
}

export default function MogakHeader({ id }: MogakHeaderProps) {
  const router = useRouter()
  const userID = useUserStore((state) => state.userID)

  const { data } = useGetRoomInfo(id)
  const { data: memberData } = useGetRoomMembers(id, userID!)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStopModalOpen, setIsStopModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showInviteToast, setShowInviteToast] = useState(false)

  const handleCopyInviteUrl = async () => {
    const inviteUrl = `${window.location.origin}/mogak/${id}`
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setShowInviteToast(true)
      setTimeout(() => setShowInviteToast(false), 2000)
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
    }
  }

  const { roomName, roomExplain, isHost, isLocked } = data!

  return (
    <div className="relative w-full min-h-142">
      <Image src={MogakSvg} alt="모각방 배경" layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-[#0F1220] opacity-90"></div>
      {showInviteToast && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[416px]">
          <AutoDisappearIconToast
            duration={2000}
            theme={ToastTheme.DARK}
            size={ToastSize.md}
            text="초대 URL이 복사되었어요."
            detailText="초대하고자 하는 곳에 붙여넣기 해주세요"
            success={true}
            handleClick={() => setShowInviteToast(false)}
          />
        </div>
      )}
      <div className="relative z-10 flex justify-between h-full px-80 py-40">
        <div className="flex flex-col">
          <h1 className="text-24 font-ria">{roomName}</h1>
          <p className="text-14 text-grayscale-200 reg-14">{roomExplain} 설명</p>
        </div>
        <div className="flex items-center gap-8">
          <IconTextButton
            variant={ButtonVariant.filled}
            theme={ButtonTheme.white}
            size={ButtonSize.md}
            text="초대하기"
            handleClick={handleCopyInviteUrl}
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
              <span className="med-14">{memberData?.userCnt} </span>
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
                  <button className={cn('text-left', !isHost && 'hidden')} onClick={() => setIsEditModalOpen(true)}>
                    방 정보 수정하기
                  </button>
                  <button className="text-left" onClick={() => setIsStopModalOpen(true)}>
                    작업 그만하기
                  </button>
                  <button className={cn('text-grayscale-300 text-left', !isHost && 'hidden')}>모각방 삭제하기</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} users={memberData?.usersWithMe ?? []} />
      <RoomEditModal
        roomId={id}
        isOpen={isEditModalOpen}
        handleCloseModal={() => setIsEditModalOpen(false)}
        currentRoomName={roomName}
        currentIsPublic={!isLocked}
      />
      <Modal isOpen={isStopModalOpen} handleCloseModal={() => setIsStopModalOpen(false)}>
        <p className="semi-20 mb-8">작업을 그만하고 나갈까요?</p>
        <p className="reg-14 mb-40 text-grayscale-200">모각방은 언제든 다시 들어올 수 있어요</p>
        <div className="flex justify-between">
          <BasicButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.text}
            size={ButtonSize.xxl}
            fullWidth
            text="작업 계속하기"
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
            handleClick={() => {
              router.push('/')
            }}
          />
        </div>
      </Modal>
    </div>
  )
}
