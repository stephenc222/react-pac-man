/*
A-Star path finding implementation for 2D maps
(c) 2017, Bang Bang Attack Studios
http://www.bangbangattackstudios.com

// import the Pathfinder
const Pathfinder = require('pathfinder')

const map = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1
]

// any tiles in map with the following values will be used as
// obstacles to avoid by the path finding algorithm
const obstacles = [1]

// create the path finder object
const finder = new Pathfinder(10, 10, map, obstacles)

// searchPath will contain a list of index values which follow the path found
// or an empty list if no path can be found
const searchPath = finder.findPath(12, 87)

*/
const obj = (props) => Object.assign({}, props)

const mapNodeData = (index, map) => obj({
  id: map[index],
  index
})

const pathNode = () => obj({
  data: null,
  parent: null,
  neighbors: [],
  inOpenList: false,
  inClosedList: false,
  distanceToTarget: Number.MAX_VALUE,
  distanceTraveled: Number.MAX_VALUE
})

const neighborPattern = (x, y) => obj({
  x,
  y
})

const neighborPatterns = [
  neighborPattern(0, -1),
  neighborPattern(1, 0),
  neighborPattern(0, 1),
  neighborPattern(-1, 0)
]

class Pathfinder {
  constructor (width, height, map, obstacles) {
    this.state = {
      searchGraph: [],
      openList: [],
      closedList: [],
      width,
      height,
      map,
      obstacles
    }

    this.initializeSearchGraph()
  }

  indexAt (x, y) {
    return x + y * this.state.width
  }

  reset () {
    this.state.searchGraph.length = 0
    this.initializeSearchGraph()
  }

  isObstacle (index) {
    console.log(this.state.map[index])
    return this.state.obstacles.indexOf(this.state.map[index]) !== -1
  }

  initializeSearchGraph () {
    const {
      searchGraph,
      width,
      height,
      map
    } = this.state

    map.forEach((cell, index) => {
      const searchNode = pathNode()
      searchNode.data = mapNodeData(index, map)
      searchGraph.push(searchNode)
    })

    const count = searchGraph.length

    for (let row = 0; row < height; row += 1) {
      for (let column = 0; column < width; column += 1) {
        const index = this.indexAt(column, row)
        const searchNode = searchGraph[index]
        this.addNeighborsTo(searchNode, column, row, count)
      }
    }
  }

  addNeighborsTo (searchNode, column, row, searchGraphSize) {
    const { searchGraph } = this.state

    neighborPatterns.forEach(pattern => {
      const neighborColumn = column + pattern.x
      const neighborRow = row + pattern.y
      const neighborIndex = this.indexAt(neighborColumn, neighborRow)

      if (neighborIndex >= 0 && neighborIndex < searchGraphSize) {
        const node = searchGraph[neighborIndex]
        node.data.index === 96 && console.log(node.data)
        if (!this.isObstacle(node.data.index)) {
          // console.log(node.data)
          // node.data.id === 'X' && console.log(node)
          searchNode.neighbors.push(node)
        }
      }
    })
  }

  resetSearch () {
    const {
      openList,
      closedList,
      searchGraph
    } = this.state

    openList.length = 0
    closedList.length = 0

    searchGraph.forEach(searchNode => {
      if (searchNode) {
        searchNode.inOpenList = false
        searchNode.inClosedList = false
        searchNode.distanceToTarget = Number.MAX_VALUE
        searchNode.distanceTraveled = Number.MAX_VALUE
      }
    })
  }

  findFinalPath (startNode, endNode) {
    const { closedList } = this.state

    closedList.push(endNode)

    let parentNode = endNode.parent

    while (parentNode !== startNode) {
      closedList.push(parentNode)
      parentNode = parentNode.parent
    }

    const finalPath = closedList.slice()
      .reverse()
      .map(node => {
        // console.log(node.data)
        return node.data.index
      })
      // console.log("finalPath: ")
      // console.log(finalPath)
    return finalPath
  }

  findBestNode () {
    const { openList } = this.state

    let currentNode = openList[0]
    let shortestDistanceToTarget = Number.MAX_VALUE

    openList.forEach(node => {
      if (node.distanceToTarget < shortestDistanceToTarget) {
        currentNode = node
        // console.log("currentNode")
        // console.log(currentNode.data)
        shortestDistanceToTarget = node.distanceToTarget
      }
    })

    return currentNode
  }

  heuristic (start, end) {
    const { width } = this.state
    const sx = start.index % width
    const sy = start.index / width
    const ex = end.index % width
    const ey = end.index / width
    const h = Math.abs(~~(sx - ex)) + Math.abs(~~(sy - ey))
    return h 
  }

  findPath (start, end) {
    if (start === end) {
      return []
    } else {
      this.resetSearch()

      const {
        searchGraph,
        openList
      } = this.state

      const startNode = searchGraph[start]
      const endNode = searchGraph[end]
      startNode.inOpenList = true
      startNode.distanceTraveled = 0
      startNode.distanceToTarget = this.heuristic(startNode.data, endNode.data)

      openList.push(startNode)

      while (openList.length) {
        const currentNode = this.findBestNode()
        // console.log("currentNode: ", currentNode.data)
        // console.log(currentNode.distanceToTarget)

        if (!currentNode) {
          break
        }

        if (currentNode === endNode) {
          return this.findFinalPath(startNode, endNode)
        }

        currentNode.neighbors.forEach(neighbor => {
          if (neighbor) {
            const distanceTraveled = currentNode.distanceTraveled + 1
            const h = this.heuristic(neighbor.data, endNode.data)

            if ((!neighbor.inOpenList) && (!neighbor.inClosedList)) {
              neighbor.distanceTraveled = distanceTraveled
              neighbor.distanceToTarget = distanceTraveled + h
              neighbor.parent = currentNode
              neighbor.inOpenList = true
              openList.push(neighbor)
            } else if (neighbor.inOpenList || neighbor.inClosedList) {
              if (neighbor.distanceTraveled > distanceTraveled) {
                neighbor.distanceTraveled = distanceTraveled
                neighbor.distanceToTarget = distanceTraveled + h
                neighbor.parent = currentNode
              }
            }
          }
        })

        openList.splice(openList.indexOf(currentNode), 1)
        currentNode.inClosedList = true
      }

      return []
    }
  }
}

module.exports = Pathfinder