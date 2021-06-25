/**
 * Get proportion between two durations.
 *
 * @param {string} proportional The proportional duration for the day hours based on total hours for that day.
 * @param {string} total The total duration for the day.
 * @return {number} The proportional duration for the given total duration.
 * @customfunction
 */
function GET_PROPORTION_FOR_DURATION (proportional, total) {
  function fromDurationToMinutes (duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number)
    return hours * 60 + minutes + seconds / 60
  }
  return fromDurationToMinutes(proportional) / fromDurationToMinutes(total)
}

describe('GET_PROPORTION_FOR_DURATION should', () => {
  it('retrieve the correct proportion based on the given values', () => {
    expect(GET_PROPORTION_FOR_DURATION('07:00:00', '08:00:00')).toBe(0.875)
    expect(GET_PROPORTION_FOR_DURATION('01:00:00', '08:00:00')).toBe(0.125)
  })
})
