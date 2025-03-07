import { useState } from 'react'

export default function useToast() {
  const [isToastShow, setIsToastShow] = useState(false)
  const [toastMessage, setToastMessage] = useState({
    text: '',
    success: false,
  })

  const handleShowIconToast = (text: string, success: boolean) => {
    setToastMessage({ text, success })
    setIsToastShow(true)
  }

  const handleCloseToast = () => {
    setIsToastShow(false)
  }

  const handleResetToast = () => {
    setToastMessage({ text: '', success: false })
    setIsToastShow(false)
  }

  return {
    isToastShow,
    toastMessage,
    setIsToastShow,
    setToastMessage,
    handleShowIconToast,
    handleCloseToast,
    handleResetToast,
  }
}
