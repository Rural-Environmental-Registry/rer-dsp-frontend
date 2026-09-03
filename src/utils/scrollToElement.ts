export const SCROLL_OFFSET_RATIO = 0.1

/** Rola até o elemento deixando ~10% da viewport de folga acima dele. */
export function scrollToElement(
  selector: string,
  offsetRatio = SCROLL_OFFSET_RATIO,
): void {
  const element = document.querySelector(selector)
  if (!element || typeof window.scrollTo !== 'function') {
    return
  }

  const top = element.getBoundingClientRect().top + window.scrollY
  const offset = window.innerHeight * offsetRatio
  window.scrollTo({ top: Math.max(top - offset, 0), behavior: 'smooth' })
}
