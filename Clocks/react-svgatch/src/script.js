const { Component } = React;

// digits component, taking in the number of digits to show and mapping the digits around the clock
// for instance 4 digits --> 3, 6, 9, 12, positioned at 3, 6, 9, 12 o'click respectively
const Digits = ({ howMany, distance }) => {
  // describe the digits to be displayed around the clock
  const baseDigit = 12 / howMany;
  const digits = [];
  for (let i = baseDigit; i <= 12; i += baseDigit) {
    digits.push(i);
  }
  // describe the text elements rotated according to the digit number (12 at the very top, 3 at the very right and so forth repeating the structure of an analog clock)
  const DigitsText = digits.map(digit => {
    const rotate = `rotate(${digit * 360 / 12}) translate(0, -${distance}) rotate(-${digit * 360 / 12})`;

    return (
      <text
        key={digit}
        x="0"
        y="0"
        fill="#ccc"
        opacity="0.5"
        fontWeight="400"
        fontSize="0.85rem"
        textAnchor="middle"
        alignmentBaseline="middle"
        transform={rotate}
      >
        {digit}
      </text>
    );

  });

  return (
    <g>
      {
        DigitsText
      }
    </g>
  );
}


// hours component, taking the current hours and drawing a hand rotated as per the number of hours
// 12 hours clock
const Hours = ({ hours, size }) => {


  const hourTwelve = hours >= 12 ? hours -= 12 : hours;
  const d = `M 0 0 v -${size}`;
  const rotate = `rotate(${hourTwelve * 360 / 12})`;

  return (
    <g className="hand">
      <path
        stroke="#999"
        strokeWidth="5px"
        strokeLinecap="round"
        fill="none"
        d={d}
        transform={rotate} />
    </g>
  );
};


// minutes component, taking the current minutes and drawing a hand rotated as per the number of minutes
const Minutes = ({ size, minutes }) => {


  const d = `M 0 0 v -${size}`;
  const rotate = `rotate(${minutes * 360 / 60})`;
  return (
    <g className="hand">
      <path
        // thinner and with a more evident color
        stroke="#eee"
        strokeWidth="3px"
        strokeLinecap="round"
        fill="none"
        d={d}
        transform={rotate} />
    </g>
  );
};


// seconds component, taking the current seconds, drawing 60 ticks for each second in the dial and highlighting the current second
// additionally detailing a triangle pointing toward the current second
const Seconds = ({ size, seconds, spread, turn }) => {
  // seconds ticks
  const SecondsPath = [];
  for (let i = 1; i <= 60; i++) {
    const rotate = `rotate(${i * 360 / 60})`;
    const d = `M 0 -${spread} v -${size}`;
    SecondsPath.push(
      <path
        key={i}
        stroke="#eee"
        strokeWidth="2px"
        strokeLinecap="square"
        fill="none"
        className={(i === seconds + 1) ? 'current' : ''}
        d={d}
        transform={rotate} />
    );
  }

  // triangle marker
	// turn allowing to go past the 0-360 range
  const markerPath = `M 0 -${spread - 5} l 5 7 h -10 Z`;
  const markerRotation = `rotate(${(seconds + 1) * 360 / 60 + (360 * turn)})`;


  return (
    <g>
      {/* ticks nested in a group to specifically target the path elements in CSS */}
      <g className="seconds">
        {
          SecondsPath
        }
      </g>
      <path
        stroke="none"
        fill="#eee"
        d={markerPath}
        transform={markerRotation} />
    </g>
  );
};


// main component rendered through index.js
class SVGatch extends Component {
  constructor(props) {
    super(props);
    // in the state detail a date Object, later updated every second
    // additionally define root variables for the size of the SVG and the margin allowing to nest SVG element inside, without cropping
    // following d3's margin convention
    // ! turn addded to keep track of the number of times the seconds marker goes around the clock, and in so doing avoiding the 'snap' occurring between 359 degrees and 0
    // this way, instead of going back to rotate(0), the hands and marker go to rotate(360), then rotate(361) and so forth and so on
    this.state = {
      date: new Date(),
      size: 225,
      margin: 25,
      turn: 0
    };
  }



  // when the components are mounted set up an interval to update the date object every second
  componentDidMount() {
    this.interval = setInterval(() => {
      const date = new Date();
      // check if the number of seconds is 0, and in this instance increment the turn variable of the matching element
      let turn = date.getSeconds() === 0 ? this.state.turn + 1 : this.state.turn;

      // update the state
      this.setState({
        date,
        turn
      });
    }, 1000);
  }

  render() {
    // destructure the variables present in the state
    const { date, size, margin, turn } = this.state;
    /* define transform values to translate the SVG elements (per d3's margin convention)
    and to center the elements */
    const translate = `translate(${margin} ${margin})`;
    const center = `translate(${size / 2} ${size / 2})`;
    /* within the SVG Element, define the following elements/components
    circle, for the outer most ring
    Digits, for text elements distributed around the ring
    Hours, for the hour's hand
    Minutes, for the minute's hand
    Seconds, for the ticks representing the seconds and a marker highlighting the current second
    */
    return (
      <svg width={size + (margin * 2)} height={size + (margin * 2)}>
        <g transform={translate}>
          <g transform={center}>
            <circle
              cx="0"
              cy="0"
              r={size / 2.3}
              fill="none"
              stroke="#ccc"
              strokeWidth="2px" />

            {/*
              howMany: the number of digits to display around the clock
              distance: where the text elements are pushed
            */}
            <Digits
              howMany={4}
              distance={size / 2} />

            {/*
              hours: the current hours
              size: the size of the hand
              turn: to rotate the hand more than one time around the clock, and without transitioning issues
            */}
            <Hours
              hours={date.getHours()}
              size={size / 4.5}
            />

            {/*
              minutes: the current minutes
              size: the size of the hand
              turn: to rotate the hand more than one time around the clock, and without transitioning issues
            */}
            <Minutes
              minutes={date.getMinutes()}
              size={size / 3.5}
            />

            {/*
              seconds: the current seconds
              size: the size of the hand
              spread: the starting point of each tick
              turn: to rotate the hand more than one time around the clock, and without transitioning issues
            */}
            <Seconds
              seconds={date.getSeconds()}
              size={size / 30}
              spread={size / 2.7}
              turn={turn}
            />

            <circle
              cx="0"
              cy="0"
              r="5"
              fill="#5941f3"
              stroke="#fff"
              strokeWidth="3px" />
          </g>
        </g>
      </svg>
    );
  }
}


ReactDOM.render(<SVGatch />, document.getElementById('root'));
