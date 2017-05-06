import React, { Component } from 'react'
import './index.css'

class Tile extends Component {
  render () {
    // console.log(this.props.tileObject)
    const tileObject = this.props.tileObject
    const player = this.props.player
    if (tileObject.type === 'player') {
      // console.log(this.props.player)
      return (
        <div className="tile-container">
          <div className={tileObject.type + `--move-${player.direction}`}>
          </div>
        </div>
      )
    }
    return (
      <div className="tile-container">
        <div className={tileObject.type}></div>
      </div>
    )
  }
}

export default Tile