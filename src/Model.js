import { observable, computed } from "mobx";
const { random, abs, cos, sin, PI, round, sqrt } = Math;

const hoursPerDay = 24;
const daysPerYr = 365.2425;
const hoursPerYr = hoursPerDay * daysPerYr;

const ozPerLb = 16;
const lbPerKg = 2.20462;

const sum = array => array.reduce((a, b) => a + b, 0);

// https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity#Resistivity_and_conductivity_of_various_materials
// https://sites.google.com/site/chempendix/densities-of-pure-metals
// https://www.dailymetalprice.com/
const metals = [
  { key: "silver", name: "Silver", resistivityOhmM: 1.59e-8, densityGPerCm3: 10.5, priceDollarsPerOz: 16.865 },
  { key: "copper", name: "Copper", resistivityOhmM: 1.68e-8, densityGPerCm3: 8.96, priceDollarsPerLb: 2.7646 },
  // { key: "annealed-copper", name: "Annealed copper", resistivityOhmM: 1.72e-8 },
  { key: "gold", name: "Gold", resistivityOhmM: 2.44e-8, densityGPerCm3: 19.3, priceDollarsPerOz: 1474.7 },
  { key: "aluminium", name: "Aluminium", resistivityOhmM: 2.65e-8, densityGPerCm3: 2.7, priceDollarsPerLb: 0.7958 },
  // { key: "calcium", name: "Calcium", resistivityOhmM: 3.36e-8, densityGPerCm3: 1.54 },
  // { key: "tungsten", name: "Tungsten", resistivityOhmM: 5.6e-8, densityGPerCm3: 19.3 },
  { key: "zinc", name: "Zinc", resistivityOhmM: 5.9e-8, densityGPerCm3: 7.14, priceDollarsPerLb: 1.0106 },
  { key: "nickel", name: "Nickel", resistivityOhmM: 6.99e-8, densityGPerCm3: 8.9, priceDollarsPerLb: 6.2596 },
  // { key: "lithium", name: "Lithium", resistivityOhmM: 9.28e-8, densityGPerCm3: 0.53 },
  // { key: "iron", name: "Iron", resistivityOhmM: 9.7e-8, densityGPerCm3: 7.87 },
  { key: "platinum", name: "Platinum", resistivityOhmM: 1.06e-7, densityGPerCm3: 21.5, priceDollarsPerOz: 943.0 },
  { key: "tin", name: "Tin", resistivityOhmM: 1.09e-7, densityGPerCm3: 7.26, priceDollarsPerLb: 7.7904 }
];

metals.forEach(metal => {
  if (metal.priceDollarsPerLb) {
    metal.priceDollarsPerKg = metal.priceDollarsPerLb * lbPerKg;
  } else if (metal.priceDollarsPerOz) {
    metal.priceDollarsPerKg = metal.priceDollarsPerOz * ozPerLb * lbPerKg;
  }
});

const metalsByKey = metals.reduce((hash, obj) => {
  hash[obj.key] = obj;
  return hash;
}, {});

export class Model {
  numCustomers = 80;
  minRadiusKm = 8;
  maxRadiusKm = 60;
  powerPerCustomerKw = 1.2;
  marketPriceDollarsPerKwHr = 0.15;
  costOfPlantDollars = 4.7e6;

  metals = metals;

  @observable radiusKm = 15;
  @observable.ref metal = metalsByKey["copper"];
  @observable wireThicknessMm = 10;
  @observable voltageV = 100;
  customers = [];

  constructor() {
    for (let i = 0; i < this.numCustomers; i++) {
      this.customers[i] = this.makeRandomCustomer(i);
    }
  }

  get metalKey() {
    return this.metal && this.metal.key;
  }

  set metalKey(key) {
    this.metal = metalsByKey[key];
  }

  @computed get activeCustomers() {
    return this.customers.filter(c => this.isActive(c));
  }

  @computed get numActiveCustomers() {
    return this.activeCustomers.length;
  }

  @computed get powerDeliveredKw() {
    return this.numActiveCustomers * this.powerPerCustomerKw;
  }

  @computed get revenueDollarsPerYr() {
    return this.powerDeliveredKw * this.marketPriceDollarsPerKwHr * hoursPerYr;
  }

  distanceToCustomerKm(customer) {
    return abs(customer.xKm) + abs(customer.yKm);
  }

  powerLostForCustomerKw(customer) {
    let distanceM = this.distanceToCustomerKm(customer) * 1000;
    let thicknessM = this.wireThicknessMm / 1000;
    let radiusM = thicknessM / 2;
    let crossSectionalAreaM2 = PI * radiusM * radiusM;
    let resistanceOhm = (this.metal.resistivityOhmM * distanceM) / crossSectionalAreaM2;
    let currentA = (this.powerPerCustomerKw * 1000) / this.voltageV;
    return (currentA * currentA * resistanceOhm) / 1000;
  }

  @computed get totalPowerLostKw() {
    return sum(this.activeCustomers.map(c => this.powerLostForCustomerKw(c)));
  }

  @computed get totalPowerGeneratedKw() {
    return this.powerDeliveredKw + this.totalPowerLostKw;
  }

  @computed get efficiency() {
    return this.powerDeliveredKw / this.totalPowerGeneratedKw;
  }

  @computed get totalLengthOfWireKm() {
    return sum(this.activeCustomers.map(c => this.distanceToCustomerKm(c)));
  }

  @computed get totalVolumeOfWireCm3() {
    let lengthCm = this.totalLengthOfWireKm * 1000 * 100;
    let thicknessCm = this.wireThicknessMm / 10;
    let radiusCm = thicknessCm / 2;
    let areaCm2 = PI * radiusCm * radiusCm;
    return lengthCm * areaCm2;
  }

  @computed get totalMassOfWireKg() {
    let massG = this.totalVolumeOfWireCm3 * this.metal.densityGPerCm3;
    return massG / 1000;
  }

  @computed get totalCostOfWireDollars() {
    return this.totalMassOfWireKg * this.metal.priceDollarsPerKg;
  }

  @computed get totalCapitalNeededDollars() {
    return this.costOfPlantDollars + this.totalCostOfWireDollars;
  }

  makeRandomCustomer(id) {
    const gridSizeKm = 2;
    let radiusKm = this.minRadiusKm + random() * (this.maxRadiusKm - this.minRadiusKm);
    let theta = random() * 2 * PI;
    let xKm = radiusKm * cos(theta);
    let yKm = radiusKm * sin(theta);
    xKm = round(xKm / gridSizeKm) * gridSizeKm;
    yKm = round(yKm / gridSizeKm) * gridSizeKm;
    radiusKm = sqrt(xKm * xKm + yKm * yKm);
    return { id, radiusKm, xKm, yKm };
  }

  isActive(customer) {
    return customer.radiusKm < this.radiusKm;
  }
}
