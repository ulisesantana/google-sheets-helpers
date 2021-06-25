/**
 * Get proportional time for a duration.
 *
 * @param {string} absence The absence duration.
 * @param {string} expected The expected duration for the day hours.
 * @param {string} proportional The proportional duration for the day hours based on total.
 * @param {string} total The total duration for the day hours.
 * @return {number} The proportional duration for the given total duration.
 * @customfunction
 */
function SELECT_HOURS_BASED_ON_ABSENCE (absence, expected, proportional, total) {
  const getProportion = (proportion, total) => fromDurationToMinutes(proportion) / fromDurationToMinutes(total)
  // Only valid for cases with less than 24 hours
  function fromMinutesToDuration (minutes) {
    const timeInMs = minutes * 60 * 1000
    if (timeInMs < 0) {
      return new Date(timeInMs * -1).toISOString().substr(11, 8)
    }
    return new Date(timeInMs).toISOString().substr(11, 8)
  }
  function fromDurationToMinutes (duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number)
    return hours * 60 + minutes + seconds / 60
  }
  return absence !== '#N/A'
    ? fromMinutesToDuration(fromDurationToMinutes(expected) - fromDurationToMinutes(absence) * getProportion(proportional, total))
    : fromMinutesToDuration(fromDurationToMinutes(expected))
}

describe('Get proportional duration should', () => {
  it('compute proportional duration for the given values', () => {
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '8:00:00', '7:00:00', '8:00:00')).toBe('04:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '3:00:00', '7:00:00', '7:00:00')).toBe('01:00:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '4:00:00', '1:00:00', '7:00:00')).toBe('03:25:42')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('2:00:00', '8:00:00', '7:00:00', '8:00:00')).toBe('06:15:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '00:00:00', '1:00:00', '8:00:00')).toBe('00:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('#N/A', '8:00:00', '7:00:00', '8:00:00')).toBe('08:00:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('#N/A', '00:00:00', '1:00:00', '8:00:00')).toBe('00:00:00')
  })
})
