// Inspired by Corey Haggards "Screeners"
// https://dribbble.com/shots/4138489-Screeners

import React, { Component, Fragment } from "react";
import { Spring, Parallax, ParallaxLayer, config } from "react-spring";
import moment, { isDuration } from "moment";
import { Line } from "react-chartjs-2";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import Leap from "leapjs";


class Clock extends Component {
    update = () => {
        let now = moment();

        this.setState({
            time: now.format("h:mm:ss"),
            amPm: now.format("A"),
            stockMarketActive: false // TODO Dynamic
        });
    };

    componentWillMount() {
        this.taskId = setInterval(this.update, 1000);
        this.update();
    }

    componentWillUnmount() {
        clearInterval(this.taskId);
    }

    render() {
        return (
            <div className={"clock clock-" + (this.state.stockMarketActive ? "green" : "red")}>{this.state.time} <small>{this.state.amPm}</small></div>
        )
    }
}

const randomData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Random Test Data',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

const ChartTesting = props => (
    <Line data={randomData} />
)

class Company extends Component {
    render() {
        return (
            <ParallaxLayer className={"company-container" + (this.props.expanded ? " expanded" : "")} offset={this.props.offset} speed={0} onClick={this.props.onClick}>
                <h1 className="company-name">{this.props.company}</h1>
                <h2 className="company-ticker">{this.props.ticker}</h2>
                <img className={"company-logo" + (this.props.logoType ? " logo-" + this.props.logoType : "")} src={this.props.logo} />

                {this.props.expanded && <Parallax
                    className="stock-info-slides"
                    ref={e => this.parallax = e}
                    pages={2}
                    horizontal scrolling={false}
                    config={config.slow}
                >
                    <ParallaxLayer className="stock-info-slide" offset={0} speed={0} onClick={e => this.parallax.scrollTo(1)}>
                        <div className="flex">
                            <div className="box flex flex-column">
                                <div className="box bg-aqua">
                                    <h3>CURRENT PRICE</h3>
                                    <h1>$1,105.18</h1>
                                </div>

                                <div className="box bg-gold text-medium">
                                    <h2>+7.27 (0.66%)</h2>
                                </div>
                            </div>

                            <div className="box">
                                <ChartTesting />
                            </div>
                        </div>
                        <Clock />
                        <h2> ^ Testing clock</h2>
                    </ParallaxLayer>

                    <ParallaxLayer className="stock-info-slide" offset={1} speed={0} onClick={e => this.parallax.scrollTo(0)}>
                        <h2>Test Data</h2>
                        <ChartTesting />
                    </ParallaxLayer>
                </Parallax>}
            </ParallaxLayer>
        )
    }
}

const Loading = props => (
    <div className="loading">
        {/* <LinearProgress variant="query" color="blue" /> */}
        <CircularProgress size={120} />
    </div>
);

export default class MainSlider extends Component {
    state = {
        index: 0,
        expanded: false
    };

    setPage = index => {
        if (!this.state.companies) return;

        if (index < 0) {
            index = this.state.companies.length - 1;
        } else if (index >= this.state.companies.length) {
            index = 0;
        }

        this.setState({ index });
        this.parallax.scrollTo(index);
    }

    triggerInteraction = keyCode => {
        let now = Date.now();
        if (this.state.lastInteraction && now - this.state.lastInteraction < 500) return;
        document.dispatchEvent(new KeyboardEvent("keydown", { keyCode }));
        console.log("[DEBUG] Triggering key code", keyCode);
        this.setState({ lastInteraction: now });
    }

    componentDidMount() {
        // Fetch companies
        fetch("/api/companies")
            .then(response => response.json())
            .then(companies => {
                console.log("Loaded companies", companies);
                this.setState({ companies });
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
            console.log("leapmotion:sucessful connection");
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
                if (this.state.expanded) return;
                this.setPage(this.state.index - 1);
            } else if (event.keyCode === 38) {
                // Up arrow
                this.setState({ expanded: false });
            } else if (event.keyCode === 39) {
                // Right arrow
                if (this.state.expanded) return;
                this.setPage(this.state.index + 1);
            } else if (event.keyCode === 40) {
                // Down arrow
                this.setState({ expanded: true });
            }
        });
    }

    render() {
        if (!this.state.companies) {
            return (
                <Loading />
            );
        }

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
                        />
                    ))}
                </Parallax>}
            </Fragment>
        );
    }
}