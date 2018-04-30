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
      {mazeRow.map((column, index) => renderMazeColumn(column, player, index))}
    </div>
  )
}

const Maze = (props) => {

  return (
    <div className={`maze-container`}>
      {props.mazeContent.map((mazeRow, index) => renderMazeRow(mazeRow, props.player, index))}
    </div>
  )
}

export default Maze