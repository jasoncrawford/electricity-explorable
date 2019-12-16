import { observable } from "mobx";
const { random, cos, sin, PI } = Math;

export class Model {
  @observable radius = 20;

  numCustomers = 150;
  customers = [];

  constructor() {
    for (let i = 0; i < this.numCustomers; i++) {
      this.customers[i] = this.makeRandomCustomer();
    }
  }

  makeRandomCustomer() {
    let r = 5 + random() * 55;
    let theta = random() * 2 * PI;
    return {
      x: r * cos(theta),
      y: r * sin(theta)
    };
  }
}
