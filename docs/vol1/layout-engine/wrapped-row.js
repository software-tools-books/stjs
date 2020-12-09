import assert from 'assert'

import PlacedRow from './placed-row.js'
import PlacedColumn from './placed-column.js'

export default class WrappedRow extends PlacedRow {
  constructor (width, ...children) {
    super(...children)
    assert(width > 0,
      'Need positive width')
    this.width = width
  }

  getWidth () {
    return this.width
  }

  // <wrap>
  wrap () {
    const children = this.children.map(child => child.wrap())
    const rows = []
    let currentRow = []
    let currentX = 0

    children.forEach(child => {
      const childWidth = child.getWidth()
      if ((currentX + childWidth) <= this.width) {
        currentRow.push(child)
        currentX += childWidth
      } else {
        rows.push(currentRow)
        currentRow = [child]
        currentX = childWidth
      }
    })
    rows.push(currentRow)

    const newRows = rows.map(row => new PlacedRow(...row))
    const newColumn = new PlacedColumn(...newRows)
    return new PlacedRow(newColumn)
  }
  // </wrap>
}