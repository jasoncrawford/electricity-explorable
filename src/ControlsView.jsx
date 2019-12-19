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

  @computed get currentOptions() {
    return [
      { key: "dc", value: "DC" },
      { key: "ac", value: "AC" },
    ];
  }

  @computed get inputSection() {
    return {
      title: "Inputs",
      rows: [
        { type: "input", label: "Radius (km)", key: "radiusKm" },
        { type: "select", label: "Metal", key: "metalKey", options: this.metalOptions },
        { type: "output", label: "Cost of metal", value: `\$${format(this.model.metal.priceDollarsPerKg)}/kg` },
        { type: "input", label: "Thickness (mm)", key: "wireThicknessMm" },
        { type: "radio", label: "Current", key: "currentType", options: this.currentOptions },
        { type: "input", label: "Voltage (V)", key: "voltageV" },
      ],
    };
  }

  @computed get powerDeliverySection() {
    let rows = [{ type: "output", label: "Customers", value: this.model.numActiveCustomers }];

    if (this.model.numActiveCustomers > 0) {
      rows.push(
        { type: "output", label: "Power delivered", value: `${format(this.model.powerDeliveredKw)} kW` },
        { type: "output", label: "Efficiency", value: `${format(this.model.efficiency * 100)}%` }
      );
    }

    return { title: "Power delivery", rows };
  }

  @computed get capitalSection() {
    if (this.model.numActiveCustomers < 1) return undefined;

    return {
      title: "Capital requirements",
      rows: [
        { type: "output", label: "Length of wires", value: `${format(this.model.lengthOfWireKm)} km` },
        { type: "output", label: "Cost of wires", value: `\$${format(this.model.costOfWireDollars)}` },
        { type: "output", label: "Capital needed", value: `\$${format(this.model.capitalNeededDollars)}` },
      ],
    };
  }

  @computed get businessOutcomesSection() {
    if (this.model.revenueDollarsPerYr === 0) return undefined;

    let rows = [{ type: "output", label: "Revenue", value: `\$${format(this.model.revenueDollarsPerYr)}/yr` }];

    if (this.model.isProfitable) {
      rows.push(
        { type: "output", label: "Profit", value: `\$${format(this.model.profitDollarsPerYr)}/yr` },
        { type: "output", label: "ROI", value: `${format(this.model.returnOnInvestmentPerYr * 100)}%/yr` }
      );
    } else {
      rows.push({ type: "output", label: "Loss", value: `\$${format(this.model.lossDollarsPerYr)}/yr` });
    }

    return { title: "Business outcomes", rows };
  }

  @computed get sections() {
    let sections = [this.inputSection, this.powerDeliverySection, this.capitalSection, this.businessOutcomesSection];
    return sections.filter(s => !!s);
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
    if (row.type === "radio") {
      return (
        <>
          <label className="left">{row.label}</label>
          <div className="right">
            {row.options.map(option => (
              <label key={option.key}>
                <input
                  type="radio"
                  name={row.key}
                  value={option.key}
                  checked={this.model[row.key] === option.key}
                  onChange={() => (this.model[row.key] = option.key)}
                />
                <span className="radio-label">{option.value}</span>
              </label>
            ))}
          </div>
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

  renderSection(section) {
    return (
      <>
        <div key={section.title} className="section-row">
          <h3 className="section-title">{section.title}</h3>
        </div>
        {section.rows.map(r => this.renderRow(r))}
      </>
    );
  }

  render() {
    return (
      <div className="controls">
        <form className="controls-form">{this.sections.map(s => this.renderSection(s))}</form>
      </div>
    );
  }
}
