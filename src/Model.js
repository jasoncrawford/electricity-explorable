import { observable, computed } from "mobx";
const { random, cos, sin, PI } = Math;

export class Model {
  @observable radius = 20;

  numCustomers = 150;
  customers = [];

  constructor() {
    for (let i = 0; i < this.numCustomers; i++) {
      this.customers[i] = this.makeRandomCustomer(i);
    }
  }

  @computed get numCustomersInRadius() {
    return this.customers.filter(c => this.isInRadius(c)).length;
  }

  makeRandomCustomer(id) {
    let r = 5 + random() * 55;
    let theta = random() * 2 * PI;
    return {
      id,
      r,
      x: r * cos(theta),
      y: r * sin(theta)
    };
  }

  isInRadius(customer) {
    return customer.r < this.radius;
  }
}
