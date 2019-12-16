import * as React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";

@observer
export class DiagramView extends React.Component {
  scale = 10; // px / km

  @observable bounds;

  @computed get model() {
    return this.props.model;
  }

  @computed get width() {
    return (this.bounds && this.bounds.width) || 100;
  }

  @computed get height() {
    return (this.bounds && this.bounds.height) || 100;
  }

  resize() {
    if (this.svg) this.bounds = this.svg.getBoundingClientRect();
  }

  renderWireTo(customer) {
    let sx = customer.x * this.scale;
    let sy = customer.y * this.scale;

    let d = `M 0 0 L ${sx} ${sy}`;
    return <path d={d} stroke="#999" />;
  }

  renderCustomer(customer) {
    let sx = customer.x * this.scale;
    let sy = customer.y * this.scale;
    let active = this.model.isInRadius(customer);
    let color = active ? "#999" : "#ccc";
    let circle = <circle key={customer.id} cx={sx} cy={sy} r="7" fill={color} />;
    if (!active) return circle;

    return [circle, this.renderWireTo(customer)];
  }

  render() {
    return (
      <svg ref={el => (this.svg = el)} className="diagram">
        <g transform={`translate(${this.width / 2} ${this.height / 2})`}>
          {this.model.customers.map(c => this.renderCustomer(c))}
          <rect x="-25" y="-25" width="50" height="50" stroke="#999" fill="#fff" />
          <circle cx="0" cy="0" r={this.model.radius * this.scale} stroke="#999" fill="none" />
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
