const serve = require('serve')
const puppeteer = require('puppeteer')
const fs = require('fs')
const rimraf = require('rimraf')
const target = "20170925"

const sleep = time => new Promise(res => setTimeout(res, time))
const server = serve(__dirname, {
    port: 8080,
    ignore: ['node_modules']
});

const main = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 1024, height: 700})
    await page.goto(`http://localhost:8080/${target}/`, {waitUntil: 'networkidle'});
    await sleep(3000)
    console.log("puppeteer: start")
    await new Promise(res => {
        fs.access(`./${target}/print`, err => {
            if (err) {
                res()
            }
            rimraf(`./${target}/print`, err => {
                res()
            })
        })
    })

    fs.mkdirSync(`./${target}/print`)

    let length = await page.evaluate(() => {
        const $$ = selector => Array.from(document.querySelectorAll(selector))

        Reveal.configure({transition: "none"})
        $$("body > div > aside,.progress").forEach((el) => {
            el.style.display = "none"
        })

        Array
            .from(document.querySelectorAll("#profile,#link img"))
            .forEach(el => {
                el.style.animationDelay = "0ms"
                el.style.animationDuration = "0ms"
            })
        return Reveal
            .getSlides()
            .length
    })

    for (let i = 0; i < length; i++) {
        await page.screenshot({
            path: `./${target}/print/${i + 1}.png`
        })
        await page.evaluate(() => Reveal.next())
    }
    await browser.close()
    console.log("puppeteer: finished")
}

main()
// setTimeout(main,5000) console.log("Waint 5000ms to print")