const throttle = require('raf-throttle').default

class Unendlich {
  constructor ({ rows, inner, outer, render, update, page, padding }) {
    this.rows = rows
    this.inner = inner
    this.outer = outer
    this.renderRow = render
    this.updateRow = update
    this.rowHeight = this.getRowHeight()
    this.outerHeight = this.outer.offsetHeight
    this.pageRows = page || 100
    this.pageHeight = this.pageRows * this.rowHeight
    this.numPages = Math.ceil(this.rows.length / this.pageRows)
    this.pages = {}
    this.pagesAvailable = []
    this.inner.style.height = `${this.rowHeight * this.rows.length}px`
    this.padRows = padding || 50
    this.padding = this.padRows * this.rowHeight
    this.render()
    this.outer.addEventListener('scroll', throttle(() => this.render()))
  }

  getPage (i) {
    if (this.pages[i]) return [this.pages[i], 'ok']
    let state
    ;[this.pages[i], state] = this.pagesAvailable.length
      ? [this.getAvailablePage(i), 'old']
      : [this.createNewPage(i), 'fresh']
    return [this.pages[i], state]
  }

  getAvailablePage (i) {
    const page = this.pagesAvailable.pop()
    if (!this.updateRow) page.innerHTML = ''
    Object.assign(page.style, {
      top: this.getPageTop(i),
      height:
        i < this.numPages - 1
          ? `${this.pageHeight}px`
          : this.getLastPageHeight()
    })
    return page
  }

  createNewPage (i) {
    const page = document.createElement('div')
    Object.assign(page.style, {
      height:
        i < this.numPages - 1
          ? `${this.pageHeight}px`
          : this.getLastPageHeight(),
      position: 'absolute',
      top: this.getPageTop(i),
      width: '100%'
    })
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
      } else if ((refresh || state === 'old') && !this.updateRow) {
        page.innerHTML = ''
        this.fillPage(i)
      } else if ((refresh || state === 'old') && this.updateRow) {
        this.updatePage(i)
      }
      pagesRendered[i] = true
    }

    for (const i of Object.keys(this.pages)) {
      if (!pagesRendered[i]) {
        this.pagesAvailable.push(this.pages[i])
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

  getRowHeight () {
    const row = this.renderRow(this.rows[0])
    this.inner.appendChild(row)
    const height = row.offsetHeight
    this.inner.removeChild(row)
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
    for (let j = start, rowIdx = 0; j < limit; j++, rowIdx++) {
      if (page.children[rowIdx]) {
        this.updateRow(this.rows[j], page.children[rowIdx])
      } else page.appendChild(this.renderRow(this.rows[j]))
    }
    while (page.children.length > limit - start) { page.removeChild(page.lastChild) }
  }
}

module.exports = Unendlich
