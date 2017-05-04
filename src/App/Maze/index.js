import React, { Component } from 'react'
import Tile from '../Tile'
import './index.css'

class Maze extends Component {
  constructor(props) {
    super(props)
    this.renderMazeRow = this.renderMazeRow.bind(this)
    this.renderMazeColumn = this.renderMazeColumn.bind(this)
  }

  renderMazeRow (mazeRow, index) {
    return (
      <div key={index} className={`row-container`}>
        {mazeRow.map(this.renderMazeColumn)}
      </div>
    )
  }

  renderMazeColumn (mazeColumnObject, index) {
    // console.log(mazeColumnObject)
    return (
      <div key={index} className="column-container">
        <Tile tileObject={mazeColumnObject}/>
      </div>
    )
  }
  render () {
    return (
      <div className={`Maze`}>
        {this.props.mazeContent.map(this.renderMazeRow)}
      </div>
    )
  }
}

export default Maze