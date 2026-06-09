'use client'
import { useState } from 'react'
import type { Ingredient } from '@/lib/types'

const GRADE_CONFIG = {
  black:  { emoji: '⚫', label: '사용금지 성분', textCls: 'text-gray-900',   bgCls: 'bg-gray-100',   borderCls: 'border-gray-400' },
  red:    { emoji: '🔴', label: '위험 성분',    textCls: 'text-red-700',    bgCls: 'bg-red-50',     borderCls: 'border-red-200' },
  yellow: { emoji: '🟡', label: '주의 성분',    textCls: 'text-yellow-700', bgCls: 'bg-yellow-50',  borderCls: 'border-yellow-200' },
  green:  { emoji: '🟢', label: '우수 성분',    textCls: 'text-green-700',  bgCls: 'bg-green-50',   borderCls: 'border-green-200' },
} as const

type GradeKey = keyof typeof GRADE_CONFIG

function Group({ grade, items }: { grade: GradeKey; items: Ingredient[] }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = GRADE_CONFIG[grade]
  const visible = expanded ? items : items.slice(0, 5)

  return (
    <div className={`rounded-xl border p-3 ${cfg.bgCls} ${cfg.borderCls}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{cfg.emoji}</span>
        <span className={`text-sm font-semibold ${cfg.textCls}`}>
          {cfg.label} ({items.length}개)
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map(i => (
          <span
            key={i.position}
            className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bgCls} ${cfg.borderCls} ${cfg.textCls}`}
          >
            {i.name}
          </span>
        ))}
      </div>
      {items.length > 5 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className={`mt-2 text-xs underline ${cfg.textCls}`}
        >
          {expanded ? '접기' : `+ ${items.length - 5}개 더보기`}
        </button>
      )}
    </div>
  )
}

interface Props {
  ingredients: Ingredient[]
}

export default function IngredientGroups({ ingredients }: Props) {
  const groups: Record<GradeKey, Ingredient[]> = {
    black:  ingredients.filter(i => i.grade === 'black'),
    red:    ingredients.filter(i => i.grade === 'red'),
    yellow: ingredients.filter(i => i.grade === 'yellow'),
    green:  ingredients.filter(i => i.grade === 'green'),
  }

  return (
    <div className="space-y-3">
      {groups.black.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-sm font-medium text-red-700">
          ⚠️ 사용 금지 성분이 포함되어 있습니다
        </div>
      )}
      {(['black', 'red', 'yellow', 'green'] as const).map(grade =>
        groups[grade].length > 0
          ? <Group key={grade} grade={grade} items={groups[grade]} />
          : null
      )}
    </div>
  )
}
