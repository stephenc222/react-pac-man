import React, { Component } from 'react';
import Maze from './Maze'
import HUD from './HUD'
import './index.css';
import Pathfinder from './Pathfinder'
import TouchControl from './TouchControl'

const MAZE_WIDTH = 20
const MAZE_HEIGHT = 11

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
}

const pascalCase = (input) => {
  const name = input.replace(/-/g, '')
  return name[0].toLocaleUpperCase() + name.substr(1,name.length)
}

class App extends Component {
  constructor (props) {
    super(props)

    this.startGame = this.startGame.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.timer = this.timer.bind(this)
    this.drawPlayer = this.drawPlayer.bind(this)
    this.drawGhost = this.drawGhost.bind(this)
    this.getGhostName = this.getGhostName.bind(this)
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
    this.playerHitGhost = this.playerHitGhost.bind(this)

    this.state = {
      gameState: 'START',
      invincibleTimer: 0,
      player: {
        x: 1,
        y: 3,
        direction: 'left',
        score: 0,
        lives: 3,
        invincible: false
      },
      Blinky: {
        index: 81,
        pathPos: 0,
        paths: [
          {start:81, end: 181}, // level 0
          {start:81, end: 161}, // level 1
          {start:81, end: 161}, // level 2
        ],
        path: [],
      },
      Pinky: {
        index: 198,
        pathPos: 0,
        paths: [
          {start:198, end: 191}, // level 0
          {start:126, end: 190}, // level 1
          {start:192, end: 118}, // level 2
        ],
        path: [],
      },
      Inky: {
        index: 38,
        pathPos: 0,
        paths: [
          {start:38, end: 74}, // level 0
          {start:32, end: 38}, // level 1
          {start:28, end: 168}, // level 2
        ],
        path: [],
      },
      Clyde: {
        index: 29,
        pathPos: 0,
        paths: [
          {start:29, end: 150}, // level 0
          {start:198, end: 194}, // level 1
          {start:75, end: 35}, // level 2
        ],
        path: [],
      },
      time: 250,
      timerInterval: '',
      isKeyDown: false,
      isHittingGhost: false,
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
      mazeContent: [],
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
    this.draw()
  }

  componentDidMount () {
    this.game.focus()
    const timerInterval = setInterval(this.timer, 1000)
    const drawPlayerInterval = setInterval(this.drawPlayer, 500)
    this.setState({timerInterval, drawPlayerInterval})
  }

  drawPlayer () {
    const player = {...this.state.player}
    player.direction === 'right' && this.movePlayerRight()
    player.direction === 'left' && this.movePlayerLeft()
    player.direction === 'up' && this.movePlayerUp()
    player.direction === 'down' && this.movePlayerDown()
    
  }

  componentWillUnmount () {
    clearInterval(this.state.timerInterval);
    clearInterval(this.state.drawPlayerInterval);
  }

  timer () {
    const time = this.state.time
    const gameState = this.state.gameState
    if (gameState === 'START' || gameState === 'NEXTLEVEL') {
      this.setState({time: 250})
      return
    }
    if (!time) {
      clearInterval(this.state.timerInterval)
      this.setState({gameState: 'GAMEOVER'})
      return
    }
    this.setState({ 
      time: this.state.time - 1, 
      invincibleTimer: 
        this.state.invincibleTimer > 0 
        ? --this.state.invincibleTimer
        : 0 
    })
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
    const mazeContent = this.state.mazeContent.slice()
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
      } else if (mazeContent[y][x].ghostHere){
        return mazeContent[y][x].ghostName
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

  playerHitGhost(player, ghostName) {
    const ghost = this.state[pascalCase(ghostName)]
    if (!player.invincible) {
      player.lives--
      this.setState({player, isHittingGhost: false})
      if (player.lives === 0) {
        return this.setState({gameState: 'GAMEOVER'})
      } 

    } else {
      player.score += 20
      ghost.path = []
      ghost.index = 300 // off map
      return this.setState({player, ghost, isHittingGhost: false})
    }
  }

  onKeyDown (event) {
    //console.log('key is down!')
    const isKeyDown = this.state.isKeyDown
    const { direction } = this.state.player
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
      direction !== 'up' && movePlayerUp()
    } else if (keyCode === KEY.DOWN) {
      direction !== 'down' && movePlayerDown()
    } else if (keyCode === KEY.LEFT) {
      direction !== 'left' && movePlayerLeft()
    } else if (keyCode === KEY.RIGHT) {
      direction !== 'right' && movePlayerRight()
    }

    this.setState((prevState) => {
      const isKeyDown = true
      return {isKeyDown}
    })
  }

  onKeyUp (event) {
    this.setState({isKeyDown: false})
  }

  drawGhost (Blinky, Pinky, Inky, Clyde,x,y, index) {
    const player = {...this.state.player}
    // if player is already hitting the ghost, don't handle that again right now
    const isHittingGhost = this.state.isHittingGhost

    if (x === player.x && y === player.y && index === Blinky.index) {
      if (!player.invincible && !isHittingGhost) {
        player.lives--
        this.setState({player})
        if (player.lives === 0) {
          this.setState({gameState: 'GAMEOVER'})
          return false       
        } 

      } else if (!isHittingGhost) {
        player.score += 20
        Blinky.path = []
        Blinky.index = 300
        this.setState({player, Blinky})
        return false
      }
    }
    if (x === player.x && y === player.y && index === Pinky.index) {
      if (!player.invincible && !isHittingGhost) {
        player.lives--
        this.setState({player})
        if (player.lives === 0) {
          this.setState({gameState: 'GAMEOVER'})
          return false       
        } 

      } else if (!isHittingGhost) {
        player.score += 20
        Pinky.path = []
        Pinky.index = 300
        this.setState({player, Pinky})
        return false
      }
    }
    if (x === player.x && y === player.y && index === Inky.index) {
      if (!player.invincible && !isHittingGhost) {
        player.lives--
        this.setState({player})
        if (player.lives === 0) {
          this.setState({gameState: 'GAMEOVER'})
          return false       
        } 

      } else if (!isHittingGhost) {
        player.score += 20
        Inky.path = []
        Inky.index = 300
        this.setState({player, Inky})
        return false
      }
    }
    if (x === player.x && y === player.y && index === Clyde.index) {
      if (!player.invincible && !isHittingGhost) {
        player.lives--
        this.setState({player})
        if (player.lives === 0) {
          this.setState({gameState: 'GAMEOVER'})
          return false       
        } 

      } else if (!isHittingGhost) {
        player.score += 20
        Clyde.path = []
        Clyde.index = 300
        this.setState({player, Clyde})
        return false
      }
    }
    
    if (index === Blinky.index 
      || index === Pinky.index 
      || index === Inky.index 
      || index === Clyde.index) {
      return true
    } else {
      return false
    }
    
  }

  getGhostName(Blinky,Pinky,Inky,Clyde,index) {
    if(Blinky.index === index) {
      return 'blinky'
    } else if(Pinky.index === index) {
      return 'pinky'
    } else if(Inky.index === index) {
      return 'inky'
    } else if(Clyde.index === index) {
      return 'clyde'
    } else {
      return null
    }

  }

  redraw () {
    const mazeContent = []
    const biscuits = []
    const bigBiscuits = []
    const Blinky = {...this.state.Blinky}
    const Pinky = {...this.state.Pinky}
    const Inky = {...this.state.Inky}
    const Clyde = {...this.state.Clyde}
    const gameState = this.state.gameState

    if (gameState === 'START') {
      return
    }

    if (Blinky.pathPos < Blinky.path.length - 1) {
      Blinky.index = Blinky.path[Blinky.pathPos]
      Blinky.pathPos++
    } else {
      Blinky.pathPos = 0
      Blinky.path.reverse()
    }
    if (Pinky.pathPos < Pinky.path.length - 1) {
      Pinky.index = Pinky.path[Pinky.pathPos]
      Pinky.pathPos++
    } else {
      Pinky.pathPos = 0
      Pinky.path.reverse()
    }
    if (Inky.pathPos < Inky.path.length - 1) {
      Inky.index = Inky.path[Inky.pathPos]
      Inky.pathPos++
    } else {
      Inky.pathPos = 0
      Inky.path.reverse()
    }
    if (Clyde.pathPos < Clyde.path.length - 1) {
      Clyde.index = Clyde.path[Clyde.pathPos]
      Clyde.pathPos++
    } else {
      Clyde.pathPos = 0
      Clyde.path.reverse()
    }

    let x = 0
    let y = 0
    let index = 0
    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        let tile = {
          x,y, 
          type: this.getTileType(x,y), 
          ghostHere: this.drawGhost(Blinky, Pinky, Inky, Clyde, x,y,index), 
          ghostName: this.getGhostName(Blinky,Pinky,Inky,Clyde,index),
          index: index++
        }
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        tile.type === 'biscuit--big' && bigBiscuits.push(tile)
        ++x
      }
      ++y
    }
    this.setState({mazeContent, biscuits, bigBiscuits, Blinky, Pinky, Inky,Clyde})
  }

  draw () {
    const mazeContent = []
    const biscuits = []
    const bigBiscuits = [
        { x: 1,  y: 1 }, 
        { x: 18, y: 1 }, 
        { x: 1,  y: 9 }, 
        { x: 18, y: 9 }, 
      ]
    const level = this.state.level
    const maze = this.state.maze[level].slice()
    const Blinky = {...this.state.Blinky}
    const Pinky = {...this.state.Pinky}
    const Inky = {...this.state.Inky}
    const Clyde = {...this.state.Clyde}

    let x = 0
    let y = 0

    let index = 0

    while (mazeContent.length < MAZE_HEIGHT) {
      mazeContent[y] = []
      x = 0
      while (mazeContent[y].length < MAZE_WIDTH) {
        let tile = {
          x,y, 
          type: this.createTileType(x,y), 
          ghostHere: this.drawGhost(Blinky,Pinky,Inky,Clyde, x,y, index), 
          ghostName: this.getGhostName(Blinky,Pinky,Inky,Clyde,index),
          index: index++
        }        
        mazeContent[y].push(tile)
        tile.type === 'biscuit' && biscuits.push(tile)
        ++x
      }
      ++y
    }

    let maze1D = []

    for (let row in maze) {
      maze1D = maze1D.concat(maze[row].split(''))
    }

    const obstacles = ['x']
    const finder = new Pathfinder(20, 11, maze1D, obstacles)
    Blinky.path = finder.findPath(Blinky.paths[level].start, Blinky.paths[level].end)
    Pinky.path = finder.findPath(Pinky.paths[level].start, Pinky.paths[level].end)
    Inky.path = finder.findPath(Inky.paths[level].start, Inky.paths[level].end)
    Clyde.path = finder.findPath(Clyde.paths[level].start, Clyde.paths[level].end)

    this.setState({mazeContent, biscuits, bigBiscuits,Blinky, Pinky, Inky, Clyde})
  }
  movePlayerUp () {
    const player = {...this.state.player}
    const biscuits = this.state.biscuits.slice()
    let invincibleTimer = this.state.invincibleTimer
    player.y--
    player.direction = 'up'
    const result = this.getTileType(player.x,player.y)  
    if (result === 'blinky' || result === 'inky' || result === 'clyde' || result === 'pinky') {
      this.setState({isHittingGhost: true}, () => this.playerHitGhost(player, result))
    }
    result === 'wall' && player.y++
    result === 'biscuit' && player.score++
    result === 'biscuit--big' 
    && (player.score += 10) 
    && (player.invincible = true) 
    && (invincibleTimer+=3)

    if (invincibleTimer <= 0) {
      player.invincible = false
    }
    if (!biscuits.length) {
      this.setState({gameState:'NEXTLEVEL'})
      return
    }
    this.setState({player, invincibleTimer},this.redraw)
  }

  movePlayerDown () {
    const player = {...this.state.player}
    const biscuits = this.state.biscuits.slice()   
    let invincibleTimer = this.state.invincibleTimer 
    player.y++
    player.direction = 'down'    
    const result = this.getTileType(player.x,player.y)  
    if (result === 'blinky' || result === 'inky' || result === 'clyde' || result === 'pinky') {
      this.setState({isHittingGhost: true}, () => this.playerHitGhost(player, result))
    }
    result === 'wall' && player.y--
    result === 'biscuit' && player.score++
    result === 'biscuit--big' 
    && (player.score += 10) 
    && (player.invincible = true) 
    && (invincibleTimer+=3)

    if (invincibleTimer <= 0) {
      player.invincible = false
    }
    if (!biscuits.length) {
      this.setState({gameState:'NEXTLEVEL'})
      return
    }
    this.setState({player, invincibleTimer},this.redraw)
  }

  movePlayerLeft () {
    const player = {...this.state.player}
    const biscuits = this.state.biscuits.slice()
    let invincibleTimer = this.state.invincibleTimer
    player.x--
    player.direction = 'left'    
    const result = this.getTileType(player.x,player.y)  

    if (result === 'blinky' || result === 'inky' || result === 'clyde' || result === 'pinky') {
      this.setState({isHittingGhost: true}, () => this.playerHitGhost(player, result))
    }
    result === 'wall' && player.x++
    result === 'biscuit' && player.score++
    result === 'biscuit--big' 
    && (player.score += 10) 
    && (player.invincible = true) 
    && (invincibleTimer+=3)

    if (invincibleTimer <= 0) {
      player.invincible = false
    }
    if (!biscuits.length) {
      this.setState({gameState:'NEXTLEVEL'})
      return
    }
    this.setState({player, invincibleTimer},this.redraw)
  }

  movePlayerRight () {
    const player = {...this.state.player}
    const biscuits = this.state.biscuits.slice()
    let invincibleTimer = this.state.invincibleTimer
    player.x++
    player.direction = 'right'    
    const result = this.getTileType(player.x,player.y)  
    //console.log({result})    
    result === 'wall' && player.x--
    result === 'biscuit' && player.score++
    result === 'biscuit--big' 
    && (player.score += 10) 
    && (player.invincible = true) 
    && (invincibleTimer+=3)

    if (result === 'blinky' || result === 'inky' || result === 'clyde' || result === 'pinky') {
      this.setState({isHittingGhost: true}, () => this.playerHitGhost(player, result))
    }
    if (!biscuits.length) {      
      this.setState({gameState:'NEXTLEVEL'})
      return
    }

    if (invincibleTimer <= 0) {
      player.invincible = false
    }
    this.setState({player, invincibleTimer},this.redraw)
  }

  reloadGame () {
    window.location.reload()
  }

  startGame () {
    this.setState({gameState: 'PLAY'})
  }

  nextLevel () {
    let level = this.state.level
    const player = {...this.state.player}

    player.x = 10
    player.y = 2

    player.score = 0
    player.lives = 3

    player.invincible = false

    this.setState({gameState: 'PLAY',level: ++level, player}, this.draw)
    return
  }

  renderGameState (gameState) {

    if (gameState === 'START') {
      return (
        <div className={'game-screen'} onClick={this.startGame}>
          START GAME
          <p className="text-web">Click to play!</p>
          <p className="text-mobile">Press to play!</p>
          <br/>
          <p className="text-web">Use the arrow keys to move</p>
          <p className="text-mobile">Touch the arrow controls to move</p>
        </div>
      )
    } else if (gameState === 'PLAY') {
      return (
        <div className={'game-container'}>
          <div className={`game-title`}>REACT PAC-MAN</div>        
          <div className="hud-container">
            <HUD
              player={this.state.player}
              time={this.state.time}
            />
          </div>
          <div className="play-container">
          <div className="play-container--left">
            <TouchControl
              movePlayerUp={this.movePlayerUp}
              movePlayerLeft={this.movePlayerLeft}
              movePlayerRight={this.movePlayerRight}
              movePlayerDown={this.movePlayerDown}
            />
          </div>
          <Maze
            mazeContent={this.state.mazeContent}
            player={this.state.player}
          />
          <div className="play-container--right" ></div>
          </div>
        </div>
      )
    } else if (gameState === 'NEXTLEVEL' && this.state.level < 2) {
      return (
        <div className={'game-screen'} onClick={this.nextLevel}>
          {`Level ${this.state.level + 1} Complete!`}
          <p className="text">{`Click to play level ${this.state.level + 2}`}</p>
        </div>
      )
    } else if (gameState === 'NEXTLEVEL' && this.state.level === 2) {
      return (
        <div className={'game-screen'} onClick={this.reloadGame}>
          GAME WON
          <p className="text">Good job, you beat the game! Click to play again!</p>
        </div>
      )
    } else if (gameState === 'GAMEOVER') {
      clearInterval(this.state.timerInterval);
      clearInterval(this.state.drawPlayerInterval);
      return (
        <div className={'game-screen'} onClick={this.reloadGame}>
          GAME OVER
          <p className="text">Better luck next time. Click to play again!</p>
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
        onTouchStart={(e) => {return console.log(e.target)}}
        ref={(element) => {this.game = element}}>
        {this.renderGameState(this.state.gameState)}
      </div>
    );
  }
}

export default App;
