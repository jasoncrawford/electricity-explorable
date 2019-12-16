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
      <form className="controls">
        <label>
          Radius
          <input
            type="number"
            value={this.model.radius}
            onChange={e => this.model.radius = e.target.value}
          />
        </label>
      </form>
    )
  }
}
