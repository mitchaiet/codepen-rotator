function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class ClockApp extends React.Component {




  constructor() {
    super();_defineProperty(this, "ones", ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']);_defineProperty(this, "tens", ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']);

    const d = new Date();
    const hour = d.getHours() % 12;
    const minute = d.getMinutes();
    const second = d.getSeconds();
    this.state = {
      hour,
      minute,
      second,
      hourString: this._getNumber(hour),
      minuteString: this._getNumber(minute),
      secondString: this._getNumber(second),
      hourDeg: 360 / 12 * hour - 90,
      minuteDeg: 360 / 60 * minute - 90,
      secondDeg: 360 / 60 * second - 90 };


    setInterval(this._tick.bind(this), 1000);
  }

  _getNumber(number) {
    if (number === 0) {
      return 'zero';
    } else if (number < 20) {
      return " " + this.ones[number];
    } else if (number % 10 === 0) {
      return " " + this.tens[Math.floor(number / 10)];
    } else {
      return " " + this.tens[Math.floor(number / 10)] + "-" + this.ones[number % 10];
    }
  }

  _tick(sheet) {
    const d = new Date();
    const hour = d.getHours() % 12;
    const minute = d.getMinutes();
    const second = d.getSeconds();

    // Do this way to ensure smooth transition animation from 11 to 0 and 59 to zero
    const hourDeg = hour === this.state.hour ? this.state.hourDeg : this.state.hourDeg + 30;
    const minuteDeg = minute === this.state.minute ? this.state.minuteDeg : this.state.minuteDeg + 6;
    const secondDeg = second === this.state.second ? this.state.secondDeg : this.state.secondDeg + 6;

    this.setState({
      hour,
      minute,
      second,
      hourString: this._getNumber(hour),
      minuteString: this._getNumber(minute),
      secondString: this._getNumber(second),
      hourDeg,
      minuteDeg,
      secondDeg });

  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "clock" }, /*#__PURE__*/
      React.createElement("h1", { style: { transform: 'rotate(' + this.state.hourDeg + 'deg)' } }, this.state.hourString), /*#__PURE__*/
      React.createElement("h2", { style: { transform: 'rotate(' + this.state.minuteDeg + 'deg)' } }, this.state.minuteString), /*#__PURE__*/
      React.createElement("h3", { style: { transform: 'rotate(' + this.state.secondDeg + 'deg)' } }, this.state.secondString)));



  }}



ReactDOM.render( /*#__PURE__*/
React.createElement(ClockApp, null), document.getElementById('Clock-app'));