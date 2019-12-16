import { observable, computed } from "mobx";
const { random, abs, cos, sin, PI } = Math;

export class Model {
  numCustomers = 80;
  minRadiusKm = 8;
  maxRadiusKm = 60;

  @observable radiusKm = 15;
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

  @computed get totalLengthOfWireKm() {
    return this.activeCustomers.reduce((sum, c) => (sum += abs(c.xKm) + abs(c.yKm)), 0);
  }

  makeRandomCustomer(id) {
    let radiusKm = this.minRadiusKm + random() * (this.maxRadiusKm - this.minRadiusKm);
    let theta = random() * 2 * PI;
    return {
      id,
      radiusKm,
      xKm: radiusKm * cos(theta),
      yKm: radiusKm * sin(theta)
    };
  }

  isActive(customer) {
    return customer.radiusKm < this.radiusKm;
  }
}
