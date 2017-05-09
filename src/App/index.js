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

    this.startGame = this.startGame.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.timer = this.timer.bind(this)
    this.drawPlayer = this.drawPlayer.bind(this)
    // this.moveGhost = this.moveGhost.bind(this)
    this.drawGhost = this.drawGhost.bind(this)
    this.getTileType = this.getTileType.bind(this)
    this.createTileType = this.createTileType.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
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
        // x: 1,
        // y: 2,
        index: 81,
        canHurtPlayer: true,
        pathPos: 0,
        paths: [
          {start:81, end: 181}, // level 0
          {start:81, end: 161}, // level 1
          {start:81, end: 161}, // level 2
        ],
        path: [],
      },
      time: 250,
      timerInterval: '',
      isKeyDown: false,
      drawPlayerInterval: '',
      moveGhostInterval: '',
      biscuits: [],
      bigBiscuits: [
        { x: 1,  y:1 }, 
        { x: 18, y:1 }, 
        { x: 1,  y:9 }, 
        { x: 18, y:9 }, 
      ],
      level: 0,
      maze: [
        [
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
        ],
        [
          'xxxxxxxxxxxxxxxxxxxx',    
          'x   x              x',    
          'x x xxxxxx  xxx  x x',    
          'x        x       x x',    
          'xxxxx x        xxx x',    
          'x      xxxxxxxx    x',    
          'x xxx      xxx   x x',    
          'x x    x x x     x x',    
          'x x xxxx x xxxxx x x',    
          'x      x           x',    
          'xxxxxxxxxxxxxxxxxxxx',  
        ],
        [
          'xxxxxxxxxxxxxxxxxxxx',    
          'x        xx        x',    
          'x x xx x     xxxxxxx',    
          'x x       x        x',    
          'x x  x x  xxxxx   xx',    
          'x    x xx      x   x',    
          'x xxxx     xxx xxx x',    
          'x       xx       x x',    
          'x x xxx    xxxxx x x',    
          'x       xxxx       x',    
          'xxxxxxxxxxxxxxxxxxxx',  
        ]
      ]
    }
  }

  componentWillMount () {
    // this.setState({gameState:'PLAY'})
    this.draw()
  }

  componentDidMount () {
    this.game.focus()
    const timerInterval = setInterval(this.timer, 1000)
    const drawPlayerInterval = setInterval(this.drawPlayer, 500)
    // const moveGhostInterval = setInterval(this.moveGhost, 500)
    // this.setState({timerInterval, drawPlayerInterval, moveGhostInterval})
    this.setState({timerInterval, drawPlayerInterval})
  }

  drawPlayer () {
    const player = {...this.state.player}
    player.direction === 'right' && this.movePlayerRight()
    player.direction === 'left' && this.movePlayerLeft()
    player.direction === 'up' && this.movePlayerUp()
    player.direction === 'down' && this.movePlayerDown()
    
  }

  // moveGhost () {
  //   const ghost = {...this.state.ghost}
  //   const level = this.state.level
  //   if (ghost.pathPos < ghost.path.length - 1) {
  //     // ghost.x = ghost.path[level][ghost.pathPos].x
  //     // ghost.y = ghost.path[level][ghost.pathPos].y
  //     let ghostTile = ghost.path[level][ghost.pathPos]
  //     console.log(JSON.stringify(ghost.path[level][ghost.pathPos],null,2))            
  //     ghost.x = ghostTile.x
  //     ghost.x = ghostTile.y
  //     ghost.pathPos++
  //   } else {
  //     ghost.pathPos = 0
  //     ghost.path[level].reverse()
  //     // console.log(JSON.stringify(ghost.path[level],null,2))       
  //     // debugger   
  //   }
  //   this.setState({ghost})
    
  // }

  componentWillUnmount () {
    clearInterval(this.state.timerInterval);
    clearInterval(this.state.drawPlayerInterval);
    // clearInterval(this.state.moveGhostInterval);
  }

  timer () {
    const time = this.state.time
    const gameState = this.state.gameState
    if (gameState === 'START' || gameState === 'NEXTLEVEL') {
      this.setState({time: 250})
      return
    }
    if (!time) {
      console.log('time\'s up!')
      clearInterval(this.state.timerInterval)
      this.setState({gameState: 'GAMEOVER'})
      return
    }
    this.setState({ time: this.state.time - 1});
  }

  createTileType (x,y) {
    const level = this.state.level
    const maze = this.state.maze[level].slice()
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
    const level = this.state.level
    const maze = this.state.maze[level].slice()
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
    const isKeyDown = this.state.isKeyDown
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

    if (isKeyDown) {
      return
    }

    if (keyCode === KEY.UP) {
      movePlayerUp()
    } else if (keyCode === KEY.DOWN) {
      movePlayerDown()
    } else if (keyCode === KEY.LEFT) {
      movePlayerLeft()
    } else if (keyCode === KEY.RIGHT) {
      movePlayerRight()
    }

    this.setState((prevState) => {
      const isKeyDown = true
      return {isKeyDown}
    })
  }

  onKeyUp (event) {
    this.setState({isKeyDown: false})
  }

  drawGhost (ghost,x,y, index) {
    // console.log(index)
    // console.log(ghost.path)
    // if ( x === ghost.x && y === ghost.y) {
    if (index === ghost.index) {
      // ghost.pathPos++
      // this.setState({ghost})
      return true
    } else {
      return false
    }
    
  }

  redraw () {
    const mazeContent = []
    const biscuits = []
    const bigBiscuits = []
    const ghost = {...this.state.ghost}
    // const level = this.state.level

    // TODO: Here - logic for controlling next x and y
    // ghost.x = ghost.path[0][0].x
    // ghost.y = ghost.path[0][0].y++
    // for (let index in ghost.path) {
    //   // console.log(index)
    //   // console.log(ghost.path)
    // }
    // console.log(ghost.path)
    // console.log(ghost.pathPos)
    if (ghost.pathPos < ghost.path.length - 1) {
      // console.log(ghost.path)
      ghost.index = ghost.path[ghost.pathPos]
      ghost.pathPos++
    } else {
      ghost.pathPos = 0
      ghost.path.reverse()
    }

  

    let x = 0
    let y = 0
    let index = 0
    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        // let tile = {x,y, type: this.getTileType(x,y), ghostHere: this.drawGhost( x,y, ghost index), index: index++}
        let tile = {x,y, type: this.getTileType(x,y), ghostHere: this.drawGhost(ghost, x,y,index), index: index++}
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        tile.type === 'biscuit--big' && bigBiscuits.push(tile)
        ++x
      }
      ++y
    }
    this.setState({mazeContent, biscuits, bigBiscuits, ghost})
  }

  draw () {
    const mazeContent = []
    const biscuits = []
    const level = this.state.level
    const maze = this.state.maze[level].slice()
    const ghost = {...this.state.ghost}

    let x = 0
    let y = 0

    let index = 0

    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        // let tile = {x,y, type: this.createTileType(x,y)}
        let tile = {x,y, type: this.createTileType(x,y), ghostHere: this.drawGhost(ghost, x,y, index), index: index++}        
        // tile.type !== 'wall' && (tile.index = index++)
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        ++x
      }
      ++y
    }

    let maze1D = []
    // console.log(maze)

    for (let row in maze) {
      maze1D = maze1D.concat(maze[row].split(''))
    }

    // console.log(maze1D)

    // const obstacles = ['X']
    const obstacles = ['x']

    // create the path finder object
    const finder = new Pathfinder(20, 11, maze1D, obstacles)
    // console.log(finder)

    // searchPath will contain a list of index values which follow the path found
    // or an empty list if no path can be found
    // const searchPath = finder.findPath(61, 116)
    // console.log(searchPath)

    ghost.path = finder.findPath(ghost.paths[level].start, ghost.paths[level].end)

    // console.log(ghost.path)
    this.setState({mazeContent, biscuits, ghost})
  }
  movePlayerUp () {
    const player = {...this.state.player}
    const level = this.state.level
    player.y--
    player.direction = 'up'
    const result = this.getTileType(player.x,player.y)  
    result === 'wall' && player.y++
    result === 'biscuit' && player.score++
    result === 'biscuit--big' && (player.score += 10)

    if (player.score > 5 && level !== 1) {
      this.setState({gameState:'NEXTLEVEL'})
      return
    }
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

  startGame () {
    this.setState({gameState: 'PLAY'})
  }

  nextLevel () {
    let level = this.state.level
    // TODO: change how next level is set
    // so player can keep score, or not
    const player = {...this.state.player}
    player.index = 81
    player.score = 0
    console.log('level:' ,level)
    console.log('level++:' ,++level)
    this.setState({player,gameState: 'PLAY', level})
  }

  renderGameState (gameState) {

    if (gameState === 'START') {
      return (
        <div className={'game-screen'} onClick={this.startGame}>
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
    } else if (gameState === 'NEXTLEVEL' && this.state.level < 3) {
      return (
        <div className={'game-screen'} onClick={this.nextLevel}>
          {`Level ${this.state.level + 1} Complete!`}
          <p className="text">{`Click to play level ${this.state.level + 2}`}</p>
        </div>
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
        onKeyUp={this.onKeyUp}
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
