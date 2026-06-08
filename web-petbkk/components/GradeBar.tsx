interface Props {
  green: number
  yellow: number
  red: number
  black: number
  size?: 'sm' | 'lg'
}

export default function GradeBar({ green, yellow, red, black, size = 'sm' }: Props) {
  const cls = size === 'lg'
    ? 'px-3 py-1.5 rounded-full text-sm font-semibold'
    : 'px-2 py-0.5 rounded-full text-xs font-medium'

  return (
    <div className="flex gap-1.5 flex-wrap">
      <span className={`${cls} bg-green-100 text-green-800`}>🟢 {green}</span>
      <span className={`${cls} bg-yellow-100 text-yellow-800`}>🟡 {yellow}</span>
      <span className={`${cls} bg-red-100 text-red-800`}>🔴 {red}</span>
      <span className={`${cls} bg-gray-800 text-white`}>⚫ {black}</span>
    </div>
  )
}
