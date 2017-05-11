import React, { Component } from 'react'
import './index.css'

class TouchControl extends Component {
  render () {
    return (
      <div className="touchControl-container">
        <div className="touch-up" onTouchStart={this.props.movePlayerUp}>UP</div>
        <div className="left-and-right">
          <div className="touch-left" onTouchStart={this.props.movePlayerLeft}>LEFT</div>
          <div className="touch-right" onTouchStart={this.props.movePlayerRight}>RIGHT</div>
        </div>
        <div className="touch-down" onTouchStart={this.props.movePlayerDown}>DOWN</div>
      </div>
    )
  }
}

export default TouchControl