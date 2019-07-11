import parseDate from 'date-fns/parse'
import createSelector from 'selectorator'
import { getUsers } from 'store/data/user'
import { getTagsById } from './tags'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'

export const getBudgetsById = createSelector(
  [getUsers, getTagsById, 'data.budget', 'diff.budget'],
  (users, tags, serverBudgets, diffBudgets) => {
    const result = {}
    const budgets = { ...serverBudgets, ...diffBudgets }
    for (const id in budgets) {
      result[id] = new Budget(budgets[id], users, tags)
    }
    return result
  }
)

export const getBudgetsByMonthAndTag = createSelector(
  [getBudgetsById],
  budgets => {
    const result = {}
    for (const id in budgets) {
      const budget = budgets[id]
      const { date, tag } = budget
      if (!result[date]) {
        result[date] = {}
      }
      result[date][tag] = budget
    }
    return result
  }
)

export const getBudget = (state, month, tag) => {
  return getBudgetsByMonthAndTag(state)[month]
    ? getBudgetsByMonthAndTag(state)[month][tag]
    : null
}

export class Budget {
  constructor(raw, users) {
    this.user = users[raw.user]
    this.changed = raw.changed * 1000

    this.date = +parseDate(raw.date)
    this.tag = raw.tag // just string, it can be "00000000-0000-0000-0000-000000000000"

    this.income = raw.income
    this.incomeLock = raw.incomeLock
    this.outcome = raw.outcome
    this.outcomeLock = raw.outcomeLock
  }

  get raw() {
    return {
      user: this.user.id,
      changed: this.changed / 1000,

      date: format(this.date, 'YYYY-MM-DD', { locale: ru }),
      tag: this.tag,

      income: this.income,
      incomeLock: this.incomeLock,
      outcome: this.outcome,
      outcomeLock: this.outcomeLock,
    }
  }

  static create({
    user,
    changed = Date.now() / 1000,
    date,
    tag,
    income = 0,
    incomeLock = false,
    outcome = 0,
    outcomeLock = false,
  }) {
    return {
      user,
      changed,
      date,
      tag,
      income,
      incomeLock,
      outcome,
      outcomeLock,
    }
  }
}
