const express = require("express");
const fetch = require("node-fetch");
var router = module.exports = express.Router();
var cache = {};

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
        description: "Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It was created through a corporate restructuring of Google on October 2, 2015 and became the parent company of Google and several former Google subsidiaries.",
        ceo: "Larry Page (Oct 2, 2015-)"
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
        gradient: ["#141E30", "#243B55"],
        description: "Starbucks Corporation is an American coffee company and coffeehouse chain. Starbucks was founded in Seattle, Washington in 1971. As of 2018, the company operates 28,218 locations worldwide.",
        ceo: "Kevin Johnson"
    }
];

router.use("/companies", (req, res) => {
    setTimeout(() => res.send(COMPANIES), 2000);
});

router.use("/stock/:ticker/:scale", (req, res) => {
    const { ticker, scale } = req.params;
    let cacheKey = ticker + "/" + scale;

    if (cache[cacheKey]) {
        return res.send(cache[cacheKey]);
    }

    if (scale === "daily") {
        queryAPI("TIME_SERIES_DAILY", ticker).then(data => {
            if (!data["Time Series (Daily)"]) {
                return res.send({
                    success: false
                });
            }

            let response = {
                success: true,
                ticker,
                scale,
                data: Object.keys(data["Time Series (Daily)"]).map(date => {
                    let dateData = data["Time Series (Daily)"][date];

                    return {
                        date,
                        open: parseFloat(dateData["1. open"]),
                        high: parseFloat(dateData["2. high"]),
                        low: parseFloat(dateData["3. low"]),
                        close: parseFloat(dateData["4. close"]),
                        volume: parseFloat(dateData["5. volume"])
                    }
                })
            };

            cache[cacheKey] = response;

            return res.send(response);
        }).catch(error => {
            console.error(error);
        });
    } else if (scale === "weekly") {
        return queryAPI("TIME_SERIES_WEEKLY", ticker).then(data => {
            let response = {
                success: true,
                ticker,
                scale,
                data: Object.keys(data["Weekly Time Series"]).map(date => {
                    let dateData = data["Weekly Time Series"][date];

                    return {
                        date,
                        open: parseFloat(dateData["1. open"]),
                        high: parseFloat(dateData["2. high"]),
                        low: parseFloat(dateData["3. low"]),
                        close: parseFloat(dateData["4. close"]),
                        volume: parseFloat(dateData["5. volume"])
                    }
                })
            };

            res.send(response);
        });
    }
});