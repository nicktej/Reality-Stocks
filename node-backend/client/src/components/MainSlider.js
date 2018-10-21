// Inspired by Corey Haggards "Screeners"
// https://dribbble.com/shots/4138489-Screeners

import React, { Component, Fragment } from "react";
import { Spring, Parallax, ParallaxLayer, config } from "react-spring";
import moment from "moment";
import { Line } from "react-chartjs-2";

const COMPANIES = [
    {
        company: "Alphabet Inc",
        ticker: "GOOGL",
        logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        gradient: ["#FF1493", "#FF7F50"]
    },
    {
        company: "Starbucks Corporation",
        ticker: "SBUX",
        logo: "https://assets-starbucks.netdna-ssl.com/img/starbucks-newsroom.svg",
        logoType: "square",
        gradient: ["#6A5ACD", "#00BFFF"]
    }
];

class Clock extends Component {
    componentWillMount() {
        this.taskId = setInterval(() => {
            let now = moment();

            this.setState({
                time: now.format("h:mm:ss"),
                amPm: now.format("A")
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.taskId);
    }

    render() {
        if (!this.state) return null;

        return (
            <div className="clock clock-green">{this.state.time} <small>{this.state.amPm}</small></div>
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

                <Parallax
                    className="stock-info-slides"
                    ref={e => this.parallax = e}
                    pages={2}
                    horizontal scrolling={false}
                    config={config.slow}
                >
                    <ParallaxLayer offset={0} speed={0} onClick={e => this.parallax.scrollTo(1)}>
                        <Clock />
                    </ParallaxLayer>

                    <ParallaxLayer offset={1} speed={0} onClick={e => this.parallax.scrollTo(0)}>
                        <ChartTesting />
                    </ParallaxLayer>
                </Parallax>
            </ParallaxLayer>
        )
    }
}

export default class MainSlider extends Component {
    state = {
        index: 0,
        expanded: false
    };

    setPage = index => {
        if (index < 0) {
            index = COMPANIES.length - 1;
        } else if (index >= COMPANIES.length) {
            index = 0;
        }

        this.setState({ index });
        this.parallax.scrollTo(index);
    }

    componentDidMount() {
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
        let currentCompany = COMPANIES[this.state.index];

        return (
            <Spring
                from={{
                    color: "black",
                    gradientMove: 500,
                }}
                to={{
                    gradientStart: currentCompany.gradient[0],
                    gradientEnd: currentCompany.gradient[1],
                    gradientMove: 0
                }}
                reset
                // config={{ tension: 25, friction: 8 }}
                config={config.wobbly}
            >
                {props => (
                    <Parallax
                        className="companies-container"
                        style={{
                            background: this.state.expanded ? ("linear-gradient(to bottom, " + props.gradientEnd + " 0%, white " + props.gradientMove + "%)") : ("linear-gradient(to right, " + props.gradientStart + " 0%, " + props.gradientEnd + " 100%)"),
                        }}
                        ref={e => this.parallax = e}
                        pages={COMPANIES.length}
                        horizontal scrolling={false}
                        config={{ tension: 30, friction: 15 }}
                    >
                        {COMPANIES.map((company, index) => (
                            <Company
                                key={company.ticker}
                                offset={index}
                                {...company}
                                expanded={this.state.expanded && this.state.index === index}
                            />
                        ))}
                    </Parallax>
                )}
            </Spring>
        );
    }
}