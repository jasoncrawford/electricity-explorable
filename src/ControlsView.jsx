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

  @computed get metalOptions() {
    return this.model.metals.map(metal => ({ key: metal.key, value: metal.name }));
  }

  @computed get rows() {
    let rows = [
      { type: "input", label: "Voltage (V)", key: "voltageV" },
      { type: "select", label: "Metal", key: "metalKey", options: this.metalOptions },
      { type: "input", label: "Thickness (mm)", key: "wireThicknessMm" },
      { type: "input", label: "Radius (km)", key: "radiusKm" },
      { type: "output", label: "Customers", value: this.model.numActiveCustomers }
    ];

    if (this.model.numActiveCustomers < 1) return rows;

    rows.push(
      { type: "output", label: "Power delivered", value: `${format(this.model.powerDeliveredKw)} kW` },
      { type: "output", label: "Efficiency", value: `${format(this.model.efficiency * 100)}%` },
      { type: "output", label: "Length of wires", value: `${format(this.model.lengthOfWireKm)} km` },
      { type: "output", label: "Cost of wires", value: `\$${format(this.model.costOfWireDollars)}` },
      { type: "output", label: "Capital needed", value: `\$${format(this.model.capitalNeededDollars)}` },
      { type: "output", label: "Revenue", value: `\$${format(this.model.revenueDollarsPerYr)}/yr` }
    );

    if (this.model.isProfitable) {
      rows.push(
        { type: "output", label: "Profit", value: `\$${format(this.model.profitDollarsPerYr)}/yr` },
        { type: "output", label: "ROI", value: `${format(this.model.returnOnInvestmentPerYr * 100)}%/yr` }
      );
    } else {
      rows.push({ type: "output", label: "Loss", value: `\$${format(this.model.lossDollarsPerYr)}/yr` });
    }

    return rows;
  }

  renderRowContents(row) {
    if (row.type === "output") {
      return (
        <>
          <span className="left">{row.label}</span>
          <span className="right">{row.value}</span>
        </>
      );
    }
    if (row.type === "input") {
      return (
        <>
          <label className="left">{row.label}</label>
          <input
            className="right"
            type="number"
            value={this.model[row.key]}
            onChange={e => (this.model[row.key] = e.target.value)}
          />
        </>
      );
    }
    if (row.type === "select") {
      return (
        <>
          <label className="left">{row.label}</label>
          <select className="right" value={this.model[row.key]} onChange={e => (this.model[row.key] = e.target.value)}>
            {row.options.map(option => (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            ))}
          </select>
        </>
      );
    }
  }

  renderRow(row) {
    return (
      <div key={row.label} className="control-row">
        {this.renderRowContents(row)}
      </div>
    );
  }

  render() {
    return (
      <div className="controls">
        <form className="controls-form">{this.rows.map(r => this.renderRow(r))}</form>
      </div>
    );
  }
}
