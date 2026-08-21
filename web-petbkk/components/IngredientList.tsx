import type { Ingredient } from '@/lib/types'

const gradeStyle: Record<string, string> = {
  green:  'bg-green-50 border-green-200 text-green-900',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  red:    'bg-red-50 border-red-300 text-red-900 font-medium',
  black:  'bg-gray-900 border-gray-700 text-white font-medium',
  neutral: 'bg-gray-50 border-gray-200 text-gray-600',
  unknown: 'bg-gray-50 border-dashed border-gray-200 text-gray-500',
}

const gradeIcon: Record<string, string> = {
  green: '🟢', yellow: '🟡', red: '🔴', black: '⚫',
  neutral: '⚪', unknown: '❔',
}

export default function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ol className="space-y-1.5">
      {ingredients.map(ing => (
        <li
          key={ing.position}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${gradeStyle[ing.grade] ?? gradeStyle.unknown}`}
        >
          <span className="text-xs text-gray-400 w-5 shrink-0">{ing.position}.</span>
          <span className="shrink-0">{gradeIcon[ing.grade] ?? '❔'}</span>
          <span>{ing.name}</span>
        </li>
      ))}
    </ol>
  )
}
