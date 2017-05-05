import React, { Component } from 'react'
import './index.css'

class HUD extends Component {
  render () {
    const player = this.props.player  
    const time = this.props.time
    return (
      <div className="hud-data">
        <div className="score-and-lives">
          <div className="score">{`SCORE: ${player.score}`}</div>
          <div className="lives">{`LIVES: ${player.lives}`}</div>
        </div>
        <div className="time">{`TIME LEFT: ${time} SECONDS`}</div>
      </div>
    )
  }
}

export default HUD