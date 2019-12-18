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

  renderMetalOptions() {
    return this.model.metals.map(metal => (
      <option key={metal.key} value={metal.key}>
        {metal.name}
      </option>
    ));
  }

  renderProfitOrLoss() {
    if (this.model.isProfitable) {
      return (
        <>
          <div className="control-row">
            <span className="left">Profit</span>
            <span className="right">${format(this.model.profitDollarsPerYr)}/yr</span>
          </div>
          <div className="control-row">
            <span className="left">ROI</span>
            <span className="right">${format(this.model.returnOnInvestmentPerYr * 100)}%/yr</span>
          </div>
        </>
      );
    } else {
      return (
        <div className="control-row">
          <span className="left">Loss</span>
          <span className="right">${format(this.model.lossDollarsPerYr)}/yr</span>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="controls">
        <form className="controls-form">
          <div className="control-row">
            <label className="left">Voltage (V)</label>
            <input
              className="right"
              type="number"
              value={this.model.voltageV}
              onChange={e => (this.model.voltageV = e.target.value)}
            />
          </div>
          <div className="control-row">
            <label className="left">Metal</label>
            <select value={this.model.metalKey} onChange={e => (this.model.metalKey = e.target.value)}>
              {this.renderMetalOptions()}
            </select>
          </div>
          <div className="control-row">
            <label className="left">Thickness (mm)</label>
            <input
              className="right"
              type="number"
              value={this.model.wireThicknessMm}
              onChange={e => (this.model.wireThicknessMm = e.target.value)}
            />
          </div>
          <div className="control-row">
            <label className="left">Radius (km)</label>
            <input
              className="right"
              type="number"
              value={this.model.radiusKm}
              onChange={e => (this.model.radiusKm = e.target.value)}
            />
          </div>
          <div className="control-row">
            <span className="left">Customers</span>
            <span className="right">{this.model.numActiveCustomers}</span>
          </div>
          <div className="control-row">
            <span className="left">Power delivered</span>
            <span className="right">{format(this.model.powerDeliveredKw)} kW</span>
          </div>
          <div className="control-row">
            <span className="left">Efficiency</span>
            <span className="right">{format(this.model.efficiency * 100)}%</span>
          </div>
          <div className="control-row">
            <span className="left">Length of wire</span>
            <span className="right">{format(this.model.totalLengthOfWireKm)} km</span>
          </div>
          <div className="control-row">
            <span className="left">Cost of metal</span>
            <span className="right">${format(this.model.metal.priceDollarsPerKg)}/kg</span>
          </div>
          <div className="control-row">
            <span className="left">Total cost of wire</span>
            <span className="right">${format(this.model.totalCostOfWireDollars)}</span>
          </div>
          <div className="control-row">
            <span className="left">Total capital needed</span>
            <span className="right">${format(this.model.totalCapitalNeededDollars)}</span>
          </div>
          <div className="control-row">
            <span className="left">Revenue</span>
            <span className="right">${format(this.model.revenueDollarsPerYr)}/yr</span>
          </div>
          {this.renderProfitOrLoss()}
        </form>
      </div>
    );
  }
}
