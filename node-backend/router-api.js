const express = require("express");
const fetch = require("node-fetch");
var router = module.exports = express.Router();
var cache;

const queryAPI = (functionName, symbol, extra) => {
    return fetch(`https://www.alphavantage.co/query?apikey=${ALPHAVANTAGE_API_KEY}&function=${functionName}&symbol=${symbol}${extra ? "?" + extra : ""}`).then(response => response.json());
}

const ALPHAVANTAGE_API_KEY = "ZYVKYF0NSPIXY9A1"

const COMPANIES = [
    {
        company: "Alphabet Inc",
        ticker: "GOOGL",
        logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        // gradient: ["#FF1493", "#FF7F50"]
        gradient: ["#232526", "#414345"],

    },
    {
        company: "Microsoft Corporation",
        ticker: "MSFT",
        logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
        gradient: ["#6A5ACD", "#00BFFF"],
        description: "Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports and sells computer software, consumer electronics, personal computers, and related services.",
        ceo: "Satya Nadella (Feb 4, 2014-)"
    },
    {
        company: "Starbucks Corporation",
        ticker: "SBUX",
        logo: "https://assets-starbucks.netdna-ssl.com/img/starbucks-newsroom.svg",
        logoType: "square",
        gradient: ["#141E30", "#243B55"]
    }
];

router.use("/companies", (req, res) => {
    setTimeout(() => res.send(COMPANIES), 2000);
});

router.use("/stock/:ticker/:scale", (req, res) => {
    const { ticker, scale } = req.params;

    document.onkeydown = e => console.log("Key pressed", e.keyCode);
    const triggerKeyDown = keyCode => document.dispatchEvent(new KeyboardEvent("keydown", { keyCode }));
    triggerKeyDown(39);

    if (scale === "daily") {
        return queryAPI("TIME_SERIES_DAILY", ticker).then(data => {
            let response = {
                ticker,
                scale,
                data: Object.keys(data["Time Series (Daily)"]).map(date => {
                    let dateData = data["Time Series (Daily)"][date];

                    return {
                        date,
                        open: dateData["1. open"],
                        high: dateData["2. high"],
                        low: dateData["3. low"],
                        close: dateData["4. close"],
                        volume: dateData["5. volume"]
                    }
                })
            };

            return res.send(response);
        });
    } else if (scale === "weekly") {
        return queryAPI("TIME_SERIES_WEEKLY", ticker).then(data => {
            let response = {
                ticker,
                scale,
                data: Object.keys(data["Weekly Time Series"]).map(date => {
                    let dateData = data["Weekly Time Series"][date];

                    return {
                        date,
                        open: dateData["1. open"],
                        high: dateData["2. high"],
                        low: dateData["3. low"],
                        close: dateData["4. close"],
                        volume: dateData["5. volume"]
                    }
                })
            };

            res.send(response);
        });
    }
});