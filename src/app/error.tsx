'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-16">
      <p className="semi-20 text-grayscale-50">문제가 발생했습니다</p>
      <p className="reg-14 text-grayscale-200">{error.message || '잠시 후 다시 시도해주세요.'}</p>
      <button
        onClick={reset}
        className="px-16 py-8 bg-primary text-white rounded-8 med-14 hover:opacity-90 transition-opacity"
      >
        다시 시도
      </button>
    </div>
  )
}
