import React, { Component } from 'react'
import './index.css'

class Tile extends Component {
  render () {
    // console.log(this.props.tileObject)
    const tileObject = this.props.tileObject
    if (tileObject.type === 'player') {
      return (
        <div className="tile-container">
          <div className={tileObject.type + '--move-down'}>
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