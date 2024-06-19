export const getSgDateString = (): string => {
  return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Singapore' })
}
