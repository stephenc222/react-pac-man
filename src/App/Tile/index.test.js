import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import Tile from '.'


describe('Tile Component', () => {
  const props = {
    player: {},
    tileObject: {},
  }
  it('renders with props passed to it', function () {
    expect(shallow(<Tile {...props}/>).find('.tile-container').length).to.equal(1)
  })
})