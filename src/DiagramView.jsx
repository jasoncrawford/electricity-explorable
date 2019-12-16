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

  renderCustomer(customer) {
    let color = this.model.isInRadius(customer) ? "#999" : "#ccc";
    return <circle key={customer.id} cx={customer.x * this.scale} cy={customer.y * this.scale} r="7" fill={color} />;
  }

  render() {
    return (
      <svg ref={el => (this.svg = el)} className="diagram">
        <g transform={`translate(${this.width / 2} ${this.height / 2})`}>
          <rect x="-25" y="-25" width="50" height="50" stroke="#999" fill="none" />
          <circle cx="0" cy="0" r={this.model.radius * this.scale} stroke="#999" fill="none" />
          {this.model.customers.map(c => this.renderCustomer(c))}
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
