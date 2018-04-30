import React from 'react'
import Tile from '../Tile'
import './index.css'

const renderMazeColumn = (mazeColumnObject, player, index) => {
  return (
    <div key={index} className="column-container">
      <Tile player={player} tileObject={mazeColumnObject}/>
    </div>
  )
}

const renderMazeRow = (mazeRow, player, index) => {
  return (
    <div key={index} className={`row-container`}>
      {mazeRow.map((column) => renderMazeColumn(column, player))}
    </div>
  )
}

const Maze = (props) => {

  return (
    <div className={`maze-container`}>
      {props.mazeContent.map((mazeRow) => renderMazeRow(mazeRow, props.player))}
    </div>
  )
}

export default Maze