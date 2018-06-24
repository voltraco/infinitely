const assert = require('assert')

class Unendlich {
  constructor (args) {
    const {
      rows,
      inner,
      outer,
      render,
      update = null,
      page = 100,
      padding = 50,
      rowHeight = 0,
      debug = false
    } = args

    assert(inner, '.inner required')
    assert(outer, '.outer required')
    assert(render, '.render required')

    this.inner = inner
    this.outer = outer
    this.renderRow = render
    this.updateRow = update
    this.debug = debug
    this.outerHeight = this.outer.offsetHeight
    this.pageRows = page
    this.padRows = padding
    this.rowHeight = rowHeight
    this.pages = {}
    this.pagesAvailable = []
    this.setRows(rows)
    this.render()
    this.outer.addEventListener('scroll', () => {
      this.render()
    }, { passive: true })
  }

  async getRow (idx) {
    const el = this.rows[idx]
    return typeof el === 'function' ? el() : el
  }

  setRows (rows) {
    this.rows = rows
    this.numPages = Math.ceil(this.rows.length / this.pageRows)

    if (!this.rowHeight && rows[0]) {
      this.rowHeight = this.getRowHeight(rows[0])
    }

    this.inner.style.height = `${this.rowHeight * this.rows.length}px`
    this.pageHeight = this.pageRows * this.rowHeight
    this.padding = this.padRows * this.rowHeight
  }

  setHeight (height, { render } = {}) {
    this.outer.style.height = height
    this.outerHeight = this.outer.offsetHeight

    if (render !== false) {
      this.render()
    }
  }

  getPage (i) {
    let page, state

    ;[page, state] = this.pages[i]
      ? [this.pages[i], 'ok']
      : this.pagesAvailable.length
        ? [this.getAvailablePage(i), 'old']
        : [this.createNewPage(i), 'fresh']

    this.pages[i] = page

    page.style.height = i < this.numPages - 1
      ? `${this.pageHeight}px`
      : this.getLastPageHeight()

    page.style.top = this.getPageTop(i)
    return [page, state]
  }

  getAvailablePage (i) {
    const page = this.pagesAvailable.pop()
    this.inner.appendChild(page)
    return page
  }

  createNewPage (i) {
    const page = document.createElement('div')

    Object.assign(page.style, {
      position: 'absolute',
      minWidth: '100%'
    })

    if (this.debug) {
      page.style.backgroundColor = `hsla(${Math.random() *
        356}, 100%, 50%, 0.5)`
    }

    this.inner.appendChild(page)
    return page
  }

  async render ({ refresh, setRows } = {}) {
    if (refresh && setRows !== false) {
      this.setRows(this.rows)
    }

    const viewStart = this.outer.scrollTop
    const viewEnd = viewStart + this.outerHeight

    const _start = Math.floor((viewStart - this.padding) / this.pageHeight)
    const start = Math.max(_start, 0)

    const _end = Math.floor((viewEnd + this.padding) / this.pageHeight)
    const end = Math.min(_end, this.numPages - 1)
    const pagesRendered = {}

    for (let i = start; i <= end; i++) {
      const [page, state] = this.getPage(i)

      if (state === 'fresh') {
        await this.fillPage(i)
      } else if (refresh || state === 'old') {
        if (this.updateRow) {
          await this.updatePage(i)
        } else {
          page.innerHTML = ''
          await this.fillPage(i)
        }
      }
      pagesRendered[i] = true
    }

    for (const i of Object.keys(this.pages)) {
      if (pagesRendered[i]) {
        continue
      }

      this.pagesAvailable.push(this.pages[i])
      this.inner.removeChild(this.pages[i])
      delete this.pages[i]
    }
  }

  getPageTop (i) {
    return `${i * this.pageHeight}px`
  }

  getLastPageHeight (i) {
    return `${(this.rows.length % this.pageRows) * this.rowHeight}px`
  }

  getRowHeight (row) {
    const el = this.renderRow(row)
    this.inner.appendChild(el)
    const height = el.offsetHeight
    this.inner.removeChild(el)
    return height
  }

  async fillPage (i) {
    const page = this.pages[i]
    const frag = document.createDocumentFragment()
    const limit = Math.min((i + 1) * this.pageRows, this.rows.length)

    for (let j = i * this.pageRows; j < limit; j++) {
      frag.appendChild(this.renderRow(await this.getRow(j)))
    }

    page.appendChild(frag)
  }

  async updatePage (i) {
    const page = this.pages[i]
    const start = i * this.pageRows
    const limit = Math.min((i + 1) * this.pageRows, this.rows.length)

    if (start > limit) {
      this.inner.removeChild(page)
      delete this.pages[i]
      return
    }

    for (let j = start, rowIdx = 0; j < limit; j++, rowIdx++) {
      if (page.children[rowIdx]) {
        this.updateRow(await this.getRow(j), page.children[rowIdx])
      } else page.appendChild(this.renderRow(await this.getRow(j)))
    }

    while (page.children.length > limit - start) {
      page.removeChild(page.lastChild)
    }
  }
}

module.exports = Unendlich
