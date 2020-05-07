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

    // easy 45 cells, medium 50, hard 60, extreme 65
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
      grid[cell[0]][cell[1]] = ""
    })
  }

  click = (e) => {
    switch (e.target.value) {
      case "solve":
        this.solve(this.state.grid)
        this.setState({ grid: this.state.grid })
        break
      case "easy":
        this.setState({ grid: blank }, () => {
          this.play(this.state.grid, 45)
          this.setState({ grid: this.state.grid })
        })
        break
      case "medium":
        this.play(this.state.grid, 50)
        this.setState({ grid: this.state.grid })
        break
      case "hard":
        this.play(this.state.grid, 55)
        this.setState({ grid: this.state.grid })
        break
      case "extreme":
        this.play(this.state.grid, 60)
        this.setState({ grid: this.state.grid })
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
        {this.state.grid.map((row, ri) => {
          return (
            <div key={`row${ri}`} className="app__row">
              {row.map((num, ci) => {
                return (
                  <input
                    key={`${num}${ci}`}
                    className="app__num"
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
        <div className="app__play-btns">
          <button className="app__btn" onClick={this.click} value="easy">EASY</button>
          <button className="app__btn" onClick={this.click} value="medium">MEDIUM</button>
          <button className="app__btn" onClick={this.click} value="hard">HARD</button>
          <button className="app__btn" onClick={this.click} value="extreme">EXTREME</button>
        </div>
        <button className="app__btn" onClick={this.click} value="solve">SOLVE</button>
      </div>
    )
  }
}
