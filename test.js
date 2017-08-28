'use strict'

const test = require('tape')
const Unendlich = require('.')

test('Unendlich', t => {
  t.test('no rows', t => {
    const rows = []
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {}
    const view = new Unendlich({ rows, inner, outer, render })
    t.ok(view)
    t.end()
  })
  t.test('row height', t => {
    const rows = [{}]
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {
      const el = document.createElement('div')
      el.style.height = '13px'
      return el
    }
    document.body.appendChild(inner)
    const view = new Unendlich({ rows, inner, outer, render })
    t.equal(view.rowHeight, 13)
    t.end()
  })
  t.end()
})
