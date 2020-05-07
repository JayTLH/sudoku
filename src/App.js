import React, { Component } from 'react'
import './App.scss'

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

export default class App extends Component {
  state = {
    grid: blank
  }

  // returns the position of any zeroes
  empty = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col]
        }
      }
    }

    return false
  }

  // checking if number in position is valid
  valid = (grid, num, pos) => {
    const row = pos[0]
    const col = pos[1]

    // check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num && col !== i) {
        return false
      }
    }

    // check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num && row !== i) {
        return false
      }
    }

    // check box
    // defines box position (top left index)
    const box_y = Math.floor(row / 3) * 3
    const box_x = Math.floor(col / 3) * 3
    for (let y = box_y; y < box_y + 3; y++) {
      for (let x = box_x; x < box_x + 3; x++) {
        if (grid[y][x] === num && [y, x] !== pos) {
          return false
        }
      }
    }

    return true
  }

  solve = (grid) => {
    const find = this.empty(grid)
    let row
    let col
    if (!find) {
      return true
    } else {
      row = find[0]
      col = find[1]
    }

    for (let i = 1; i < 10; i++) {
      if (this.valid(grid, i, [row, col])) {
        grid[row][col] = i
        // checks to see if the new grid works
        if (this.solve(grid)) {
          return true
        }
        // if not, revert back to a version that does work
        grid[row][col] = 0
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
    console.log(cells.sort())

    cells.forEach(cell => {
      grid[cell[0]][cell[1]] = 0
    })
  }

  click = (e) => {
    let clone = blank.slice()
    switch (e.target.value) {
      case "solve":
        clone = this.state.grid.slice()
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
    const clone = this.state.grid.slice()
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
      </div>
    )
  }
}
