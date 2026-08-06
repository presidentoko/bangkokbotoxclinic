// Share a canvas as a PNG via the Web Share API when it's actually usable,
// otherwise fall back to triggering a browser download — so the share button
// never just sits there doing nothing (Safari < 13.1 has `share` but not
// `canShare`; desktop browsers commonly have neither).
export function shareOrDownloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  shareData: { title: string; text: string; url?: string }
) {
  canvas.toBlob(blob => {
    if (!blob) return
    const file = new File([blob], filename, { type: 'image/png' })

    const canUseShare =
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })

    if (canUseShare) {
      navigator.share({ ...shareData, files: [file] }).catch(() => {})
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
