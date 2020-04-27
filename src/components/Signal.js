import React, { Component } from 'react'
import { Item, Statistic } from 'semantic-ui-react'
import './Signal.css'

class Signal extends Component {

  displayUnits(signal) {
    if (signal.values) {
      const definedValue = signal.values[signal.value]
      if (definedValue) {
        return definedValue.replace(/_/g, ' ')
      }
    }
    return signal.units
  }

  render() {
    const { signal } = this.props
    let { name, value } = signal
    if (value === null || value === undefined) {
      value = '--'
    }
    const units = this.displayUnits(signal)
    return (
      <div className='Signal'>
        <div>{name}</div>
        <div className='data'>
          <div className='value'>{value}</div>
          <div className='units'>{units}</div>
        </div>
        {/* <Statistic size='small' label={this.displayUnits(signal)} value={value} /> */}
      </div>
    )
  }
}

export default Signal
