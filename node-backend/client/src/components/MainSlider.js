// Inspired by Corey Haggards "Screeners"
// https://dribbble.com/shots/4138489-Screeners

import React, { Component, Fragment } from "react";
import { Spring, Parallax, ParallaxLayer } from "react-spring";
import moment from "moment";

const COMPANIES = [
    {
        company: "Alphabet Inc",
        ticker: "GOOGL",
        gradient: ["#FF1493", "#FF7F50"]
    },
    {
        company: "Starbucks Corporation",
        ticker: "SBUX",
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

    componentDidUnmount() {
        clearInterval(this.taskId);
    }

    render() {
        if (!this.state) return null;

        return (
            <div className="clock clock-green">{this.state.time} <small>{this.state.amPm}</small></div>
        )
    }
}

class Company extends Component {
    render() {
        return (
            <ParallaxLayer className={"company-container" + (this.props.expanded ? " expanded" : "")} offset={this.props.offset} speed={0} onClick={this.props.onClick}>
                <h1 className="company-name">{this.props.company}</h1>
                <h2 className="company-ticker">{this.props.ticker}</h2>

                <div className="stock-info-slides">
                    SAMPLE STUFF HERE
                    <Clock />
                </div>
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
                    gradientMove: 100,
                }}
                to={{
                    gradientStart: currentCompany.gradient[0],
                    gradientEnd: currentCompany.gradient[1],
                    gradientMove: 0
                }}
                reset
                config={{ tension: 25, friction: 8 }}
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