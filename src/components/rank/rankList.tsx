import RankItem from './rankItem'

interface IRankListProps {
  currentPage: number
  lastPage: number
}

export default function RankList({ currentPage, lastPage }: IRankListProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[20px]">
        {/* rank가 1등일 때, 2등일 때, 3등일 때 아이콘 처리 필요 */}
        {/* rank가 3-10등일 때는 그냥 숫자 표시 */}
        {Array.from({ length: 10 }).map((_, index) => (
          <RankItem key={index} rank={index + 1} nickname="닉닉네네임임" time={10000} />
        ))}
      </div>
    </div>
  )
}
