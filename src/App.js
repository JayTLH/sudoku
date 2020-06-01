import React, { Component } from 'react'
import './App.scss'
import github from './assets/github.png'

const blank = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const slicer = (blank) => {
  const clone = []
  blank.forEach(arr => {
    clone.push(arr.slice())
  })
  return clone
}

export default class App extends Component {
  state = {
    grid: slicer(blank),
    check: false
  }

  find_zero = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) { return { row: row, col: col } }
      }
    }
  }

  check_num = (grid, position, num) => {
    // check row
    for (let col = 0; col < 9; col++) {
      if (grid[position.row][col] === num && position.col !== col) { return false }
    }

    // check column
    for (let row = 0; row < 9; row++) {
      if (grid[row][position.col] === num && position.row !== row) { return false }
    }

    // check box, define box position at top left index
    const box_row = ~~(position.row / 3) * 3
    const box_col = ~~(position.col / 3) * 3
    for (let row = box_row; row < box_row + 3; row++) {
      for (let col = box_col; col < box_col + 3; col++) {
        if (grid[row][col] === num && `${row}${col}` !== `${position.row}${position.col}`) { return false }
      }
    }

    return true
  }

  solve = (grid) => {
    const position = this.find_zero(grid)
    if (!position) { return true }

    for (let num = 1; num < 10; num++) {
      if (this.check_num(grid, position, num)) {
        grid[position.row][position.col] = num
        if (this.solve(grid)) { return true } // checks to see if the new grid works
        grid[position.row][position.col] = 0 // if not, revert back to a version that does work
      }
    }

    return false
  }

  play = (grid, difficulty) => {
    // randomize a completed grid
    const num = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = 0; i < 9; i++) {
      const ran = Math.floor(Math.random() * num.length)
      grid[0][i] = num[ran]
      num.splice(ran, 1)
    }
    this.solve(grid)

    // easy 42 missing cells, medium 48, hard 54, extreme 60
    const cells = []
    while (cells.length !== difficulty) {
      const ran_y = Math.floor(Math.random() * 9)
      const ran_x = Math.floor(Math.random() * 9)
      const exist = cells.find(find => JSON.stringify(find) === JSON.stringify([ran_y, ran_x]))
      if (!exist) {
        cells.push([ran_y, ran_x])
      }
    }

    cells.forEach(cell => {
      grid[cell[0]][cell[1]] = 0
    })
  }

  click = (e) => {
    // popup confimation modal below
    // if (this.empty(this.state.grid)) {

    // }
    let clone = slicer(blank)
    switch (e.target.value) {
      case "solve":
        clone = this.state.grid
        this.solve(clone)
        this.setState({ grid: clone })
        break
      case "easy":
        this.play(clone, 42)
        this.setState({ grid: clone })
        break
      case "medium":
        this.play(clone, 48)
        this.setState({ grid: clone })
        break
      case "hard":
        this.play(clone, 54)
        this.setState({ grid: clone })
        break
      case "extreme":
        this.play(clone, 60)
        this.setState({ grid: clone })
        break
      default:
        console.log("something was clicked")
    }
  }

  change = (e) => {
    const pos = e.target.id.split("_")
    const row = pos[1]
    const col = pos[3]
    const clone = this.state.grid
    clone[row][col] = Number(e.target.value)
    this.setState({ grid: clone })
  }

  render() {
    return (
      <div className="app">
        <div className="app__background" />
        <h1 className="app__title">SUDOKU</h1>

        <div className="line">
          <div className="line__row line__row--one" />
          <div className="line__row line__row--two" />
          <div className="line__col line__col--one" />
          <div className="line__col line__col--two" />
        </div>

        <div className="grid">
          {this.state.grid.map((row, ri) => {
            return (
              <div key={`row${ri}`} className="grid__row">
                {row.map((num, ci) => {
                  return (
                    <input
                      key={`${num}${ci}`}
                      className="grid__num"
                      id={`row_${ri}_col_${ci}`}
                      name={`row_${ri}_col_${ci}`}
                      type="number"
                      value={this.state.grid[ri][ci] === 0 ? "" : this.state.grid[ri][ci]}
                      onChange={this.change}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="btns">
          <div className="btns__cont">
            <button className="btns__btn" onClick={this.click} value="easy">EASY</button>
            <button className="btns__btn" onClick={this.click} value="medium">MEDIUM</button>
            <button className="btns__btn" onClick={this.click} value="hard">HARD</button>
            <button className="btns__btn" onClick={this.click} value="extreme">EXTREME</button>
          </div>
          <button className="btns__btn" onClick={this.click} value="solve">SOLVE</button>
        </div>

        <div className="links">
          <a className="links__link" href="https://github.com/JayTLH/sudoku" target="_blank" rel="noopener noreferrer">
            <img className="links__icon" src={github} alt="github" />
          </a>
        </div>
      </div>
    )
  }
}
