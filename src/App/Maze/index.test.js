import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import Maze from '.'


describe('Maze Component', () => {
  const props = {
    player: {},
    mazeContent: [],
  }
  it('renders with props passed to it', function () {
    expect(shallow(<Maze {...props}/>).find('.maze-container').length).to.equal(1)
  })
})