import * as React from "react"

import "./main.css"
import { DiagramView } from "./DiagramView"
import { ControlsView } from "./ControlsView"

export class RootView extends React.Component {
  render () {
    return <div class="root">
      <h1 class="header">Electricity Explorable</h1>
      <div class="content">
        <DiagramView />
        <ControlsView />
      </div>
    </div>
  }
}
