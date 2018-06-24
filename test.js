'use strict'

const test = require('tape')
const Infinitely = require('.')

test('Infinitely', t => {
  t.test('no rows', t => {
    const rows = []
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {}
    const view = new Infinitely({ rows, inner, outer, render })
    t.ok(view)
    t.end()
  })

  t.test('.rowHeight', t => {
    const rows = [{ height: 13 }]
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    let render = row => {
      const el = document.createElement('div')
      el.style.height = `${row.height}px`
      return el
    }
    document.body.appendChild(inner)
    const view = new Infinitely({ rows, inner, outer, render })
    t.equal(view.rowHeight, 13)
    t.end()
  })

  t.test('.numPages', t => {
    let rows = Array(123)
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {
      const el = document.createElement('div')
      el.style.height = '13px'
      return el
    }
    const page = 100
    document.body.appendChild(inner)
    const view = new Infinitely({ rows, inner, outer, render, page })
    t.equal(view.numPages, Math.ceil(rows.length / page))
    rows = Array(23)
    view.setRows(rows)
    t.equal(view.numPages, Math.ceil(rows.length / page))
    t.end()
  })

  t.test('inner height', t => {
    let rows = Array(123)
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = () => {
      const el = document.createElement('div')
      el.style.height = '13px'
      return el
    }
    document.body.appendChild(inner)
    const view = new Infinitely({ rows, inner, outer, render })
    t.equal(inner.style.height, `${13 * rows.length}px`)
    rows = Array(23)
    view.setRows(rows)
    t.equal(inner.style.height, `${13 * rows.length}px`)
    t.end()
  })

  t.test('.pageHeight', t => {
    const rows = [{ height: 13 }]
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = row => {
      const el = document.createElement('div')
      el.style.height = `${row.height}px`
      return el
    }
    document.body.appendChild(inner)
    const page = 100
    const view = new Infinitely({ rows, inner, outer, render, page })
    t.equal(view.pageHeight, page * rows[0].height)
    rows[0].height = 14
    view.setRows(rows)
    t.equal(view.pageHeight, page * rows[0].height)
    t.end()
  })

  t.test('.padding', t => {
    const rows = [{ height: 13 }]
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = row => {
      const el = document.createElement('div')
      el.style.height = `${row.height}px`
      return el
    }
    document.body.appendChild(inner)
    const padding = 50
    const view = new Infinitely({ rows, inner, outer, render, padding })
    t.equal(view.padding, padding * rows[0].height)
    rows[0].height = 14
    view.setRows(rows)
    t.equal(view.padding, padding * rows[0].height)
    t.end()
  })

  t.test('.createNewPage(i)', t => {
    const rows = []
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = row => document.createElement('div')
    const view = new Infinitely({ rows, inner, outer, render })

    const page = view.createNewPage(0)
    t.equal(page.tagName, 'DIV')
    t.equal(page.style.position, 'absolute')
    t.equal(page.style.width, '100%')
    t.ok(inner.contains(page))

    view.debug = true
    const debugPage = view.createNewPage(0)
    t.ok(debugPage.style.backgroundColor)

    t.end()
  })

  t.test('.getAvailablePage(i)', t => {
    const rows = []
    const inner = document.createElement('div')
    const outer = document.createElement('div')
    const render = row => document.createElement('div')
    const view = new Infinitely({ rows, inner, outer, render })

    view.pagesAvailable.push(view.createNewPage(0))
    const page = view.getAvailablePage(1)

    t.ok(inner.contains(page))

    t.end()
  })

  t.end()
})
