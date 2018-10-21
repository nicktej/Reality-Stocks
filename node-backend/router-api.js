const express = require("express");
var router = module.exports = express.Router();
var cache;

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
})