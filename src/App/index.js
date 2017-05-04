import React, { Component } from 'react';
import Maze from './Maze'
// import Player from './Player'
import './index.css';

const MAZE_WIDTH = 20
const MAZE_Height = 11

const KEY = {
  // END: 35,
  // HOME: 36,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  // BACKSPACE: 8,
  // DELETE: 46,
  // ENTER: 13
}

// const CURSOR_KEYS = [
//   KEY.UP,
//   KEY.DOWN,
//   KEY.LEFT,
//   KEY.RIGHT
// ]
class App extends Component {
  constructor (props) {
    super(props)

    this.getTileType = this.getTileType.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.movePlayerUp = this.movePlayerUp.bind(this)
    this.movePlayerDown = this.movePlayerDown.bind(this)
    this.movePlayerLeft = this.movePlayerLeft.bind(this)
    this.movePlayerRight = this.movePlayerRight.bind(this)
    this.redraw = this.redraw.bind(this)
    // this.onKeyPress = this.onKeyPress.bind(this)

    this.state = {
      player: {
        x: 1,
        y: 5,
        invincible: false
      },
      maze: [
      'xxxxxxxxxxxxxxxxxxxx',    
      'xO        x       Ox',    
      'x x xxxxx x  xxx x x',    
      'x x     x xx     x x',    
      'x xxx x x  xxx xxx x',    
      'x     x x      x   x',    
      'x xxx x x  xxx xxx x',    
      'x x     xx x     x x',    
      'x x xxx  x xxxxx x x',    
      'xO                Ox',    
      'xxxxxxxxxxxxxxxxxxxx',  
      ]
    }
  }

  componentWillMount () {
    // const mazeContent = []

    // let x = 0
    // let y = 0

    // while (mazeContent.length < MAZE_Height) {
    //   mazeContent[y] = []
    //   x = 0
    //   while (mazeContent[y].length < MAZE_WIDTH) {
    //     mazeContent[y].push({
    //       'x':x, 
    //       'y':y, 
    //       type: this.getTileType(x,y)
    //     })
    //     ++x
    //   }
    //   ++y
    // }

    // this.setState({mazeContent})
    this.redraw()
  }

  shouldComponentUpdate () {
    return true
  }

  componentDidMount () {
    // console.log(this.game)
    this.game.focus()
  }


  getTileType (x,y) {

    const maze = this.state.maze.slice()
    const player = {...this.state.player}
    const chipToTileId = chip => {    
      // console.log(JSON.stringify(chip,null,2))
      if (chip === 'x') {      
        return 'wall'    
      } else if (chip === 'O') {      
        return 'biscuit--big'    
      } else if (x === player.x && y === player.y){      
        return 'player'    
      } else {
        return 'biscuit'
      }
    }

    const updateMaze = []

    for (let row in maze) {
      updateMaze.push(maze[row].split('').map(chipToTileId))
    }
    
    return updateMaze[y][x]
  }

  onKeyDown (event) {
  // onKeyPress (event) {
    const {
      // altKey,
      // ctrlKey,
      // key,
      // locale,
      // location,
      // metaKey,
      // repeat,
      // which,
      //charCode,
      keyCode,
      //shiftkey
    } = event

    const movePlayerUp = this.movePlayerUp
    const movePlayerDown = this.movePlayerDown
    const movePlayerLeft = this.movePlayerLeft
    const movePlayerRight = this.movePlayerRight

    console.log('keyCode is: ', keyCode)

    if (keyCode === KEY.UP) {
      movePlayerUp()
    } else if (keyCode === KEY.DOWN) {
      movePlayerDown()
    } else if (keyCode === KEY.LEFT) {
      movePlayerLeft()
    } else if (keyCode === KEY.RIGHT) {
      movePlayerRight()
    }
    // this.redraw()      
  }

  redraw () {
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
          type: this.getTileType(x,y)
        })
        ++x
      }
      ++y
    }

    this.setState({mazeContent})
  }
  movePlayerUp () {
    console.log('move up!')
    const player = {...this.state.player}
    player.y--
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerDown () {
    console.log('move down!')
    const player = {...this.state.player}
    player.y++
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerLeft () {
    console.log('move left!')
    const player = {...this.state.player}
    player.x--
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerRight () {
    console.log('move right!')
    const player = {...this.state.player}
    player.x++
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  // onKeyPress (event) {
  //   const {
  //     // altKey,
  //     // ctrlKey,
  //     // key,
  //     // locale,
  //     // location,
  //     // metaKey,
  //     // repeat,
  //     // which,
  //     charCode,
  //     keyCode,
  //     shiftKey
  //   } = event

  // }

  render() {
    return (
      <div 
        className="game-container" 
        tabIndex={0}
        onKeyDown={this.onKeyDown}
        // onKeyPress={this.onKeyPress}
        ref={(element) => {this.game = element}}>
        <Maze
          mazeContent={this.state.mazeContent}
        />
      </div>
    );
  }
}

export default App;
