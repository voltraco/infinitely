const throttle = require('raf-throttle').default

class Unendlich {
  constructor ({ rows, inner, outer, render, page, padding }) {
    this.rows = rows
    this.inner = inner
    this.outer = outer
    this.renderRow = render
    this.rowHeight = this.getRowHeight()
    this.outerHeight = this.outer.offsetHeight
    this.pageRows = page || 100
    this.pageHeight = this.pageRows * this.rowHeight
    this.numPages = Math.ceil(this.rows.length / this.pageRows)
    this.pages = {}
    this.inner.style.height = `${this.rowHeight * this.rows.length}px`
    this.padRows = padding || 50
    this.padding = this.padRows * this.rowHeight
    this.render()
    this.outer.addEventListener('scroll', throttle(() => this.render()))
  }

  getPage (i) {
    if (this.pages[i]) return this.pages[i]

    this.pages[i] = document.createElement('div')
    Object.assign(this.pages[i].style, {
      height:
        (i < this.numPages - 1
          ? this.pageHeight
          : this.rows.length % this.pageRows * this.rowHeight) + 'px',
      position: 'absolute',
      top: `${i * this.pageHeight}px`,
      width: '100%'
    })
    this.inner.appendChild(this.pages[i])
    return this.pages[i]
  }

  render ({ refresh } = {}) {
    const viewStart = this.outer.scrollTop
    const viewEnd = viewStart + this.outerHeight
    const pagesRendered = {}

    for (let i = 0; i < this.numPages; i++) {
      const start = i * this.pageHeight - this.padding
      const end = start + this.pageHeight + this.padding
      if (
        (start >= viewStart && start <= viewEnd) ||
        (end >= viewStart && end <= viewEnd) ||
        (start <= viewStart && end >= viewEnd)
      ) {
        const page = this.getPage(i)
        if (refresh && page.children.length) page.innerHTML = ''
        if (!page.children.length) this.fillPage(i)
        pagesRendered[i] = true
      }
    }

    for (const i of Object.keys(this.pages)) {
      if (!pagesRendered[i]) {
        this.inner.removeChild(this.pages[i])
        delete this.pages[i]
      }
    }
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
}

module.exports = Unendlich
