import React, { Component } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";

export default class StockChart extends Component {
    render() {
        let chartData = {
            labels: this.props.data.map(data => data.date),
            datasets: [
                {
                    label: "Daily Closing Price",
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
                    data: this.props.data.map(data => data.close)
                },

                // {
                //     label: "Daily Volume",
                //     fill: false,
                //     lineTension: 0.1,
                //     backgroundColor: 'rgba(208, 17, 217,0.4)',
                //     borderColor: 'rgba(208, 17, 217,1)',
                //     borderCapStyle: 'butt',
                //     borderDash: [],
                //     borderDashOffset: 0.0,
                //     borderJoinStyle: 'miter',
                //     pointBorderColor: 'rgba(208, 17, 217,1)',
                //     pointBackgroundColor: '#fff',
                //     pointBorderWidth: 1,
                //     pointHoverRadius: 5,
                //     pointHoverBackgroundColor: 'rgba(208, 17, 217,1)',
                //     pointHoverBorderColor: 'rgba(220,220,220,1)',
                //     pointHoverBorderWidth: 2,
                //     pointRadius: 1,
                //     pointHitRadius: 10,
                //     data: this.props.data.map(data => data.volume)
                // }
            ]
        };

        return (
            <div style={{ width: "80%" }}>
                <Line data={chartData} />
            </div>
        );
    }
}