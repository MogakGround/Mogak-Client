'use client'

import Modal from '@/components/global/modal/Modal'
import Image from 'next/image'
import IconClose from '@/assets/svg/close.svg'
import { User } from '../api/type'

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
}

export default function MemberModal({ isOpen, onClose, users }: MemberModalProps) {
  return (
    <Modal isOpen={isOpen} handleCloseModal={onClose}>
      <div className="">
        <header className="flex justify-between text-grayscale-50 mb-12">
          <div className="flex gap-11 items-center">
            <span className="semi-20">모각방 인원</span>
            <span className="reg-16 text-grayscale-400">{users.length}명</span>
          </div>
          <button type="button" onClick={onClose} className="flex gap-6 items-center semi-16">
            <span>닫기</span>
            <Image src={IconClose} alt="닫기" className="pb-1" />
          </button>
        </header>

        <div className="med-16 grid grid-col-1 divide-y divide-grayscale-600 text-grayscale-100">
          {users.map(({ nickName, userId }) => (
            <div key={userId} className="py-14">
              {nickName}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
