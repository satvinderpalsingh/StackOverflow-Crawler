const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request-promise');
const json2csv = require('json2csv').Parser;
const ObjectsToCsv = require('objects-to-csv');
const mongoose = require("mongoose");
let allQuestions = [];
async function scrapStackOverflow(pageEnd) {

    try {
        for (let pageNo = 1; pageNo < pageEnd; pageNo++) {
            let URL = 'https://stackoverflow.com/questions?tab=active&page=' + pageNo;
            const response = await request({
                uri: URL,
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-US,en;q=0.9"
                },
                gzip: true
            })
            let $ = cheerio.load(response)
            //let currentPage=$('#mainbar > div.s-pagination.site1.themed.pager.float-left > div.s-pagination--item.is-selected').text()
            //console.log(currentPage)
            for (let index = 0; index < 50; index++) {
                let questionTitles = $('.summary>h3:eq(' + index + ')').text()
                let questionUrls = "https://stackoverflow.com"+$('.summary>h3>.question-hyperlink:eq(' + index + ')').attr('href')
                let questionViews = $('.views:eq(' + index + ')').text().replace('views','').replace('view','').replace('k','000')
                let questionUpVotes = $('.vote-count-post>:eq(' + index + ')').text()
                let questionAnswers = $('.status:eq(' + index + ')').text().trim().replace('answers','').replace('answer','')
                
                const data = {
                    questionTitles,
                    questionUrls,
                    questionViews,
                    questionUpVotes,
                    questionAnswers
                }

                allQuestions.push(data)
            }
        }
        const csv = new ObjectsToCsv(allQuestions);
        await csv.toDisk('./stackOverflowData.csv');
        console.log("data done")
        return
    } catch (error) {
        console.log(error)
    }


}
const pageEnd=2
scrapStackOverflow(pageEnd)
