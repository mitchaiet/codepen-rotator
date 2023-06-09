<template>
  <div class="clock">
    <div class="container">
      <div class="days-pie-chart">
        <div :class="[{ active: activeDay === 1 }, 'day day--1']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 2 }, 'day day--2']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 3 }, 'day day--3']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 4 }, 'day day--4']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 5 }, 'day day--5']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 6 }, 'day day--6']">
          <div></div>
        </div>
        <div :class="[{ active: activeDay === 7 }, 'day day--7']">
          <div></div>
        </div>
      </div>

      <div class="days">
        <div :class="[{ active: activeDay === 1 }, 'day day--1']">
          <p class="text" aria-label="monday"><i>m</i><i>o</i><i>n</i></p>
        </div>
        <div :class="[{ active: activeDay === 2 }, 'day day--2']">
          <p class="text" aria-label="tuesday"><i>t</i><i>u</i><i>e</i></p>
        </div>
        <div :class="[{ active: activeDay === 3 }, 'day day--3']">
          <p class="text" aria-label="wednesday">
            <i>w</i><i>e</i
            ><i class="no-click-highlight" @dblclick="debugToggle">d</i>
          </p>
        </div>
        <div :class="[{ active: activeDay === 4 }, 'day day--4']">
          <p class="text" aria-label="thursday"><i>t</i><i>h</i><i>u</i></p>
        </div>
        <div :class="[{ active: activeDay === 5 }, 'day day--5']">
          <p class="text" aria-label="friday"><i>f</i><i>r</i><i>i</i></p>
        </div>
        <div :class="[{ active: activeDay === 6 }, 'day day--6']">
          <p class="text" aria-label="saturday"><i>s</i><i>a</i><i>t</i></p>
        </div>
        <div :class="[{ active: activeDay === 7 }, 'day day--7']">
          <p class="text" aria-label="sunday"><i>s</i><i>u</i><i>n</i></p>
        </div>
      </div>

      <div class="days-pie-chart-center-circle"></div>

      <div
        class="clock-day-info"
        :style="clockDayInfoStyle"
        v-show="showPercentages"
      >
        <div class="day" :style="clockDayInfoTextStyle">
          <div>
            <span class="number">{{ dayPercentageDisplay }}</span
            ><span>%</span>
          </div>
        </div>
      </div>
      <button
        class="clock-arm button"
        :style="clockArmStyle"
        @click="showPercentages = !showPercentages"
        aria-label="toggle percentage text"
      ></button>
      <div
        class="clock-arm-text"
        :style="clockArmStyleText"
        v-show="showPercentages"
      >
        <div class="clock-arm-text-inner" :style="clockArmInnerStyleText">
          <div>
            <div>Week {{ weekNumber }}</div>
            <span class="number">{{ weekPercentageDisplay }}</span
            ><span>%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="debug" v-if="isDebugActive">
      <span>Debug: </span>
      <label
        >auto-update clock:
        <input type="checkbox" v-model="isUpdateClockActive"
      /></label>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        @input="debugChangeRandeSlider"
      />
      <button @click="debugToggle">close</button>
    </div>
  </div>
</template>

<script>
const totalDaySeconds = 86400;
const totalWeekSeconds = 604800;
const daySeconds = 86400;
const hourSeconds = 3600;
const minuteSeconds = 60;

const dayAngle = 51.4285714286; // 360 deg / 7 days

