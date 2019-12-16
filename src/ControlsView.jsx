import * as React from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";

const { floor, log10 } = Math;

function numDigits(number) {
  if (number <= 0) return 0;
  return 1 + floor(log10(number));
}

function format(number) {
  const significantDigits = 3;
  let digits = numDigits(number);
  let maximumFractionDigits = digits < significantDigits ? significantDigits - digits : 0;
  return number.toLocaleString(navigator.language, { maximumFractionDigits });
}

@observer
export class ControlsView extends React.Component {
  @computed get model() {
    return this.props.model;
  }

  render() {
    return (
      <div className="controls">
        <form className="controls-form">
          <div className="control-row">
            <label className="left">Radius</label>
            <input
              className="right"
              type="number"
              value={this.model.radius}
              onChange={e => (this.model.radius = e.target.value)}
            />
          </div>
          <div className="control-row">
            <span className="left">Customers</span>
            <span className="right">{this.model.numActiveCustomers}</span>
          </div>
          <div className="control-row">
            <span className="left">Length of wire</span>
            <span className="right">{format(this.model.totalLengthOfWire)} km</span>
          </div>
        </form>
      </div>
    );
  }
}
