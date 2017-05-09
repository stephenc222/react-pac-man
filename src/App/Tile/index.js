import React, { Component } from 'react'
import './index.css'

class Tile extends Component {
  render () {
    // console.log(this.props.tileObject)
    const tileObject = this.props.tileObject
    const player = this.props.player

    if (tileObject.ghostHere) {
      return (
        <div className="tile-container">
          <div className="no-flex">
            <div className="ghost blinky">
              <div className="eyes">
                <div className="eye_lt">
                  <div className="ball"></div>
                </div>
                <div className="eye_rt">
                  <div className="ball"></div>
                </div>
              </div>

              <div className="bottom">
                <div className="frill"></div>
                <div className="frill"></div>
                <div className="frill"></div>
              </div>
            </div>
          </div>
          {tileObject.index}
        </div>
      )
    }
    if (tileObject.type === 'player') {
      // console.log(this.props.player)
      return (
        <div className="tile-container">
          <div className={tileObject.type + `--move-${player.direction}`}>{tileObject.index}
          </div>
        </div>
      )
    }
    return (
      <div className="tile-container">
        <div className={tileObject.type}>{tileObject.index}</div>
      </div>
    )
  }
}

export default Tile