import React, { Component } from 'react'
import './App.scss'

const dummy = [
  [4, 0, 8, 0, 7, 0, 0, 5, 2],
  [0, 0, 0, 9, 0, 0, 1, 0, 7],
  [0, 0, 6, 0, 0, 0, 8, 0, 0],
  [0, 0, 0, 0, 5, 0, 0, 0, 6],
  [5, 0, 4, 0, 0, 0, 0, 0, 8],
  [0, 8, 0, 2, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [9, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 2, 1, 3, 0, 5, 9, 0, 0]
]

export default class App extends Component {
  state = {
    // grid: dummy
    grid: [
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
  }

  empty = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 0) {
          // returns the position of any zeroes
          return [row, col]
        }
      }
    }

    return false
  }

  valid = (grid, num, pos) => {
    const row = pos[0]
    const col = pos[1]

    // check row
    for (let i = 0; i < grid[0].length; i++) {
      if (grid[row][i] === num && col !== i) {
        return false
      }
    }

    // check column
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][col] === num && row !== i) {
        return false
      }
    }

    // check box
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
        if (this.solve(grid)) {
          return true
        }
        grid[row][col] = 0
      }
    }

    return false
  }

  click = (e) => {
    this.solve(this.state.grid)
    this.setState({grid: this.state.grid})
  }

  render() {
    return (
      // <div className="app">
      //   {this.state.grid.map((row, ri) => {
      //     return (
      //       <div key={`row${ri}`} style={{ display: "flex" }}>
      //         {row.map((num, ni) => {
      //           return (
      //             <div key={`${num}${ni}`} style={num !== 0 ? { marginRight: "14px" } : { marginRight: "14px", opacity: 0.4 }}>
      //               {num}
      //             </div>
      //           )
      //         })}
      //       </div>
      //     )
      //   })}
      //   <button onClick={this.click}>solve</button>
      // </div>

      <div className="app">
        {this.state.grid.map((row, ri) => {
          return (
            <div key={`row${ri}`} style={{ display: "flex" }}>
              {row.map((num, ni) => {
                return (
                  <div key={`${num}${ni}`} style={num !== 0 ? { marginRight: "14px" } : { marginRight: "14px", opacity: 0.4 }}>
                    {num}
                  </div>
                )
              })}
            </div>
          )
        })}
        <button onClick={this.click}>solve</button>
      </div>
    )
  }
}
