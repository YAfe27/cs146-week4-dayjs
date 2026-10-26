import MockDate from 'mockdate'
import dayjs from '../../src'
import isLeapYear from '../../src/plugin/isLeapYear'

dayjs.extend(isLeapYear)

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

it('IsLeapYear', () => {
  expect(dayjs('20000101').isLeapYear()).toBe(true)
  expect(dayjs('2100-01-01').isLeapYear()).toBe(false)
})

it('recognizes ordinary leap years and common years', () => {
  expect(dayjs('2024-01-01').isLeapYear()).toBe(true)
  expect(dayjs('2023-01-01').isLeapYear()).toBe(false)
})

it('uses the changed year without mutating the original date', () => {
  const original = dayjs('2024-01-01')
  const changed = original.year(2025)

  expect(changed.isLeapYear()).toBe(false)
  expect(original.isLeapYear()).toBe(true)
  expect(original.year()).toBe(2024)
})
