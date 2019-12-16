import * as React from "react"
import { computed } from "mobx";
import { observer } from "mobx-react";

@observer
export class DiagramView extends React.Component {
  @computed get model() {
    return this.props.model;
  }

  render() {
    return (
      <svg className="diagram">
        <circle cx="50%" cy="50%" r={10 * this.model.radius} stroke="#999" fill="none" />
      </svg>
    )
  }
}
