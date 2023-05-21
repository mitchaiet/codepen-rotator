function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}import React from 'https://cdn.skypack.dev/react';
import { render } from 'https://cdn.skypack.dev/react-dom';
import gsap from 'https://cdn.skypack.dev/gsap@3.11.0';

console.clear();

const POP = new Audio('https://assets.codepen.io/605876/pop.mp3');

const Cloud = ({ id, x, size, flipped, speed, delay, z }) => {
  return /*#__PURE__*/(
    React.createElement("svg", {
      className: "cloud",
      viewBox: "0 0 855 544",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: {
        '--x': x,
        '--speed': speed,
        '--size': size,
        '--delay': delay,
        '--flipped': flipped,
        '--z': z } }, /*#__PURE__*/


    React.createElement("path", {
      d: "M458 0C499.817 0 537.472 17.8242 563.779 46.291C567.659 46.0977 571.567 46 575.5 46C692.308 46 787 132.409 787 239C787 248.31 786.277 257.465 784.881 266.422C826.391 284.906 855 323.894 855 369C855 431.961 799.259 483 730.5 483C707.731 483 686.39 477.403 668.027 467.631C629.401 514.036 568.285 544 499.5 544C448.311 544 401.37 527.405 364.783 499.79C348.99 505.743 331.875 509 314 509C256.452 509 206.789 475.243 183.732 426.449C171.112 430.064 157.782 432 144 432C64.4712 432 0 367.529 0 288C0 208.471 64.4712 144 144 144C146.961 144 149.902 144.09 152.819 144.266C173.069 89.2441 225.952 50 288 50C306.708 50 324.583 53.5674 340.982 60.0596C367.119 23.6885 409.793 0 458 0Z",
      fill: "white" })));



};

