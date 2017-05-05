import React, { Component } from 'react';
import Maze from './Maze'
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

    this.state = {
      player: {
        x: 1,
        y: 5,
        invincible: false
      },

      bigBiscuits: [
        { x: 1,  y:1 }, 
        { x: 18, y:1 }, 
        { x: 1,  y:9 }, 
        { x: 18, y:9 }, 
      ],
      maze: [
      'xxxxxxxxxxxxxxxxxxxx',    
      'x         x        x',    
      'x x xxxxx x  xxx x x',    
      'x x     x xx     x x',    
      'x xxx x x  xxx xxx x',    
      'x     x x      x   x',    
      'x xxx x x  xxx xxx x',    
      'x x     xx x     x x',    
      'x x xxx  x xxxxx x x',    
      'x                  x',    
      'xxxxxxxxxxxxxxxxxxxx',  
      ]
    }
  }

  componentWillMount () {
    this.redraw()
  }


  componentDidMount () {
    this.game.focus()
  }


  getTileType (x,y) {

    const maze = this.state.maze.slice()
    const player = {...this.state.player}
    const bigBiscuits = this.state.bigBiscuits.slice()
    const chipToTileId = chip => {    
      if (chip === 'x') {      
        return 'wall'    
        // if ( bigBiscuits.some( (elem) => { return (elem.x === elem.y ) })) {  'yes' } else { 'no'}
// "yes"
        // if ( x.some( (elem) => { return (elem === 'b') })) {  'yes' } else { 'no'}
      // } else if (chip === 'O') {      

      // } else if (x === bigBiscuits[0].x && y === bigBiscuits[0].y) {      
      } else if (bigBiscuits.some((elem) => {return (x === elem.x && y === elem.y)})) {      
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
    const result = this.getTileType(player.x,player.y)
    console.log('player moved into: ', result)
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerDown () {
    console.log('move down!')
    const player = {...this.state.player}
    player.y++
    const result = this.getTileType(player.x,player.y)
    console.log('player moved into: ', result)
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerLeft () {
    console.log('move left!')
    const player = {...this.state.player}
    player.x--
    const result = this.getTileType(player.x,player.y)
    console.log('player moved into: ', result)
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }

  movePlayerRight () {
    console.log('move right!')
    const player = {...this.state.player}
    player.x++
    const result = this.getTileType(player.x,player.y)
    console.log('player moved into: ', result)
    console.log(JSON.stringify(player,null,2))
    this.setState({player},this.redraw)
  }


  render() {
    return (
      <div 
        className="game-container" 
        tabIndex={0}
        onKeyDown={this.onKeyDown}
        ref={(element) => {this.game = element}}>
        <Maze
          mazeContent={this.state.mazeContent}
        />
      </div>
    );
  }
}

export default App;
