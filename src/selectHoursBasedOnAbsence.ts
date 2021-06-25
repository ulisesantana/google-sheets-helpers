/**
 * Select the hours based on absence if exists.
 *
 * @param {string} absence The absence duration.
 * @param {string} expected The expected duration for the day hours.
 * @param {number} proportion The proportional duration for the day hours based on total hours for that day.
 * @return {string} The hours.
 * @customfunction
 */
function SELECT_HOURS_BASED_ON_ABSENCE (absence, expected, proportion) {
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
    ? fromMinutesToDuration(fromDurationToMinutes(expected) - fromDurationToMinutes(absence) * proportion)
    : fromMinutesToDuration(fromDurationToMinutes(expected))
}

describe('SELECT_HOURS_BASED_ON_ABSENCE should', () => {
  it('retrieve the correct hours based on the given values', () => {
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '8:00:00', 0.875)).toBe('04:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '3:00:00', 0.875)).toBe('00:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '4:00:00', 0.125)).toBe('03:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('2:00:00', '8:00:00', 0.875)).toBe('06:15:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('4:00:00', '00:00:00', 0.125)).toBe('00:30:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('#N/A', '8:00:00', 0.875)).toBe('08:00:00')
    expect(SELECT_HOURS_BASED_ON_ABSENCE('#N/A', '00:00:00', 0.125)).toBe('00:00:00')
  })
})
