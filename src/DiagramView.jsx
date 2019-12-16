import * as React from "react"

export class DiagramView extends React.Component {
  render() {
    return <svg class="diagram">
      <circle cx="50%" cy="50%" r="200" stroke="#999" fill="none" />
    </svg>
  }
}
