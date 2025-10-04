'use client'

import { useState, useMemo } from 'react'
import {Search, Plus} from 'react-feather'
import Link from 'next/link'

import {Input} from '@/components/ui/input'
import CourseCard from '@/components/ui/course-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Calendar} from '@/components/ui/calendar'
import { CourseWithOptionalDate, DatePreset } from '@/types/date'
import { inPreset, parseDate } from '@/lib/date'

export default function CoursesList({
  courses,
}: {
  courses: CourseWithOptionalDate[]
}) {
  const [query, setQuery] = useState('')
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [exactDate, setExactDate] = useState<Date | undefined>(undefined)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (courses ?? []).filter((c) => {
      const matchesQuery = !q
        ? true
        : [c.name, c.description ?? ''].some((v) =>
            v?.toLowerCase().includes(q),
          )

      const createdAt = parseDate((c as any).created_at)
      const matchesDate = createdAt
        ? inPreset(createdAt, datePreset, exactDate)
        : true

      return matchesQuery && matchesDate
    })
  }, [courses, query, datePreset, exactDate])



  return (
    <div className='flex flex-1 flex-col gap-4 p-6'>
      <div className='flex items-center justify-between flex-wrap gap-3 mb-4'>
        <h2 className='text-2xl font-semibold text-sb-text-primary'>My Courses</h2>
        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <div className='relative w-full sm:w-80'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-sb-text-secondary size-4' />
            <Input
              placeholder='Search courses...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='pl-9 bg-sb-surface-hover border-sb-border text-sb-text-primary placeholder-sb-text-secondary focus:ring-sb-primary'
            />
          </div>

          <Select
            value={datePreset}
            onValueChange={(val) => setDatePreset(val as DatePreset)}
          >
            <SelectTrigger className='bg-sb-surface-hover border-sb-border text-sb-text-primary'>
              <SelectValue placeholder='Creation Date' />
            </SelectTrigger>
            <SelectContent className='bg-sb-surface border-sb-border'>
              <SelectItem value='all' className='text-sb-text-primary hover:bg-sb-surface-hover'>All dates</SelectItem>
              <SelectItem value='today' className='text-sb-text-primary hover:bg-sb-surface-hover'>Today</SelectItem>
              <SelectItem value='last7' className='text-sb-text-primary hover:bg-sb-surface-hover'>Last 7 days</SelectItem>
              <SelectItem value='last30' className='text-sb-text-primary hover:bg-sb-surface-hover'>Last 30 days</SelectItem>
              <SelectItem value='thisYear' className='text-sb-text-primary hover:bg-sb-surface-hover'>This year</SelectItem>
              <SelectItem value='on' className='text-sb-text-primary hover:bg-sb-surface-hover'>On…</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {datePreset === 'on' && (
        <div className='border border-sb-border rounded-xl p-3 bg-sb-surface'>
          <Calendar
            mode='single'
            selected={exactDate}
            onSelect={(d) => setExactDate(d)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 w-full h-[calc(100vh-300px)]'>
          <Link
            className='px-4 py-2 bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary rounded-md transition-colors duration-200 flex'
            href='/dashboard/courses/create'
          >
            <Plus className='text-sb-text-primary text-sm' />
            <span className='text-sb-text-primary pl-2'>Add Course</span>
          </Link>
          <p className='mt-4 text-lg text-sb-text-secondary'>
            No courses found.
          </p>
        </div>
      ) : (
        <div className='grid auto-rows-min gap-6 md:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4'>
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
