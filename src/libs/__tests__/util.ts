import { getDateStr } from '../util'

describe('getDateStr', () => {
  it('should return formatted date string like `August 20, 2022`', () => {
    // Mock TODAY = 2022/08/20 00:00:00 UTC
    const timestamp: number = 1660924800000
    expect(getDateStr(timestamp)).toBe('August 20, 2022')
  })
})
