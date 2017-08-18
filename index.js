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
    this.pages = Array(Math.ceil(this.rows.length / this.pageRows))
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
      height: (i < this.pages.length - 1
        ? this.pageHeight
        : this.rows.length % this.pageRows * this.rowHeight) + 'px',
      position: 'absolute',
      top: `${i * this.pageHeight}px`
    })
    this.inner.appendChild(this.pages[i])
    return this.pages[i]
  }

  render ({ refresh } = {}) {
    const viewStart = this.outer.scrollTop
    const viewEnd = viewStart + this.outerHeight

    for (let i = 0; i < this.pages.length; i++) {
      const page = this.getPage(i)
      const start = i * this.pageHeight - this.padding
      const end = start + this.pageHeight + this.padding
      if (
        (start >= viewStart && start <= viewEnd) ||
        (end >= viewStart && end <= viewEnd) ||
        (start <= viewStart && end >= viewEnd)
      ) {
        if (refresh) page.innerHTML = ''
        if (!page.children.length) this.fillPage(i)
      } else {
        if (page.children.length) page.innerHTML = ''
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
    for (
      let j = i * this.pageRows;
      j < Math.min((i + 1) * this.pageRows, this.rows.length);
      j++
    ) {
      page.appendChild(this.renderRow(this.rows[j]))
    }
  }
}

module.exports = Unendlich
