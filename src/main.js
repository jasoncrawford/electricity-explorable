import * as React from "react"
import * as ReactDOM from "react-dom"

import { Model } from "./Model"
import { RootView } from "./RootView"

console.log("Electricity Explorable v0.1 booting up")

const model = new Model()
window.model = model

const root = document.getElementById('root')
ReactDOM.render(<RootView model={model} />, root)
