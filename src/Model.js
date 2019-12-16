import { observable, computed } from "mobx";
const { random, cos, sin, PI } = Math;

export class Model {
  numCustomers = 80;
  minRadius = 8;
  maxRadius = 60;

  @observable radius = 15;
  customers = [];

  constructor() {
    for (let i = 0; i < this.numCustomers; i++) {
      this.customers[i] = this.makeRandomCustomer(i);
    }
  }

  @computed get activeCustomers() {
    return this.customers.filter(c => this.isActive(c));
  }

  @computed get numActiveCustomers() {
    return this.activeCustomers.length;
  }

  makeRandomCustomer(id) {
    let r = this.minRadius + random() * (this.maxRadius - this.minRadius);
    let theta = random() * 2 * PI;
    return {
      id,
      r,
      x: r * cos(theta),
      y: r * sin(theta)
    };
  }

  isActive(customer) {
    return customer.r < this.radius;
  }
}
