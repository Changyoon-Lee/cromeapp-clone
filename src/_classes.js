class globalVariables {
  ZIndex = 100;
  colorList = ["#e2aeae", "#e2c3ae", "#e2d9ae", "#d0e2ae", "#aee2c2", "#aedae2", "#aeb2e2", "#ceaee2", "#e2aed1"];
  get zIndex() {
    this.ZIndex += 1;
    return this.ZIndex
  }
  get randomColor() {
    const randomNumber = Math.floor(Math.random() * this.colorList.length);
    return this.colorList[randomNumber]
  }
}
export const variables = new globalVariables();