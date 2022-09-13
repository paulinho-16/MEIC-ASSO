function pad(s: number): string {
  return (s < 10 ? '0' : '') + s
}

export function format(seconds: number) {
  const hours = pad(Math.floor(seconds / (60 * 60)))
  const minutes = pad(Math.floor((seconds % (60 * 60)) / 60))
  const sec = pad(Math.floor(seconds % 60))

  return hours + ':' + minutes + ':' + sec
}