export default {
  name: "DayClock",
  props: {},
  data() {
    return {
      activeDay: 0,
      weekPercentage: 0,
      dayPercentage: 0,
      weekNumber: 0,
      showPercentages: false,
      isUpdateClockActive: true,
      isDebugActive: false
    };
  },
  computed: {
    clockArmStyle() {
      return {
        transform: `rotate(${360 * this.weekPercentage}deg)`
      };
    },
    clockArmStyleText() {
      return {
        transform: `rotate(${360 * this.weekPercentage}deg)`
      };
    },
    clockArmInnerStyleText() {
      return {
        transform: `rotate(${-360 * this.weekPercentage}deg)`
      };
    },
    clockDayInfoStyle() {
      return {
        transform: `rotate(${-dayAngle / 2 + this.activeDay * dayAngle}deg)`
      };
    },
    clockDayInfoTextStyle() {
      return {
        transform: `rotate(${dayAngle / 2 + this.activeDay * -dayAngle}deg)`
      };
    },
    dayPercentageDisplay() {
      return Math.round(100 * this.dayPercentage);
    },
    weekPercentageDisplay() {
      return Math.round(100 * this.weekPercentage);
    }
  },
  methods: {
    updateClock(getDateMethod) {
      let { date, d, h, m, s } = getDateMethod();

      if (d === 0) d = 7; // Sunday is last

      let currentDaySeconds = h * hourSeconds + m * minuteSeconds + s;
      let currentWeekSeconds =
        (d - 1) * daySeconds + h * hourSeconds + m * minuteSeconds + s;

      this.activeDay = d;
      this.dayPercentage = currentDaySeconds / totalDaySeconds;
      this.weekPercentage = currentWeekSeconds / totalWeekSeconds;
      this.weekNumber = getWeekNumber(date);

      let title = `${this.weekPercentageDisplay}% Week`;
      document.title = title;
    },
    debugChangeRandeSlider(event) {
      let date = new Date();
      let first = new Date(2020, 1, 3, 0, 0, 0).getTime();
      let last = new Date(2020, 1, 9, 23, 59, 59).getTime();

      let day = rangeMap(event.target.value, 0, 100, first, last);

      let debugDate = new Date(day);

      this.updateClock(() => ({
        date, // for correct week number
        d: debugDate.getDay(),
        h: debugDate.getHours(),
        m: debugDate.getMinutes(),
        s: debugDate.getSeconds()
      }));
    },
    debugToggle() {
      this.isDebugActive = !this.isDebugActive;
      if (this.isDebugActive) this.isUpdateClockActive = false;
      if (!this.isDebugActive) this.isUpdateClockActive = true;
    }
  },
  created() {
    this.updateClock(getDate);
  },
  mounted() {
    const second = 1000;
    this.intervalKey = setInterval(() => {
      this.isUpdateClockActive && this.updateClock(getDate);
    }, 10 * second);
  },
  beforeDestroy() {
    clearInterval(this.intervalKey);
  }
};

