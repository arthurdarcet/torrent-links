/*
    Add Torrents to rtorrent watch folders
    Created         2012-09-14
    Author          Arthur Darcet
    Original work   Jeremy Tirrell (c) 2008
    License         GPL License (http://www.gnu.org/copyleft/gpl.html)

    Edit manifest.json and change the "permissions" setting to the domain of your server
    Adapt the server function to point to the php script and add the <secret>
*/

function server(url, cat) {
    return {
        method: 'GET', // POST not working, background.js need fixup
        url: 'https://torrent.darcet.fr/up',
        data: 'p=<secret>&cat='+cat+'&url='+encodeURIComponent(url),
        returnValue: 'ok'
    };
}
var matchRegex = new Array(
    /http:\/\/.*isohunt\.com\/download\//i,
    /http:\/\/.*bt-chat\.com\/download\.php/,
    /http:\/\/dl\.torrentreactor\.net\/download.php\?/i,
    /http:\/\/www\.mininova\.org\/get\//i,
    /http:\/\/ts\.searching\.com\/download\.asp\?/i,
    /http:\/\/www\.torrentspy\.com\/download.asp\?/i,
    /http:\/\/.*seedler\.org\/download\.x\?/i,
    /\.torrent$/,
    /magnet:*/i
);


function linkClick() {
    var serv = server(this.dataset.url, this.dataset.cat);
    var link = this;
    chrome.extension.sendMessage(
        serv,
        function(s) {
            if (s == serv.returnValue) {
                link.src=successIcon;
            } else {
                console.log("Request:\n"+JSON.stringify(serv)+"\n\nResponse:\n"+s);
                link.src=failedIcon;
            }
        }
    );
}

function makertGuiLink(url) {
    var span = document.createElement('span');
    span.appendChild(icon(url,'manual',normalIcon));
    span.appendChild(icon(url,'seed',seedIcon));
    span.appendChild(icon(url,'movie',movieIcon));
    span.appendChild(icon(url,'show',showIcon));
    return span;
}

// function from Julien's "Add Torrents to uTorrent" script
// this function inits the script and adds all the rtGui download links
function scanLinks() {
    var doc_links = document.links;
    var links = new Array();
    for (var i=0; i < doc_links.length; i++)
        links.push(doc_links[i]);

    for (var i=0; i < links.length; i++){
        var link = links[i];
        for (r=0; r<matchRegex.length; r++)
            if (link.href.match(matchRegex[r]))
                link.parentNode.insertBefore(makertGuiLink(link), link.nextSibling);
    }
}

function icon(url, cat, src) {
    var img = document.createElement('img');
    img.setAttribute('data-cat', cat);
    img.setAttribute('data-url', url);
    img.setAttribute('src', src);
    img.setAttribute('style', 'height: 18px; border: 0; padding: 0;');
    img.addEventListener('click',linkClick,false);
    return img;
}

var normalIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdpJREFUeNqMkztII1EUhv+ZzERMsc2iZgyYFGuTwsY0EQUtBAlKGtMoVoHd2tJmuwULjXamEMRW0M50KoIiBAMqIfiANNHGEZmg5rEzk/GeGyYkmUQ8cLmvc757XlewLAuxWAwkgiDMsWkQXeQinF187tMG/7uNI1jWH3zUINFFrVazdXzJZHJL1/WOgEhmATPjs9hO7WgwLX7GAaZp2jpCtVpFuVxuMfz7sIrs+y1EUUTRLAJV/uAlLGQ4wDAMW1fM5/OQZbkFcPV8A2VmiK9fjBdMRSZHaX1ycAwHIBAIoD2Ekacgcod3lCNY0zKye9eZur8dPKhUKiiVSi2AlV/LfF46/41X8w0osxBkIQRJqHvQ9CIPQZKkjkn0vfXh/t/pI3r1DBnD1+ME+P1+dKvCRnQN8Xh8szDwtM4BRckJoAq0h0CSy+UQCoVIV/Q+9jfO2wEuKmlTWRsSDodB+WG6ruZzDtA0zd67uwFUVYXH4yFdtwNQKBTsfTCRSOArYbpBB4D+g8vFPVO9Xm9zWRuSjqcxtjtG3aja3Ut2DQD7D8PsUlcUpSMgmopCUuopI11m88B7iYxZh/1kY56NCXxDmM0ZG/vksQ3wsM0PKiO+J/SbWEvi41OAAQBOeebGyYeXPwAAAABJRU5ErkJggg==";
var showIcon = "data:image/jpeg;base64,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";
var movieIcon = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGBggGBQkIBwgKCQkKDRYODQwMDRoTFBAWHxwhIB8cHh4jJzIqIyUvJR4eKzssLzM1ODg4ISo9QTw2QTI3ODX/2wBDAQkKCg0LDRkODhk1JB4kNTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTX/wgARCAAnACgDAREAAhEBAxEB/8QAGgAAAwADAQAAAAAAAAAAAAAAAwQFAAIGAf/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgQF/9oADAMBAAIQAxAAAAHuDBdJZWEBWwUts2XnrkHRxgsKM83b5Yv1+eK42mmeT0Kudx9Z3UaV86//xAAhEAABBQABBAMAAAAAAAAAAAADAAECBAUREhMUFSQxM//aAAgBAQABBQJfSawKUrejKsUJO6LQmYYaJZGFGtRrnmYQoCOM7bfLoY2DFqw2IQUTNi8tPZ/V5Mutl1LHf5N+h5zNguy9JJehkqGf4S//xAAgEQACAQQBBQAAAAAAAAAAAAAAARICEBETIQMwMTJR/9oACAEDAQE/Ae1Vwja8G5/Tcyl5WSvwR4IipOn6q0URRBW//8QAGxEAAgIDAQAAAAAAAAAAAAAAAAESMQIQETD/2gAIAQIBAT8B8lZBEEQQ7MbO66Z3qTJMk9f/xAAsEAABAwIBCQkAAAAAAAAAAAABAAIRAxJhBCEiMTRRcaHhECBBgZGToqPB/9oACAEBAAY/Auy1tRrjuBQaKDnTqM60HwWz4EQrqDw3fIRbXqU6nAz6qb9MHMJ1K57g0Yomk64BUGSYcTPJQxzgOKvl12+VFRz3earsk2tObmsm4n87mUYpunYW4Ss2U/X1W0D2+q2n4dU433l2EL//xAAgEAEAAgIBBAMAAAAAAAAAAAABABEhMUEQUYGhYXGx/9oACAEBAAE/IYoLWgj8dLprBDvYj6bnlrEIZQnce3B5ifUM8Dtwl91sWfxKIbzBAcRSWQIADuHz83UUJWbtfMEBDVyrfCAusw6Z4T3CjcbtwOMy751+2Hy4zgRi1gdChbYbkd7FHAE//9oADAMBAAIAAwAAABCA8k/i+FUfP2V//8QAGhEBAQEBAQEBAAAAAAAAAAAAAQARYRAhMf/aAAgBAwEBPxDxct2JZPDPFoyWtkvjDXNsmfqclOJC7KYXwHJNudyuMGX/xAAaEQADAAMBAAAAAAAAAAAAAAAAAREQMWEh/9oACAECAQE/EMzKx7hKiFaQtpDlYLGRrPDom5B1TaxOHQ6HYbp//8QAIRABAQACAwEAAQUAAAAAAAAAAREAITFBUWFxgZGx0fH/2gAIAQEAAT8QxyIFVYGWaUAR+BzliyfQAG3xj8wDJtr+JH/HrGw+6ITW4Mf0Pt57AsEvXBT/ACe7ynmouN6DbvhXTipgBxbeD24vCILB8vuOTHgGwFO5XKt6QNvrrBWjugcrs5uWII9K5ULV6ciH2bw2EHMFENMTXLzCwnW3Dg4D9n9+BNPBwgolN6N33XlEDBjqvtZQXsFW8PwACSW5K1XvP//Z";
var seedIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QEJFxYJXjF77QAAA2VJREFUWMPtmE2LHEUYx39Ps9Yzu7obgwGVCF5EQoIiQm66ICtBg+CCN697zBfQb5GrOaxfIRICOYpCIobdiHsQ14MmSCYRAyajcaod/Hvo6t3unpmdnX2ZHSQFzdRUVz31q+elnuqCJ+V/XmxQo+bmsMePi7r7MeAl4BgwA0SkB5jdthj/AVCrhXW7dRmVNrk/hfQyZs8BDvSAh8CvFuPDYTIGFrkXvyHMy/2i3Dfk/kDuPblL7lEh3JX7dYWw0hzXVw9hJfW9K/eYZPSSzA25X1QI881xO2vQ/U3gS6R5zDSg33ab9B1m71mM98sJLEbk/jzSNcze6BtTlSMZZo+AdyzG9SZLVllp+fsxsAYMg6suTAnghtxPW4wl3Gngm/ROOyjD0hwLwFqae4ulNkhzc9DrvY7Z12nAMDiGaPMPpFcLqbYJPLsHGY+Q3mJmZqOMAWuY9irSeczGDbZygq/S/8Ux4CpSBGZXLcYP+jXofgrphz3A1f2p0OD4cHXQU5bnP9Z8EOlCgtOetywzkgzbxyLB7MJWkGh2tqyf2ymyJ7Yvm4F0DkCzszUT/wk8PSUJ5C+L8Zm6iY9Wc0P356oPdqcGT/p72we3mO2X6dFfwSIgq9h1fYpMvF7aueqDV5D2s80ciHETw5WBgSF3TYWFY6wHSSU5X0orOMoA+azKlAFYnm8DQueIzCygg9mlKlPWUO0aZpeT6TVhOEO63DwT9m3OCsExu4n02r6T/ngnoe+BsxZjPvDAWh65Lc8j0ruY3ZlQdjGkn5GWLMa8eexvmrhYTp7/BiwD9w9x6ym3lHuYfWR5/nvJMBSwtLmyDIvxFtL7mN1J5zwdMJxhdhvpvMV4S1k2xmdnq1W87HZRCC+kz4BX9nRKHu5zPyEtWp7fq863K8CmJIXwImZfAGcPSIM3kT60PG+PWnE26syTAqcNLCGt7sMnC5+TVoEly/O23EeaI9tF2imrHY4fX8Hs80q20S5NWn4QrXLy5EpKBn0BcXAe7v6pQsjTLcHop+j7yeFv9/XrjWWF0JP7v+lpghXtRZ/lQTIOD7S8hXBflHtnB+115P5287ZgMsmzvGRyPyP3zZrWivqm3M9MTGsjIE/IvV3RXFvuJ44UbgBkS+7fpqc1FXADIBfkvjBVcE/KtJf/AAkt0SdQiSU3AAAAAElFTkSuQmCC";
var failedIcon = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%5DIDAT8%CB%A5%93%FBKSa%18%C7%FD%5B%B6%1F%A2%04%89n%84%84QP%98%F32w%D6%DA%DC%A6%CE%B3L%8F%5B%2Cbi%8E%9Da%9AA%8D%C5%5C%F8C%A8%A5v%D5%CA_2Ml%94ZFj%D7%A1%E5%B1%F2%D2NMjm%9E%B3k%CA%B7%B9%60%26.%23z%E1%FB%CB%CB%FB%F9%BC%3C%0F%CF%93%02%20%E5%7F%B2%E6bV%AF%17%CEP%15%E6%F7T%193%A5%25%B9I%AD%86%7BG%AA%99qRiv%95%C8%85%EB%0A%E6tz%E2%23E%B1%DF%1C6%84%07%9D%88%BC%19Edd%08%FC%DD%0E%CC%1AJ%F1%AA%90%60%9F%AB%C5DR%C12%3C%5DN%F1%0B%B7%3B%B04%F5%16%D1%BE%3B%88%B6%DB%11m%3E%87%1F7%9B%B08%DC%07%8F%C9%80Qe6%FFL%9EI%AC%12%CC%E8t%82%18%EC%E6%AE%B7c%89q!z%F1%0C%7Cv%0B%FC%B6j%84%2FX%10i%A0%11%B6%9E%40%F8%DE%0D%CC%1D%251%7Ch%9F%FB%B1l%8F%20!%88%C1%F4%7C%AD%19%8B%AE%B1%F8%8F!%07%0D%EFY%23%82u%BAU%E1N%92%08w%5D%C1%CB%BC%0C%0CH3%E8%84%E0%03u%84%09t%5DE%B4%B3%19%3Ek%25%BE%16I%93f%A1%92%04o%AB%81%C7R%85%87D%3A%93%100%E5%DA%60%E4~%17%A2%0E%0B%7C%A7%0D%F8%D3%F1(r%E0%A5%0A%E1on%843oG0!%98%24%8B%82%A1%CEV%84%EB%0D%08%9E*%5BW0_%AA%82%BF%A9%11%FD%E2-%2B%82%89%12%15%E3%B5%D6%20d%A7%C1%1DW%C7%1F%26%8D2%0F%BEZ%13fMF%F4%89%D2VJp%15%CBiF%26B%B0%B3%0D%3E%AD%0C%DER%C9%1A%98%95g%83-%90%20%D0~%09C%E2m%E8%CD%DA%B4%D2%C4%D7ER%C1%0B%0D%E1%9E%AB%D0%20p%AB5%DE%B0y%95%F8%17%A8%C8%05%2B%8B%C121%F8%B6%16%8C%17K%97aw%B7h%A3%60%D5%20%8D%15%E4%10%23%8A%03%FC%F4a%15%02%D7Z%F1%BD%9E%86%87T%E2%B3Z%01o%9D%19%FC%E5%16L%A8%F3%D1%93%95%CA%C7%60%22%E9(%3F%95%EF'%9E%1C%DC%CB%8EJv%E1K%B5%11%DE%86%F3%F1%7C%AA%3A%86G9%5B%97a%F6w8%E92%0DJw%0B%07%C4%E9f'%B1%93y%90%BF%9D%EB%17m%E6zs%D3%98%9E%ECTsw%E6%06%E1_%B7%F1_%F3%13%1D%D2%CE%B9Ir%1B%FE%00%00%00%00IEND%AEB%60%82";
var successIcon = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%07tIME%07%D8%0A%1D%16%177%7F%EF%5DZ%00%00%01yIDAT8%CB%A5%93%CD%2BDQ%18%C6%9Fs%EF%99%D3qgJ%B84%F9%18%9A%C9wI(%0B%A3d%C3%DAJ%B2%B4%B2%B1%B1%90dmia%C1%8E%FF%40%F64Q%12%93PL%94h%CCD%9Ad%CAm%A63%E7%9Ckc%A1i%AE%8F%EE%BB%7C%17%BF~o%CF%FB%10%D7u%E1g%0C%F8%1C%DF%00Zi9%B5%19%85E98%E5%E0%94%81%1A%0C%EB3%87%7F%07%14%85%C0%F4%E0%02%A8Ia%12%03%FB%D7%3B%FF3%E0%8C%E9%BD%CB-%F2%DD%00%00%F1c%A0%FFd%10%5D%25%B0%18A8dCj%85%EC%FB%03Z%EB%DA!%B4%C4%DC%F6%008e%D8%98%3D%A9%9C%82%BDD%A0%B4%89%A1%C88%8AR%40j%85%92%96PZAH%89%88%DD%0D!%85w%8C%B95%17%A6%A1%9Cd%FA%C0%89%D9%BDD%B9%1AR%97%A0%E1%A2%A9%B6%C3H%E7R%0E%A3%CC%F1%3C%C1%5E%22UAjZC%911%0C%B7%8D%E29%9FFI%95%F0%92%CF%A0%AF9%8E%00%0DX%99%5C%EAG%83BA%ABh%E2n%3F%9BL%1F%A36%14%86a0%D4%04%1Bp%FAx%80%9B%EC9%84%96V9%80%94w%A1q%99t2%8A%C4D%D7dx%A0e%04%17OG%B8%7F%BD%D4%16%E3%A1%DD%F9%C7%C2%AF%80%2FH%0F%A7H%8C%C4%E2%F5%B7%CFg%9AS%AB%FAp%F1%ED%A3R%8C%C4%AB%8D%CD%CB%A4%DFbHrJ%EA%AEVt%DE%EB%0F%88%DF%3A%7F%02_%1F%95%FF%E8%EA%EB%2C%00%00%00%00IEND%AEB%60%82";

scanLinks();
