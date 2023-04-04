const App = React.createClass({ displayName: "App",

  getInitialState() {
    return {
      time: "00:00:00",
      amPm: "am" };

  },

  componentDidMount() {
    this.loadInterval = setInterval(
    this.getTime, 1000);

  },

  getTime() {
    const
    takeTwelve = n => n > 12 ? n - 12 : n,
    addZero = n => n < 10 ? "0" + n : n;

    setInterval(() => {
      let d, h, m, s, t, amPm;

      d = new Date();
      h = addZero(takeTwelve(d.getHours()));
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      t = `${h}:${m}:${s}`;

      amPm = d.getHours() >= 12 ? "pm" : "am";

      this.setState({
        time: t,
        amPm: amPm });


    }, 1000);
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "outer" }, /*#__PURE__*/
      React.createElement("div", { className: "inner" }, /*#__PURE__*/
      React.createElement("div", { className: "most-inner" }, /*#__PURE__*/
      React.createElement("span", { className:
        this.state.time === "00:00:00" ?
        "time blink" :
        "time" }, " ",
      this.state.time), /*#__PURE__*/

      React.createElement("span", { className: "amPm" },
      this.state.amPm)))));





  } });


ReactDOM.render( /*#__PURE__*/
React.createElement(App, null),
document.getElementById('clock'));