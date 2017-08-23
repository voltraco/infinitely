const throttle = require('raf-throttle').default

class Unendlich {
  constructor ({ rows, inner, outer, render, update, page, padding, debug }) {
    this.inner = inner
    this.outer = outer
    this.renderRow = render
    this.updateRow = update
    this.debug = debug
    this.rowHeight = rows.length ? this.getRowHeight(rows[0]) : 0
    this.outerHeight = this.outer.offsetHeight
    this.pageRows = page || 100
    this.setRows(rows)
    this.pageHeight = this.pageRows * this.rowHeight
    this.pages = {}
    this.pagesAvailable = []
    this.padRows = padding || 50
    this.padding = this.padRows * this.rowHeight
    this.render()
    this.outer.addEventListener('scroll', throttle(() => this.render()))
  }

  setRows (rows) {
    this.rows = rows
    this.numPages = Math.ceil(this.rows.length / this.pageRows)
    this.inner.style.height = `${this.rowHeight * this.rows.length}px`
  }

  getPage (i) {
    let page, state
    ;[page, state] = this.pages[i]
      ? [this.pages[i], 'ok']
      : this.pagesAvailable.length
        ? [this.getAvailablePage(i), 'old']
        : [this.createNewPage(i), 'fresh']
    this.pages[i] = page
    page.style.height =
      i < this.numPages - 1 ? `${this.pageHeight}px` : this.getLastPageHeight()
    return [page, state]
  }

  getAvailablePage (i) {
    const page = this.pagesAvailable.pop()
    page.style.top = this.getPageTop(i)
    this.inner.appendChild(page)
    return page
  }

  createNewPage (i) {
    const page = document.createElement('div')
    Object.assign(page.style, {
      position: 'absolute',
      top: this.getPageTop(i),
      width: '100%'
    })
    if (this.debug) {
      page.style.backgroundColor = `hsla(${Math.random() *
        356}, 100%, 50%, 0.5)`
    }
    this.inner.appendChild(page)
    return page
  }

  render ({ refresh } = {}) {
    const viewStart = this.outer.scrollTop
    const viewEnd = viewStart + this.outerHeight
    const start = Math.max(
      Math.floor((viewStart - this.padding) / this.pageHeight),
      0
    )
    const end = Math.min(
      Math.floor((viewEnd + this.padding) / this.pageHeight),
      this.numPages - 1
    )
    const pagesRendered = {}

    for (let i = start; i <= end; i++) {
      const [page, state] = this.getPage(i)
      if (state === 'fresh') {
        this.fillPage(i)
      } else if (refresh || state === 'old') {
        if (this.updateRow) {
          this.updatePage(i)
        } else {
          page.innerHTML = ''
          this.fillPage(i)
        }
      }
      pagesRendered[i] = true
    }

    for (const i of Object.keys(this.pages)) {
      if (!pagesRendered[i]) {
        this.pagesAvailable.push(this.pages[i])
        this.inner.removeChild(this.pages[i])
        delete this.pages[i]
      }
    }
  }

  getPageTop (i) {
    return `${i * this.pageHeight}px`
  }

  getLastPageHeight (i) {
    return `${this.rows.length % this.pageRows * this.rowHeight}px`
  }

  getRowHeight (row) {
    const el = this.renderRow(row)
    this.inner.appendChild(el)
    const height = el.offsetHeight
    this.inner.removeChild(el)
    return height
  }

  fillPage (i) {
    const page = this.pages[i]
    const frag = document.createDocumentFragment()
    const limit = Math.min((i + 1) * this.pageRows, this.rows.length)
    for (let j = i * this.pageRows; j < limit; j++) {
      frag.appendChild(this.renderRow(this.rows[j]))
    }
    page.appendChild(frag)
  }

  updatePage (i) {
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
        this.updateRow(this.rows[j], page.children[rowIdx])
      } else page.appendChild(this.renderRow(this.rows[j]))
    }
    while (page.children.length > limit - start) {
      page.removeChild(page.lastChild)
    }
  }
}

module.exports = Unendlich
