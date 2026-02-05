import { useState, useCallback, useMemo } from 'react'
import { WorkHours } from '@/app/api/room/room.types'

const ALL_WORK_HOURS: WorkHours[] = ['LATE_NIGHT', 'MORNING', 'AFTERNOON', 'NIGHT']

export function useTimeFilter() {
  const [selectedWorkHours, setSelectedWorkHours] = useState<Set<WorkHours>>(new Set(ALL_WORK_HOURS))

  const isAllSelected = selectedWorkHours.size === ALL_WORK_HOURS.length
  const isNoneSelected = selectedWorkHours.size === 0

  const toggleAll = useCallback(() => {
    setSelectedWorkHours((prev) => (prev.size === ALL_WORK_HOURS.length ? new Set() : new Set(ALL_WORK_HOURS)))
  }, [])

  const toggleWorkHour = useCallback((workHour: WorkHours) => {
    setSelectedWorkHours((prev) => {
      const next = new Set(prev)
      if (next.has(workHour)) {
        next.delete(workHour)
      } else {
        next.add(workHour)
      }
      return next
    })
  }, [])

  const workHoursParam = useMemo((): WorkHours[] | undefined => {
    if (isAllSelected) return undefined
    return Array.from(selectedWorkHours)
  }, [selectedWorkHours, isAllSelected])

  return { selectedWorkHours, isAllSelected, isNoneSelected, toggleAll, toggleWorkHour, workHoursParam }
}