const BalloonBear = ({ id, x, hue, speed, onFinish, size, flipped, main, z }) => {
  const balloonRef = React.useRef(null);
  const bearRef = React.useRef(null);
  React.useEffect(() => {
    if (!main) {
      gsap.to(bearRef.current, {
        y: -window.innerHeight * 1.5,
        duration: speed,
        ease: 'none',
        onComplete: () => {
          if (onFinish) onFinish(id);
        } });

      balloonRef.current.addEventListener('click', () => {
        console.info('pop');
        gsap.set(balloonRef.current, { transformOrigin: '50% 50%' });
        POP.pause();
        POP.currentTime = 0;
        POP.play();
        gsap.timeline().
        to(balloonRef.current, {
          scale: 2,
          opacity: 0,
          duration: 0.1,
          transformOrigin: '50% 50%' }).

        to(bearRef.current, {
          y: '100vh',
          yPercent: -100,
          duration: 1,
          onComplete: () => {
            if (onFinish) onFinish(id);
          } });

      });
    }
  }, []);
  return /*#__PURE__*/(
    React.createElement("svg", {
      ref: bearRef,
      className: "balloon-bear",
      "data-balloon-bear-static": main,
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 885 1059",
      style: {
        '--x': x,
        '--hue': hue,
        '--speed': speed,
        '--size': size,
        '--flipped': flipped,
        '--z': z } }, /*#__PURE__*/


    React.createElement("g", { className: "balloon-bear__arm" }, /*#__PURE__*/
    React.createElement("rect", {
      width: 115,
      height: 52,
      x: "527.5",
      y: "961.5",
      fill: "#AF7128",
      stroke: "#000",
      strokeWidth: 6,
      rx: 26,
      transform: "rotate(-90 527.5 961.5)" }), /*#__PURE__*/

    React.createElement("path", {
      fill: "#000",
      d: "M551.674 948.205a3 3 0 1 0-6 0h6Zm0 12v-12h-6v12h6ZM564.34 948.205a3 3 0 1 0-6 0h6Zm0 12v-12h-6v12h6Z" })), /*#__PURE__*/


    React.createElement("path", {
      fill: "#AF7128",
      d: "M505.653 673.433c-8.572-14.183-6.748-32.879 5.479-45.106 14.388-14.387 37.731-14.37 52.14.038 10.153 10.153 13.16 24.742 9.017 37.509 13.071 3.917 25.39 11.04 35.718 21.369l14.163 14.162c10.282 10.283 17.388 22.537 21.316 35.542 12.744-4.098 27.287-1.081 37.415 9.048 14.409 14.408 14.426 37.752.039 52.14-12.179 12.178-30.774 14.036-44.935 5.581a84.968 84.968 0 0 1-13.747 17.985l-47.065 47.066-77.583 77.583a36.986 36.986 0 0 0-5.206 6.541l-15.761 25.197c-3.205 5.125-6.75 10.464-12.384 12.655-7.889 3.068-17.198 1.412-23.575-4.965l-13.115-11.847-7.404-6.859-9.004-9.24c-8.605-8.604-5.835-20.208-1.016-30.609l13.314-23.061c-2.048-1.407-4.711-4.694-6.52-6.503-1.563-1.563-3.05-4.787-4.312-6.531L397.298 912.3c-6.512 8.418-20.24 9.852-28.844 1.247l-26.204-25.523c-8.604-8.604-15.463-21.052-4.977-36.77l46.35-60.011a29.027 29.027 0 0 1-1.286-8.551l-.046-63.046c-.012-16.028 12.972-29.012 29-29 16.028.012 29.03 13.014 29.042 29.042l.011 14.834 47.367-47.367a84.962 84.962 0 0 1 17.942-13.722Z" }), /*#__PURE__*/

    React.createElement("path", {
      stroke: "#000",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 6,
      d: "m575.193 868.767 47.065-47.066a84.968 84.968 0 0 0 13.747-17.985c14.161 8.455 32.756 6.597 44.935-5.581 14.387-14.388 14.37-37.732-.039-52.14-10.128-10.129-24.671-13.146-37.415-9.048-3.928-13.005-11.034-25.259-21.316-35.542l-14.163-14.162c-10.328-10.329-22.647-17.452-35.718-21.369 4.143-12.767 1.136-27.356-9.017-37.509-14.409-14.408-37.752-14.425-52.14-.038-12.227 12.227-14.051 30.923-5.479 45.106a84.962 84.962 0 0 0-17.942 13.722l-47.367 47.367-.011-14.834c-.012-16.028-13.014-29.03-29.042-29.042-16.028-.012-29.012 12.972-29 29l.046 63.046a29.027 29.027 0 0 0 1.286 8.551l-46.35 60.011c-10.486 15.718-3.627 28.166 4.977 36.77l26.204 25.523c8.604 8.605 22.332 7.171 28.844-1.247l15.329-21.172c1.262 1.744 2.749 4.968 4.312 6.531 1.809 1.809 4.472 5.096 6.52 6.503l-13.314 23.061c-4.819 10.401-7.589 22.005 1.016 30.609l9.004 9.24 7.404 6.859 13.115 11.847c6.377 6.377 15.685 8.033 23.575 4.965 5.634-2.191 9.179-7.53 12.384-12.655l15.761-25.197a36.986 36.986 0 0 1 5.206-6.541l39.815-39.815" }), /*#__PURE__*/

    React.createElement("path", {
      fill: "#000",
      d: "M411.783 705.187a3.005 3.005 0 0 0 3.002 3.002 2.994 2.994 0 0 0 2.998-2.997l-6-.005Zm-.009-12.009.009 12.009 6 .005-.009-12.009-6-.005ZM399.676 705.178a3.006 3.006 0 0 0 3.002 3.003 2.995 2.995 0 0 0 2.998-2.998l-6-.005Zm-.009-12.008.009 12.008 6 .005-.009-12.009-6-.004Z" }), /*#__PURE__*/

    React.createElement("path", {
      className: "balloon-bear__strap",
      fill: "#FF1E1E",
      d: "m541.738 702.92 62.579 62.579-9.37 9.37-62.578-62.58z" }), /*#__PURE__*/

    React.createElement("path", {
      fill: "#000",
      fillRule: "evenodd",
      d: "M650.156 753.094c2.526 22.882-6.427 46.109-20.821 60.503l-43.655-43.655c9.604-9.727 9.566-25.397-.114-35.077l-13.194-13.194c-9.68-9.68-25.35-9.718-35.077-.114l-43.44-43.44c14.394-14.394 37.621-23.347 60.503-20.821 22.881 2.525 45.829 14.037 63.795 32.003s29.478 40.914 32.003 63.795Z",
      clipRule: "evenodd" }), /*#__PURE__*/

    React.createElement("g", { className: "balloon-bear__eye" }, /*#__PURE__*/
    React.createElement("ellipse", {
      cx: "582.096",
      cy: "803.26",
      fill: "#000",
      rx: "8.091",
      ry: "8.079",
      transform: "rotate(45 582.096 803.26)" })), /*#__PURE__*/


    React.createElement("g", { className: "balloon-bear__eye" }, /*#__PURE__*/
    React.createElement("ellipse", {
      cx: "505.202",
      cy: "726.366",
      fill: "#000",
      rx: "8.091",
      ry: "8.079",
      transform: "rotate(45 505.202 726.366)" })), /*#__PURE__*/


    React.createElement("path", {
      fill: "#000",
      d: "M548.047 789.863c-5.806 5.806-19.328 5.352-27.101-2.421s-8.227-21.295-2.421-27.101c5.805-5.805 15.671-1.695 23.444 6.078 7.773 7.773 11.883 17.639 6.078 23.444Z" }), /*#__PURE__*/

    React.createElement("path", {
      stroke: "#000",
      strokeLinecap: "round",
      strokeWidth: 6,
      d: "m430.374 955.873-8.486 8.485M447.369 972.869l-8.485 8.485M357.435 882.935l-8.485 8.485M374.43 899.93l-8.485 8.485M426.5 821.5l-5-376" }), /*#__PURE__*/

    React.createElement("g", { ref: balloonRef, className: "balloon" }, /*#__PURE__*/
    React.createElement("circle", {
      className: "balloon-bear__balloon",
      cx: "421.5",
      cy: "273.5",
      r: 169,
      fill: "#D52828",
      fillOpacity: ".5",
      stroke: "#000",
      strokeWidth: 6 }), /*#__PURE__*/

    React.createElement("path", {
      className: "balloon-bear__balloon",
      fill: "#F20000",
      fillOpacity: ".5",
      stroke: "#000",
      strokeLinejoin: "round",
      strokeWidth: 6,
      d: "M405.5 444.5H437l9.5 20h-50l9-20Z" }), /*#__PURE__*/

    React.createElement("path", {
      stroke: "#fff",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeOpacity: ".5",
      strokeWidth: 30,
      d: "M384.118 142.738a136.004 136.004 0 0 0-98.123 119.174" })), /*#__PURE__*/


    React.createElement("path", {
      stroke: "#000",
      strokeLinecap: "round",
      strokeWidth: 6,
      d: "m380 757 62-42" })));




};