function getDate() {
  let date = new Date();

  return {
    date,
    d: date.getDay(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
}

// https://stackoverflow.com/a/6117889/815507
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

// map value x in range [a,b] to [c,d]
function rangeMap(x, a, b, c, d) {
  if (a === b) return c;
  if (c === d) return c;
  return ((x - a) / (b - a)) * (d - c) + c;
}
</script>

<style lang="scss">
$color-1: #ff821c; //hotpink;
$color-2: #ff821c; //deeppink;
$color-3: #ffc8ff;
$size: 80vmin;
$day-angle: 51.4285714286deg; // 360 deg / 7 days
$day-skew: 38.5714285714deg; // 90 deg - $day-angle
$border-color: black;
$border-color: transparent;
$clock-arm-size: 4vmin;
$clock-arm-size-width: 4px;
$clock-arm-size-height: 12vmin;

$font-size: 8vmin;
$font-y: 1vmin;
$font-deg: 12deg;
$font-air: 3vmin;

// @debug 'hello from SCSS';

* {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 100%;
}
*,
:before,
:after {
  box-sizing: border-box;
}

body {
  font-family: "Roboto Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
  background: radial-gradient(transparent, rgba($color-3, 0.4));
}

.container {
  width: $size;
  height: $size;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 0 1px $border-color;
  _background: white;
}

button,
.button {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  border: none;
  box-shadow: none;
  background: transparent;
  outline: none;
}

.no-click-highlight {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  _cursor: pointer;
}

.clock {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.clock-arm {
  transform-origin: 50% 50%;
  position: absolute;
  top: calc(50% - #{$clock-arm-size / 2});
  left: calc(50% - #{$clock-arm-size / 2});
  width: $clock-arm-size;
  height: $clock-arm-size;
  background: $color-2;
  border-radius: 50%;

  &::before {
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    bottom: 0;
    left: calc(50% - #{$clock-arm-size-width/2});
    width: $clock-arm-size-width;
    border-radius: $clock-arm-size-width;
    height: $clock-arm-size-height;
    background: $color-2;
    z-index: -1;
  }
}
.clock-arm-text {
  $size: 12vmin;

  pointer-events: none;
  position: absolute;
  top: calc(50% - #{$size/2});
  left: calc(50% - #{$size/2});
  width: $size;
  height: $size;
  transform-origin: 50% 50%;
  .clock-arm-text-inner {
    transform-origin: 50% 50%;
    position: absolute;
    top: 100%;
    left: 0;
    width: 6em;
    height: $size;
    @media (min-height: 500px) and (min-width: 500px) {
      height: 3em;
    }
    text-align: left;
    color: $color-2;
    font-weight: bold;
    display: grid;
    place-items: center;
    font-size: 14px;
    @media (min-height: 500px) and (min-width: 500px) {
      font-size: 16px;
    }
  }

  .number {
    margin-right: 2px;
  }
}

.clock-day-info {
  pointer-events: none;
  position: absolute;
  height: $size / 3;
  width: 40px;
  bottom: calc(50%);
  left: calc(50% - 20px);
  transform-origin: 50% 100%;
  font-size: 14px;
  @media (min-height: 500px) and (min-width: 500px) {
    font-size: 16px;
  }

  .day {
    line-height: 1;
    text-align: center;
    border-radius: 50%;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: white;
    font-weight: bold;
    .number {
      margin-right: 2px;
    }
  }
}

.days-pie-chart-center-circle {
  display: none;
  $size2: $size / 3;
  position: absolute;
  top: calc(50% - #{$size2 / 2});
  left: calc(50% - #{$size2 / 2});
  width: $size2;
  height: $size2;
  background: white;
  border-radius: 50%;
  transform: rotate(45deg);
  box-shadow: 0 0 0 1px $border-color;
}

.days-pie-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: $size;
  height: $size;
  transform: rotate($day-skew);
  pointer-events: none;

  .day {
    position: absolute;
    box-shadow: 0 0 0 1px $border-color;
    width: $size;
    height: $size;
    width: 100%;
    height: 100%;
    transform-origin: 100% 100%;
    left: calc(50% - #{$size});
    top: calc(50% - #{$size});
    transition: background 500ms;
    pointer-events: all;

    > div {
      position: absolute;
      background: rgba($color-3, 1);
      top: 0;
      left: 0;
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }

    @for $i from 1 through 7 {
      &--#{$i} {
        transform: rotate($day-angle * $i) skew($day-skew);
      }
    }

    &.active {
      background: radial-gradient(transparent, rgba($color-1, 1), transparent);
      > div {
        background: transparent;
      }
    }
  }
}

.days {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: $size;
  height: $size;
  transform: rotate(-26deg);

  .day {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: $size;
    height: $size;
    text-align: center;
    color: gray;
    transition: color 500ms;

    @for $i from 1 through 7 {
      &--#{$i} {
        transform: rotate($day-angle * $i);
      }
    }

    &.active {
      color: white;
    }

    .text {
      pointer-events: all;
      padding-top: $font-air;
      user-select: none;
      text-transform: uppercase;

      font-weight: bold;
      outline: 1px solid $border-color;
      line-height: 1;

      i {
        font-size: $font-size;
        line-height: inherit;
        font-style: normal;
        display: inline-block;
        min-width: 0.8em;
        _outline: 1px solid $border-color;

        &:nth-child(1) {
          transform: rotate(-$font-deg);
        }
        &:nth-child(2) {
          transform: translateY(-$font-y);
        }
        &:nth-child(3) {
          transform: rotate($font-deg);
        }
      }
    }
    &--3,
    &--4,
    &--5 {
      .text {
        padding-top: 0;
        padding-bottom: $font-air;
        transform: rotate(0.5turn);

        i {
          &:nth-child(1) {
            transform: rotate($font-deg);
          }
          &:nth-child(2) {
            transform: translateY($font-y);
          }
          &:nth-child(3) {
            transform: rotate(-$font-deg);
          }
        }
      }
    }
  }
}

.debug {
  position: absolute;
  top: 4px;
  right: 4px;
  input[type="range"] {
    margin-left: 2px;
    margin-right: 6px;
  }
  button {
    box-shadow: 0 0 0 1px gray;
    padding: 4px 8px;
  }
}
</style>
