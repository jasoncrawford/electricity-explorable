import * as React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";

const { abs, round, trunc } = Math;

@observer
export class DiagramView extends React.Component {
  scalePxPerKm = 10;

  @observable bounds;

  @computed get model() {
    return this.props.model;
  }

  @computed get widthPx() {
    return (this.bounds && this.bounds.width) || 100;
  }

  @computed get heightPx() {
    return (this.bounds && this.bounds.height) || 100;
  }

  resize() {
    if (this.svg) this.bounds = this.svg.getBoundingClientRect();
  }

  renderWireToCustomer(customer) {
    const gridSizePx = 80;

    let xPx = customer.xKm * this.scalePxPerKm;
    let yPx = customer.yKm * this.scalePxPerKm;

    let longerPx, shorterPx, dir1, dir2;
    if (abs(xPx) > abs(yPx)) {
      longerPx = xPx;
      shorterPx = yPx;
      dir1 = "H";
      dir2 = "V";
    } else {
      longerPx = yPx;
      shorterPx = xPx;
      dir1 = "V";
      dir2 = "H";
    }

    let midpointPx = longerPx / 2;
    let roundMidPx = round(midpointPx / gridSizePx) * gridSizePx;
    let truncLongPx = trunc(longerPx / gridSizePx) * gridSizePx;
    let truncShortPx = trunc(shorterPx / gridSizePx) * gridSizePx;
    let path = ["M 0 0", dir1, roundMidPx, dir2, truncShortPx, dir1, truncLongPx, dir2, shorterPx, dir1, longerPx];
    return <path key={`w-${customer.id}`} d={path.join(" ")} stroke="#ccc" fill="none" />;
  }

  renderCustomer(customer) {
    let xPx = customer.xKm * this.scalePxPerKm;
    let yPx = customer.yKm * this.scalePxPerKm;
    let color = this.model.isActive(customer) ? "#999" : "#ccc";
    return <circle key={`c-${customer.id}`} cx={xPx} cy={yPx} r="7" fill={color} />;
  }

  render() {
    return (
      <svg ref={el => (this.svg = el)} className="diagram">
        <g transform={`translate(${this.widthPx / 2} ${this.heightPx / 2})`}>
          {this.model.activeCustomers.map(c => this.renderWireToCustomer(c))}
          {this.model.customers.map(c => this.renderCustomer(c))}
          <rect x="-25" y="-25" width="50" height="50" stroke="#999" fill="#fff" />
          <circle cx="0" cy="0" r={this.model.radiusKm * this.scalePxPerKm} stroke="#999" fill="none" />
        </g>
      </svg>
    );
  }

  componentDidMount() {
    this.resizer = this.resize.bind(this);
    window.addEventListener("resize", this.resizer);
    this.resize(); // need to resize immediately because we couldn't get the bounds until after initial render
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizer);
  }
}
