// Inspired by Corey Haggards "Screeners"
// https://dribbble.com/shots/4138489-Screeners

import React, { Component, Fragment } from "react";
import { Spring, Parallax, ParallaxLayer, config } from "react-spring";
import moment, { isDuration } from "moment";
import { Line } from "react-chartjs-2";
import Leap from "leapjs";
import StockChart from "./StockChart.js";
import Company from "./Company.js";
import Loading from "./Loading.js";

export default class MainSlider extends Component {
    state = {
        index: 0,
        subPageIndex: 0,
        expanded: false,
        companyStockData: []
    };

    setPage = index => {
        if (!this.state.companies) return;

        if (index < 0) {
            index = this.state.companies.length - 1;
        } else if (index >= this.state.companies.length) {
            index = 0;
        }

        this.setState({ index, subPageIndex: 0 });
        this.parallax.scrollTo(index);
    }

    setSubPage = subPageIndex => {
        if (!this.state.companies) return;

        if (subPageIndex < 0) {
            subPageIndex = 1; // Hardcoding 2 sub pages
        } else if (subPageIndex >= 2) {
            subPageIndex = 0;
        }

        this.setState({ subPageIndex });
    }

    triggerInteraction = keyCode => {
        let now = Date.now();
        if (this.state.lastInteraction && now - this.state.lastInteraction < 500) return;
        document.dispatchEvent(new KeyboardEvent("keydown", { keyCode }));
        console.log("[DEBUG] Triggering key code", keyCode);
        this.setState({ lastInteraction: now });
    }

    updateStockData = ticker => {
        fetch("/api/stock/" + ticker + "/daily")
            .then(response => response.json())
            .then(response => {
                this.setState(state => ({
                    companyStockData: {
                        ...state.companyStockData,
                        [ticker]: response.success ? response.data : false
                    }
                }));
            });
    }

    componentDidMount() {
        // Fetch companies
        fetch("/api/companies")
            .then(response => response.json())
            .then(companies => {
                console.log("Loaded companies", companies);
                this.setState({ companies });
                companies.forEach(company => this.updateStockData(company.ticker))
            });

        var debug = 0;            // increasing level of debug output
        var numSwipes = 0;        // total count of swipes seen
        var numSwipesLeft = 0;
        var numSwipesRight = 0;
        var numTaps = 0;
        var numKeyTaps = 0;
        var numCircles = 0;

        var controller = new Leap.Controller({ enableGestures: true });

        controller.on('connect', function () {
            console.log("leapmotion:successful connection");
            foundLeap(); // let the user know we found it
        });

        controller.on('deviceConnected', function () {
            console.log("leapmotion:leap device has been connected");
        });

        controller.on('deviceDisconnected', function () {
            console.log("leapmotion:device disconnect");
        });

        controller.on('gesture', gesture => {
            if (gesture.type == 'swipe') {
                handleSwipe(gesture);
                console.log("swipe");
                this.triggerInteraction(39);
            } else if (gesture.type == 'screenTap') {
                console.log("screenTap");
                handleTap(gesture);
                this.triggerInteraction(40);
            } else if (gesture.type == 'keyTap') {
                console.log("keyTap");
                handleKeyTap(gesture);
                this.triggerInteraction(40);
            } else if (gesture.type == 'circle') {
                handleCircle(gesture);
                console.log("help");
                this.triggerInteraction(38);
            }
        });

        // this is where start using the leap (if one is detected)
        controller.connect();

        // this function is called when we want to handle a swipe gesture,
        // we are just going to keep a few counts of what was detected
        function handleSwipe(swipe) {
            if (swipe.state == 'stop') {
                if (debug > 0) console.log("found a swipe, " + numSwipes);
                numSwipes++;

                // the swipe object will tell us which direction the swipe was in
                if (swipe.direction[0] > 0) {
                    numSwipesRight++;
                } else {
                    numSwipesLeft++;
                }
            }

            // update the webpage with out current count data
            refreshCounts();
        }

        function handleTap(tap) {
            if (debug > 0) console.log("found a tap, " + numTaps);
            numTaps++;

            // update the webpage with out current count data
            refreshCounts();
        }

        function handleKeyTap(tap) {
            if (debug > 0) console.log("found a key tap, " + numKeyTaps);
            numKeyTaps++;

            // update the webpage with out current count data
            refreshCounts();
        }

        function handleCircle(circle) {
            if (debug > 0) console.log("found a cricle, " + numCircles);
            numCircles++;

            refreshCounts();
        }

        function foundLeap() {
            var element = document.getElementById("foundLeap");
            element.innerHTML = "Hey, you've got a LeapMotion attached, cool! Try swiping left and right";
        }

        function refreshCounts() {
            var element = document.getElementById("counters");
            element.innerHTML = "numSwipes " + numSwipes + ", left " + numSwipesLeft + ", right " + numSwipesRight + ", taps " + numTaps + ", key taps " + numKeyTaps + ", circles " + numCircles;
        }

        document.addEventListener("keydown", event => {
            if (event.keyCode === 37) {
                // Left arrow
                if (this.state.expanded) {
                    this.setSubPage(this.state.subPageIndex - 1);
                } else {
                    this.setPage(this.state.index - 1);
                }
            } else if (event.keyCode === 38) {
                // Up arrow
                this.setState({ expanded: false });
            } else if (event.keyCode === 39) {
                // Right arrow
                if (this.state.expanded) {
                    this.setSubPage(this.state.subPageIndex + 1);
                } else {
                    this.setPage(this.state.index + 1);
                }
            } else if (event.keyCode === 40) {
                // Down arrow
                this.setState({ expanded: true });
            }
        });
    }

    render() {
        if (!this.state.companies) {
            return (
                <div className="flex flex-column align-center">
                    <Loading fullScreen />
                </div>
            );
        }

        console.log(this.state);

        let currentCompany = this.state.companies[this.state.index];

        return (
            <Fragment>
                <Spring
                    from={{
                        color: "black",
                        gradientMove: 100,
                    }}
                    to={{
                        gradientStart: currentCompany.gradient[0],
                        gradientEnd: currentCompany.gradient[1],
                        gradientMove: 0
                    }}
                    reset
                    config={config.slow}
                >
                    {props => (
                        <div
                            className="background"
                            style={{
                                background: this.state.expanded ? ("linear-gradient(to bottom, " + props.gradientEnd + " 0%, white " + props.gradientMove + "%)") : ("linear-gradient(to right, " + props.gradientStart + " 0%, " + props.gradientEnd + " 100%)"),
                            }}
                        />
                    )}
                </Spring>

                {this.state.companies && <Parallax
                    className="companies-container"
                    ref={e => this.parallax = e}
                    pages={this.state.companies.length}
                    horizontal scrolling={false}
                    config={{ tension: 30, friction: 15 }}
                >
                    {this.state.companies.map((company, index) => (
                        <Company
                            key={company.ticker}
                            offset={index}
                            {...company}
                            expanded={this.state.expanded && this.state.index === index}
                            stockData={this.state.companyStockData[company.ticker]}
                            updateStockData={() => this.updateStockData(company.ticker)}
                            index={this.state.subPageIndex}
                        />
                    ))}
                </Parallax>}
            </Fragment>
        );
    }
}