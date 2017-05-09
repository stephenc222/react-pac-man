import React, { Component } from 'react';
import Maze from './Maze'
import HUD from './HUD'
import './index.css';
import Pathfinder from './Pathfinder'

const MAZE_WIDTH = 20
const MAZE_HEIGHT = 11

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

class App extends Component {
  constructor (props) {
    super(props)

    this.playGame = this.playGame.bind(this)
    this.timer = this.timer.bind(this)
    this.drawGhost = this.drawGhost.bind(this)
    this.getTileType = this.getTileType.bind(this)
    this.createTileType = this.createTileType.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.movePlayerUp = this.movePlayerUp.bind(this)
    this.movePlayerDown = this.movePlayerDown.bind(this)
    this.movePlayerLeft = this.movePlayerLeft.bind(this)
    this.movePlayerRight = this.movePlayerRight.bind(this)
    this.redraw = this.redraw.bind(this)
    this.draw = this.draw.bind(this)

    this.state = {
      // gameState: 'START',
      gameState: 'PLAY',
      player: {
        x: 1,
        y: 5,
        // direction: 'right',
        direction: 'left',
        score: 0,
        lives: 3,
        invincible: false
      },
      ghost: {
        x: 1,
        y: 2,
        canHurtPlayer: true
      },
      time: 250,
      interval: '',
      biscuits: [],
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
    // this.setState({gameState:'PLAY'})
    this.draw()
  }

  componentDidMount () {
    this.game.focus()
    const interval = setInterval(this.timer, 1000)
    this.setState({interval})
  }

  componentWillUnmount () {
    clearInterval(this.state.interval);
  }

  timer () {
    const time = this.state.time
    const gameState = this.state.gameState
    if (gameState === 'START') {
      return
    }
    if (!time) {
      console.log('time\'s up!')
      clearInterval(this.state.interval)
      this.setState({gameState: 'GAMEOVER'})
      return
    }
    this.setState({ time: this.state.time - 1});
  }

  createTileType (x,y) {

    const maze = this.state.maze.slice()
    const player = {...this.state.player}
    const bigBiscuits = this.state.bigBiscuits.slice()
    const chipToTileId = chip => {    
      if (chip === 'x') {      
        return 'wall'    
      } else if (x === player.x && y === player.y){      
        return 'player'    
      } else if (bigBiscuits.some((elem) => {return (x === elem.x && y === elem.y)})) {      
        return 'biscuit--big'    
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

  getTileType (x,y) {

    const maze = this.state.maze.slice()
    const player = {...this.state.player}
    const bigBiscuits = this.state.bigBiscuits.slice()
    const biscuits = this.state.biscuits.slice()
    const chipToTileId = chip => {    
      if (chip === 'x') {      
        return 'wall'    
      } else if (x === player.x && y === player.y){      
        return 'player'    
      } else if (bigBiscuits.some((elem) => {return (x === elem.x && y === elem.y && !elem.collected)})) {      
        return 'biscuit--big'    
      } else if (biscuits.some((elem) => {return (x === elem.x && y === elem.y && !elem.collected)})) {
        return 'biscuit'
      } else {
        return null
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

  drawGhost (x,y) {

    const ghost = {...this.state.ghost}

    if ( x === ghost.x && y === ghost.y) {
      return true
    } else {
      return false
    }
    
  }


  redraw () {
    const mazeContent = []
    const biscuits = []
    const bigBiscuits = []

    let x = 0
    let y = 0

    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        let tile = {x,y, type: this.getTileType(x,y), ghostHere: this.drawGhost(x,y)}
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        tile.type === 'biscuit--big' && bigBiscuits.push(tile)
        ++x
      }
      ++y
    }

    this.setState({mazeContent, biscuits, bigBiscuits})
  }

  draw () {
    const mazeContent = []
    const biscuits = []
    const maze = this.state.maze.slice()

    let x = 0
    let y = 0

    let index = 0

    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        // let tile = {x,y, type: this.createTileType(x,y)}
        let tile = {x,y, type: this.createTileType(x,y), ghostHere: this.drawGhost(x,y), index: index++}        
        // tile.type !== 'wall' && (tile.index = index++)
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        ++x
      }
      ++y
    }

    let tempArr = []
    // console.log(maze)

    for (let row in maze) {
      tempArr = tempArr.concat(maze[row].split(''))
    }

    console.log(tempArr)

    // const obstacles = ['X']
    const obstacles = ['x']

    // create the path finder object
    const finder = new Pathfinder(20, 11, tempArr, obstacles)
    // console.log(finder)

    // searchPath will contain a list of index values which follow the path found
    // or an empty list if no path can be found
    const searchPath = finder.findPath(61, 116)
    console.log(searchPath)

    this.setState({mazeContent, biscuits})
  }
  movePlayerUp () {
    const player = {...this.state.player}
    player.y--
    player.direction = 'up'
    const result = this.getTileType(player.x,player.y)  
    result === 'wall' && player.y++
    result === 'biscuit' && player.score++
    result === 'biscuit--big' && (player.score += 10)
    this.setState({player},this.redraw)
  }

  movePlayerDown () {
    const player = {...this.state.player}
    player.y++
    player.direction = 'down'    
    const result = this.getTileType(player.x,player.y)  
    result === 'wall' && player.y--
    result === 'biscuit' && player.score++
    result === 'biscuit--big' && (player.score += 10)
    this.setState({player},this.redraw)
  }

  movePlayerLeft () {
    const player = {...this.state.player}
    player.x--
    player.direction = 'left'    
    const result = this.getTileType(player.x,player.y)  
    result === 'wall' && player.x++
    result === 'biscuit' && player.score++
    result === 'biscuit--big' && (player.score += 10)
    this.setState({player},this.redraw)
  }

  movePlayerRight () {
    const player = {...this.state.player}
    player.x++
    player.direction = 'right'    
    const result = this.getTileType(player.x,player.y)  
    result === 'wall' && player.x--
    result === 'biscuit' && player.score++
    result === 'biscuit--big' && (player.score += 10)
    this.setState({player},this.redraw)
  }

  reloadGame () {
    window.location.reload()
  }

  playGame () {
    this.setState({gameState: 'PLAY'})
  }

  renderGameState (gameState) {

    if (gameState === 'START') {
      return (
        <div className={'game-screen'} onClick={this.playGame}>
          START GAME
          <p className="text">Click to play!</p>
        </div>
      )
    } else if (gameState === 'PLAY') {
      return (
        <Maze
          mazeContent={this.state.mazeContent}
          player={this.state.player}
        />
      )
    } else if (gameState === 'GAMEOVER') {
      return (
        <div className={'game-screen'} onClick={this.reloadGame}>
          GAME OVER
          <p className="text">Click to play again!</p>
        </div>
      )
    }
  }


  render() {
    return (
      <div 
        className="game-container" 
        tabIndex={0}
        onKeyDown={this.onKeyDown}
        ref={(element) => {this.game = element}}>
        <div className={`game-title`}>REACT PAC-MAN</div>
        <div className="hud-container">
          <HUD
            player={this.state.player}
            time={this.state.time}
          />
        </div>
        {this.renderGameState(this.state.gameState)}
      </div>
    );
  }
}

export default App;
