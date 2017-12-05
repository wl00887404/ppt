const serve = require('serve')
const puppeteer = require('puppeteer')
const fs = require('fs')
const rimraf = require('rimraf')
const target = process.argv[2]

const range = length => Array.from({
    length
}, (el, index) => index)

const sleep = time => new Promise(res => setTimeout(res, time))
const server = serve(__dirname, {
    port: 8080,
    ignore: ['node_modules']
});

const main = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({width: 960, height: 700})
    await page.goto(`http://localhost:8080/${target}/`, {waitUntil: 'networkidle'});
    await sleep(3000)
    console.log(`puppeteer: start ${target}`)
    await new Promise(res => {
        fs.access(`./${target}/print.html`, err => {
            if (err) {
                res()
            }
            rimraf(`./${target}/print.html`, err => {
                res()
            })
        })
    })

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
        return Reveal.getTotalSlides()
    })

    let innerHTML = ""
    for (let i = 0; i < length; i++) {
        let slide = await page.evaluate(() => Reveal.getCurrentSlide().innerHTML)
        await page.evaluate(() => Reveal.next())
        innerHTML += `<section><div>${slide}</div></section>`
    }
    await browser.close()
    console.log("puppeteer: finished")

    let html = `
    <!doctype html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
        <title>${target}</title>
    
        <link rel="stylesheet" href="../css/reveal.css">
        <link rel="stylesheet" href="../css/theme/white.css">
        <link rel="stylesheet" href="../lib/css/atom-one-dark.css">
        <link rel="stylesheet" href="../css/styles.css">
        <link rel="stylesheet" href="../css/print.css">        
    </head>
    
    <body>
        <div class="reveal">
            <div class="slides">
                ${innerHTML}   
            </div>
        </div>
    </body>
    
    </html>
    
    `
    fs.writeFileSync(`./${target}/print.html`, html, {encoding: "utf8"})
}

fs.access(`./${target}/index.html`, err => {
    if (err) {
        console.log(err)
        return
    }
    main().then(() => {
        server.stop()
    })
})