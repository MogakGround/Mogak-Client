import Image from 'next/image'

export default function HeaderFallback() {
  return (
    <div className="relative w-full min-h-142">
      <Image src="/images/mogak-banner-bg.svg" alt="모각방 배경" fill style={{ objectFit: 'cover' }} />
      <div className="absolute inset-0 bg-[#0F1220] opacity-90"></div>
    </div>
  )
}
