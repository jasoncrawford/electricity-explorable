import * as React from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";

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
        </form>
      </div>
    );
  }
}
