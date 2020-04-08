// to prevent build errors in gatsby:
export const buildIsOngoing: () => boolean = () => typeof window === 'undefined'

export const getViewportWidth = (): number => {
  if (buildIsOngoing()) {
    return 0
  }
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

export const getViewportHeight = (): number => {
  if (buildIsOngoing()) {
    return 0
  }
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}