const CLOUDS = new Array(10).fill().map(() => {
  return {
    id: crypto.randomUUID(),
    x: gsap.utils.random(-0.2, 1.2),
    size: gsap.utils.random(20, 60, 1),
    speed: gsap.utils.random(10, 60, 0.1),
    delay: gsap.utils.random(-30, 20, 0.1),
    flipped: Math.random() > 0.5 ? 1 : 0,
    z: gsap.utils.random(0, 10) };

});

const App = () => {
  const [bears, setBears] = React.useState([]);

  const onFinish = id => {
    setBears(bears => bears.filter(bear => bear.id !== id));
  };

  const addBear = () => {
    setBears(oldBears => [...oldBears, {
      id: crypto.randomUUID(),
      x: gsap.utils.random(0, 1),
      hue: gsap.utils.random(0, 359, 1),
      size: gsap.utils.random(10, 40, 1),
      speed: gsap.utils.random(2, 20, 0.1),
      flipped: Math.random() > 0.5 ? 1 : 0,
      z: gsap.utils.random(0, 10, 1),
      onFinish }]);

  };

  React.useEffect(() => {
    document.body.addEventListener('click', addBear);
  }, []);

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement(BalloonBear, { main: true }),
    bears.map(bear => {
      return /*#__PURE__*/React.createElement(BalloonBear, _extends({ key: bear.id }, bear));
    }),
    CLOUDS.map(cloud => {
      return /*#__PURE__*/React.createElement(Cloud, _extends({ key: cloud.id }, cloud));
    })));


};

render( /*#__PURE__*/React.createElement(App, null), document.querySelector('#app'));