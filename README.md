# Sudoku
DEMO https://sudoku-jay.netlify.app/

This app is a simple sudoku game with four difficulties. At any time, the `SOLVE` button can be pressed and will provide a solution to the current grid state if possible.

To start the app run `npm install` then `npm start`

## Backtracking Algorithm
To efficiently solve the grid, a recursive function is used to detect any errors and will revert the solution to a previous state before attempting another iteration.