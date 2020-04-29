import React, { Component } from 'react'
import './Signal.css'
import M2 from '../services/m2'
import DBC from '../services/dbc'

class Signal extends Component {

  constructor(props) {
    super(props)
    this.signal = DBC.getSignal(props.signal)
    let { value } = this.signal
    if (value === null || value === undefined) {
      value = '--'
    }
    this.state = { value }
    this.units = displayUnits(this.signal)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    M2.addSignalListener(this.signal, this.handleChange)
  }

  componentWillUnmount() {
    M2.removeSignalListener(this.signal, this.handleChange)
  }

  handleChange(signal) {
    //console.log(`Signal.handleChange: ${signal.name} ${signal.value}`)
    if (signal.value !== this.state.value) {
      this.setState({
        value: signal.value
      })
    }
  }

  render() {
    const { name } = this.signal
    const { value } = this.state
    //console.log(`Signal.render: ${name} ${value}`)
    return (
      <div className='Signal'>
        <div>{name}</div>
        <div className='data'>
          <div className='value'>{value}</div>
          <div className='units'>{this.units}</div>
        </div>
      </div>
    )
  }
}

function displayUnits(signal) {
  if (signal.values) {
    const definedValue = signal.values[signal.value]
    if (definedValue) {
      return definedValue.replace(/_/g, ' ')
    }
  }
  return signal.units
}

export default Signal
