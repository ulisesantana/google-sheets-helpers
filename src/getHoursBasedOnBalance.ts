/**
 * Get the hours based on balance.
 *
 * @param {string[][]} lastBalances The balance for each previous day on the given month.
 * @param {string} expected The expected duration for the day hours.
 * @return {string} The hours.
 * @customfunction
 */
function GET_HOURS_BASED_ON_BALANCE (lastBalances, expected) {
  // Only valid for cases with less than 24 hours
  function fromMinutesToDuration (minutes) {
    const timeInMs = minutes * 60 * 1000
    if (timeInMs < 0) {
      return `-${new Date(timeInMs * -1).toISOString().substr(11, 8)}`
    }
    return new Date(timeInMs).toISOString().substr(11, 8)
  }
  function fromDurationToMinutes (duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number)
    if (hours < 0) {
      return -(Math.abs(hours) * 60 + minutes + seconds / 60)
    }
    return hours * 60 + minutes + seconds / 60
  }

  // console.debug('RECEIVED LAST BALANCES', lastBalances)
  lastBalances = Array.isArray(lastBalances) ? lastBalances : [[lastBalances]]
  const expectedMinutes = fromDurationToMinutes(expected)
  if (expectedMinutes <= 0) {
    return expected
  }
  const lastWorkWeekBalances = lastBalances.flat().slice(lastBalances.length - 6)
  // console.debug('COMPUTED LAST WORKWEEK BALANCES', lastWorkWeekBalances)
  const negativeBalance = lastWorkWeekBalances
    .filter(balance => balance[0] === '-')
    .reduce((total, balance) => total + fromDurationToMinutes(balance), 0)
  return fromMinutesToDuration(expectedMinutes - negativeBalance)
}

describe('GET_HOURS_BASED_ON_BALANCE should retrieve the correct hours based on the given values', () => {
  it('with negative balance and more than a week of balance', () => {
    const lastBalances = [
      ['00:00:00'],
      ['05:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['-00:30:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['05:00:00']
    ]
    expect(GET_HOURS_BASED_ON_BALANCE(lastBalances, '05:00:00')).toBe('04:30:00')
  })
  it('without negative balance and more than a week of balance', () => {
    const lastBalances = [
      ['00:00:00'],
      ['05:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:30:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['05:00:00']
    ]
    expect(GET_HOURS_BASED_ON_BALANCE(lastBalances, '05:00:00')).toBe('05:00:00')
  })
  it('with negative balance and less than a work week of balance', () => {
    const lastBalances = [
      ['-00:30:00'],
      ['00:00:00'],
      ['05:00:00']
    ]
    expect(GET_HOURS_BASED_ON_BALANCE(lastBalances, '05:00:00')).toBe('04:30:00')
  })
  it('if expected hours is 00:00:00 then should return 00:00:00', () => {
    const lastBalances = [
      ['-00:30:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['00:00:00'],
      ['05:00:00']
    ]
    expect(GET_HOURS_BASED_ON_BALANCE(lastBalances, '00:00:00')).toBe('00:00:00')
  })
  it('if lastBalances is just one string', () => {
    expect(GET_HOURS_BASED_ON_BALANCE('08:00:00', '08:00:00')).toBe('08:00:00')
  })
})
