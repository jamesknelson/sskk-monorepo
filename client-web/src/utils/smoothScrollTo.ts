// From: https://gist.github.com/drwpow/17f34dc5043a31017f6bbc8485f0da3c

const easeOutCubic = (t: number) => --t * t * t + 1

export const smoothScrollTo = (
  coords: { top: number; left?: number },
  { duration = 400, offset = 0 } = {},
): Promise<void> => {
  const y = coords.top
  const startY = window.scrollY
  const difference = y - startY
  const startTime = performance.now()

  if (y === startY + offset) {
    return Promise.resolve(undefined)
  }

  return new Promise<void>((resolve) => {
    const step = () => {
      const progress = (performance.now() - startTime) / duration
      const amount = easeOutCubic(progress)
      window.scrollTo({ top: startY + amount * difference - offset })
      if (progress < 0.99) {
        window.requestAnimationFrame(step)
      } else {
        resolve()
      }
    }
    step()
  })
}
