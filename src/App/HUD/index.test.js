import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import HUD from '.'


describe('HUD Component', () => {
  const props = {
    player: {},
    time: 100,
  }
  it('renders with props passed to it', function () {
    expect(shallow(<HUD {...props}/>).find('.hud-data').length).to.equal(1)
  })
})