'use strict'

const test = require('tape')
const Unendlich = require('.')

test('Unendlich', t => {
  t.test('new Unendlich({ rows, inner, outer, render })', t => {
    const rows = []
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {}
    const view = new Unendlich({ rows, inner, outer, render })
    t.ok(view)
    t.end()
  })
  t.end()
})
