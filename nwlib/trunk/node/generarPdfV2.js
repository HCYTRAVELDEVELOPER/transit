
const puppeteer = require('/home/ubuntu/node_modules/puppeteer');

var arg = process.argv.slice(2);
console.log(arg);

if (typeof arg[0] == 'undefined') {
        console.log("\n");
        console.log("Debe agregar el parámetro de URL ");
        return false;
}
if (typeof arg[1] == 'undefined') {
        console.log("\n");
        console.log("Debe agregar el parámetro de nombre archivo destino");
        return false;
}

var convertirV2 = function () {
let options = {format: 'A4'}; 
        let url = arg[0];
        console.log("URL:" + url);
        let file = {url: url};
        (async () => {
        const browser = await puppeteer.launch({headless: true, args: ['--use-gl=egl']});
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(url, {waitUntil: 'networkidle0'});
                const pdf = await page.pdf({format: 'A4'});
                await page.addStyleTag({content: 'h4 { BACKGROUND-COLOR:  #016f90} '});
                await page.pdf({
                printBackground: true,
                        path: arg[1],
                        format: "Letter",
                        margin: {
                        top: "20px",
                                bottom: "40px",
                                left: "20px",
                                right: "20px"
                        }
                });
                await browser.close();
        })()

}

convertirV2();