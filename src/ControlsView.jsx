import * as React from "react";

export class ControlsView extends React.Component {
  render() {
    return <form class="controls">
      <label>
        Radius <input type="number"></input>
      </label>
    </form>;
  }
}
