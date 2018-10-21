import React, { Component, Fragment } from "react";
import { Spring, Parallax, ParallaxLayer, config } from "react-spring";
import moment from "moment";
import Loading from "./Loading.js"
import StockChart from "./StockChart.js"

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
            // <div className={"clock clock-" + (this.state.stockMarketActive ? "green" : "red")}>{this.state.time} <small>{this.state.amPm}</small></div>
            <div className="box bg-purple">
                <h2>{this.state.time} <small>{this.state.amPm}</small></h2>
            </div>
        )
    }
}

export default class Company extends Component {
    componentDidUpdate(prevProps) {
        if (this.parallax && this.props && prevProps && this.props.index !== prevProps.index) {
            console.log(this.props.index);

            this.parallax.scrollTo(this.props.index);
        }
    }

    render() {
        // if (!this.props.stockData) {
        //     return (
        //         <Loading />
        //     );
        // }

        let today;
        let yesterday;
        let diff;
        let percentDiff;

        if (this.props.stockData) {
            today = this.props.stockData[0].close || this.props.stockData[0].open;
            yesterday = this.props.stockData[1].close;
            diff = Math.round((today - yesterday) * 100) / 100;
            percentDiff = Math.round(diff / yesterday * 100 * 100) / 100;
            if (diff >= 0) diff = "+" + diff;
            else diff = "-" + diff;
        }

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
                    {this.props.stockData === undefined && <Fragment>
                        <ParallaxLayer className="stock-info-slide" offset={0} speed={0} onClick={e => this.parallax.scrollTo(1)}>
                            <div className="flex flex-align center">
                                <h1>Loading stock data...</h1>
                            </div>
                        </ParallaxLayer>
                    </Fragment>}

                    {this.props.stockData === false && <Fragment>
                        <ParallaxLayer className="stock-info-slide" offset={0} speed={0} onClick={e => this.parallax.scrollTo(1)}>
                            <div className="flex flex-align center">
                                <h1>Failed to load stock data.<br />Please restart app and try again.</h1>
                            </div>
                        </ParallaxLayer>
                    </Fragment>}

                    {this.props.stockData && <Fragment>
                        <ParallaxLayer className="stock-info-slide" offset={0} speed={0} onClick={e => this.parallax.scrollTo(1)}>
                            <div className="flex grow-0">
                                <div className="box bg-aqua" style={{ width: "500px" }}>
                                    <h3>Company Info</h3>
                                    <p>{this.props.description}</p>

                                    <h3>CEO</h3>
                                    <p>{this.props.ceo}</p>
                                </div>

                                <div className="box flex flex-column">
                                    <Clock />

                                    <div className="box bg-gold">
                                        <h3>CURRENT PRICE</h3>
                                        <h1>${this.props.stockData[0].close || this.props.stockData[0].open}</h1>
                                    </div>

                                    <div className="box bg-aqua text-medium">
                                        <h2>{diff} <small>({percentDiff}%)</small></h2>
                                    </div>
                                </div>
                            </div>
                        </ParallaxLayer>

                        <ParallaxLayer className="stock-info-slide" offset={1} speed={0} onClick={e => this.parallax.scrollTo(0)}>
                            <h2>Stock History</h2>
                            <StockChart data={this.props.stockData} />
                        </ParallaxLayer>
                    </Fragment>}
                </Parallax>}
            </ParallaxLayer>
        )
    }
}