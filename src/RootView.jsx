import * as React from "react"
import { computed } from "mobx";
import { observer } from "mobx-react";

import "./main.css"
import { DiagramView } from "./DiagramView"
import { ControlsView } from "./ControlsView"

@observer
export class RootView extends React.Component {
  @computed get model() {
    return this.props.model
  }

  render () {
    return (
      <div className="root">
        <h1 className="header">Electricity Explorable</h1>
        <div className="content">
          <DiagramView model={this.model} />
          <ControlsView model={this.model} />
        </div>
      </div>
    )
  }
}
