import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import TouchControl from '.'


describe('TouchControl Component', () => {
  const props = {
    player: {},
    tileObject: {},
  }
  it('renders with props passed to it', function () {
    expect(shallow(<TouchControl {...props}/>).find('.touchControl-container').length).to.equal(1)
  })
})