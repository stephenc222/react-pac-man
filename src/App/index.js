import React, { Component } from 'react';
import Maze from './Maze'
// import Player from './Player'
import './index.css';

const MAZE_WIDTH = 20
const MAZE_Height = 10
class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      player: {
        x: 1,
        y: 1,
        invincible: false
      }
    }
  }

  componentWillMount () {
    const mazeContent = []

    let x = 0
    let y = 0

    while (mazeContent.length < MAZE_Height) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        mazeContent[y].push({
          'x':x, 
          'y':y, 
          // player:false, 
          type: this.getTileType(x,y)
          // wall:(x === 0 || y === 0 || y === 29) ? true: false,
          // biscuit: !(x === 0 || y === 0 || y === 29) ? true: false
        })
        ++x
      }
      ++y
    }

    this.setState({mazeContent})
  }


  getTileType (x,y) {
    const chipToTileId = chip => {    
      if (chip === 'x') {      
        return 'wall'    
      } else if (chip === 'O') {      
        return 'biscuit--big'    
      } else {      
        return 'biscuit'    
      }  
    }

    return [    
      'xxxxxxxxxxxxxxxxxxxx'.split('').map(chipToTileId),    
      'xO        x       Ox'.split('').map(chipToTileId),    
      'x x xxxxx x  xxx x x'.split('').map(chipToTileId),    
      'x x     x xx     x x'.split('').map(chipToTileId),    
      'x xxx x x  xxx xxx x'.split('').map(chipToTileId),    
      'x     x x      x   x'.split('').map(chipToTileId),    
      'x xxx x x  xxx xxx x'.split('').map(chipToTileId),    
      'x x     xx x     x x'.split('').map(chipToTileId),    
      'x x xxx  x xxxxx x x'.split('').map(chipToTileId),    
      'xO                Ox'.split('').map(chipToTileId),    
      'xxxxxxxxxxxxxxxxxxxx'.split('').map(chipToTileId),  
    ][y][x]
  }

  //   if (x === 0 || y === 0 || y === 29 || x === 29) {
  //     return 'wall'
  //   } else if (
  //     (x === 1 && y === 28)
  //     || (x === 28 && y === 1) 
  //     || (x === 28 && y === 28)) {
  //     // || (x === 1  && y === 1)){
  //     return 'biscuit--big'
  //   } else if(x === 1 && y === 1) {
  //     return 'player'
  //   } else {
  //     return 'biscuit'
  //   }
  // }
  render() {
    return (
      <div className="game-container">
        <Maze
          mazeContent={this.state.mazeContent}
        />
      </div>
    );
  }
}

export default App;
