import { WORK_TIME_TAG_LIST } from '@/constants/Room'
import cn from '@/utils/cn'

interface IWorkTimeTagProps {
  selectedTag: string | null
  handleTagChange: (tag: string) => void
}

export default function WorkTimeTag({ selectedTag, handleTagChange }: IWorkTimeTagProps) {
  return (
    <>
      <div className="flex items-center gap-[8px] mb-[6px]">
        <h3 className="semi-16 text-grayscale-50">모각방 작업 시간대</h3>
        <span className="reg-12 text-accent-100">필수</span>
      </div>
      <p className="reg-12 text-grayscale-400 mb-[12px]">
        정확하지 않아도 괜찮아요. 주로 작업하는 시간대를 선택해주세요.
      </p>
      <div className="flex gap-[8px] flex-wrap">
        {WORK_TIME_TAG_LIST.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagChange(tag.id)}
            className={cn(
              'flex items-center gap-[8px] px-[12px] py-[8px] rounded-[4px] border-[1.5px] border-grayscale-600',
              selectedTag === tag.id && 'border-accentT-50 bg-accentT-10'
            )}
          >
            <span className={`${selectedTag === tag.id ? 'text-accentT-100' : 'text-grayscale-50'} semi-14`}>
              {tag.name}
            </span>
            <span className={`${selectedTag === tag.id ? 'text-grayscale-300' : 'text-grayscale-400'} reg-12`}>
              {tag.description}
            </span>
          </button>
          // <TextChip
          //   key={tag.id}
          //   variant={ChipVariant.STROKE}
          //   theme={ChipTheme.LIGHT}
          //   size={ChipSize.md}
          //   text={tag.name}
          //   detailText={tag.description}
          //   handleClick={() => {}}
          // />
        ))}
      </div>
    </>
  )
}
