import React, { Component } from 'react'
import './index.css'

class TouchControl extends Component {
  render () {
    return (
      <div className="touchControl-container">
        <div className="touch-up" onTouchStart={this.props.movePlayerUp}>
          <div className="up-arrow"></div>
        </div>
        <div className="left-and-right">
          <div className="touch-left" onTouchStart={this.props.movePlayerLeft}>
            <div className="left-arrow"></div>
          </div>
          <div className="middle-piece"></div>
          <div className="touch-right" onTouchStart={this.props.movePlayerRight}>
            <div className="right-arrow"></div>
          </div>
        </div>
        <div className="touch-down" onTouchStart={this.props.movePlayerDown}>
          <div className="down-arrow"></div>
        </div>
      </div>
    )
  }
}

export default TouchControl