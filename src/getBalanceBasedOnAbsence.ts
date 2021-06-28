/**
 * Get hours balance based on absence if exists.
 *
 * @param {string} absence The absence duration.
 * @param {string} expected The expected duration for the day hours.
 * @param {string} total The total hours for that day.
 * @param {string} proportional The proportional duration for the day hours based on total hours for that day.
 * @return {string} The hours.
 * @customfunction
 */
function GET_BALANCE_BASED_ON_ABSENCE (absence, expected, total, proportional) {
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
    return hours * 60 + minutes + seconds / 60
  }

  if (absence !== '#N/A') {
    const absenceMinutes = fromDurationToMinutes(absence)
    const expectedMinutes = fromDurationToMinutes(expected)
    const totalMinutes = fromDurationToMinutes(total)
    const proportion = fromDurationToMinutes(proportional) / fromDurationToMinutes(total)
    if (absenceMinutes < expectedMinutes) {
      return fromMinutesToDuration(((expectedMinutes - absenceMinutes) * proportion) + (totalMinutes - expectedMinutes))
    }
    return expectedMinutes === 0
      ? fromMinutesToDuration((totalMinutes - (absenceMinutes * proportion)) - totalMinutes)
      : fromMinutesToDuration((absenceMinutes - expectedMinutes) * proportion)
  } else {
    return fromMinutesToDuration(fromDurationToMinutes(expected))
  }
}

describe('GET_BALANCE_BASED_ON_ABSENCE should', () => {
  it('retrieve the correct hours based on the given values', () => {
    expect(GET_BALANCE_BASED_ON_ABSENCE('2:00:00', '8:00:00', '8:00:00', '7:00:00')).toBe('05:15:00')
    expect(GET_BALANCE_BASED_ON_ABSENCE('2:00:00', '0:00:00', '8:00:00', '1:00:00')).toBe('-00:15:00')
    expect(GET_BALANCE_BASED_ON_ABSENCE('4:00:00', '0:00:00', '8:00:00', '1:00:00')).toBe('-00:30:00')
    expect(GET_BALANCE_BASED_ON_ABSENCE('4:00:00', '8:00:00', '8:00:00', '7:00:00')).toBe('03:30:00')
  })
  it('if absence is #N/A the expected duration is returned with proper format', () => {
    expect(GET_BALANCE_BASED_ON_ABSENCE('#N/A', '8:00:00', '8:00:00', '7:00:00')).toBe('08:00:00')
    expect(GET_BALANCE_BASED_ON_ABSENCE('#N/A', '00:00:00', '8:00:00', '1:00:00')).toBe('00:00:00')
  })
  it('for a given day the collaborator hours and the training hours must not be more than the absence', () => {
    expect(GET_BALANCE_BASED_ON_ABSENCE('4:00:00', '3:00:00', '8:00:00', '7:00:00')).toBe('00:52:30')
    expect(GET_BALANCE_BASED_ON_ABSENCE('4:00:00', '5:00:00', '8:00:00', '1:00:00')).toBe('03:07:30')
  })
})
