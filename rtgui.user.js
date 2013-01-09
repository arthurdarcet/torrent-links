/*
    Add Torrents to rtGui (v2.0)
    Created         2012-09-14
    Author          Arthur Darcet
    Original work   Jeremy Tirrell (c) 2008
    License         GPL License (http://www.gnu.org/copyleft/gpl.html)

    Edit manifest.json and change the "permissions" setting to the domain of your server
    To make rtGui work properly you must edit control.php and add:
        --- a/control.php
        +++ b/control.php
        @@ -19,6 +19,11 @@
         include "functions.php";
         include "config.php";
         extract($_POST, EXTR_PREFIX_ALL, 'r');
        +extract($_GET, EXTR_PREFIX_ALL, 'r');
        +
        +if(isset($r_ajaxAddurl))
        +    die(do_xmlrpc(xmlrpc_encode_request("load_start",array("$r_ajaxAddurl"))));
        +
         
         // Bulk stop/start/delete torrents...
         if (isset($r_bulkaction) && is_array($r_select)) {

*/

function server(url) {
    // Define the request to add <url> torrent to the server
    return {
        method: 'GET',
        url: 'https://torrent.darcet.fr/control.php',
        data: 'ajaxAddurl='+encodeURIComponent(url),
        returnValue: ''
    };
}
var matchRegex = new Array(
    // isohunt
    /http:\/\/.*isohunt\.com\/download\//i,
    /http:\/\/.*bt-chat\.com\/download\.php/,
    // TorrentReactor
    /http:\/\/dl\.torrentreactor\.net\/download.php\?/i,
    // Mininova
    /http:\/\/www\.mininova\.org\/get\//i,
    // TorrentSpy
    /http:\/\/ts\.searching\.com\/download\.asp\?/i,
    /http:\/\/www\.torrentspy\.com\/download.asp\?/i,
    // Seedler
    /http:\/\/.*seedler\.org\/download\.x\?/i,
    // all direct torrent links
    /\.torrent$/,
    // magnets
    /magnet:*/i
);


function rtGuiClick() {
    var serv = server(this.href);
    var url = serv.url;
    if(serv.method == 'GET')
        url += '?'+serv.data;
    var rtGuiLink = this;
    chrome.extension.sendMessage(
        {'method': serv.method, 'url': url, 'data': serv.data},
        function(s) {
            if (s == serv.returnValue) {
                rtGuiLink.getElementsByTagName('img')[0].src=rtGuiSuccess;
                rtGuiLink.getElementsByTagName('img')[0].title="Torrent Downloading";
            } else {
                // debug
                alert("torrent url: "+rtGuiLink.href+"\n\nDebug Info:\n"+s);
                rtGuiLink.getElementsByTagName('img')[0].src=rtGuiFailed;
                rtGuiLink.getElementsByTagName('img')[0].title="Torrent Download Failed";
            }
        }
    );
}

function makertGuiLink(link) {
    var rtGuiLink = document.createElement('a');
    rtGuiLink.setAttribute("href", link.href);
    rtGuiLink.addEventListener('click',rtGuiClick,false);
    rtGuiLink.setAttribute("onclick", "return false;");
    rtGuiLink.innerHTML = "<img src=\"" + rtGuiImage + "\" style='border: 0px; padding: 0 1px;' alt='Open with rtGui' title='Open with rtGui' />";
    return rtGuiLink;
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

// rtGui Icons
var rtGuiImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdpJREFUeNqMkztII1EUhv+ZzERMsc2iZgyYFGuTwsY0EQUtBAlKGtMoVoHd2tJmuwULjXamEMRW0M50KoIiBAMqIfiANNHGEZmg5rEzk/GeGyYkmUQ8cLmvc757XlewLAuxWAwkgiDMsWkQXeQinF187tMG/7uNI1jWH3zUINFFrVazdXzJZHJL1/WOgEhmATPjs9hO7WgwLX7GAaZp2jpCtVpFuVxuMfz7sIrs+y1EUUTRLAJV/uAlLGQ4wDAMW1fM5/OQZbkFcPV8A2VmiK9fjBdMRSZHaX1ycAwHIBAIoD2Ekacgcod3lCNY0zKye9eZur8dPKhUKiiVSi2AlV/LfF46/41X8w0osxBkIQRJqHvQ9CIPQZKkjkn0vfXh/t/pI3r1DBnD1+ME+P1+dKvCRnQN8Xh8szDwtM4BRckJoAq0h0CSy+UQCoVIV/Q+9jfO2wEuKmlTWRsSDodB+WG6ruZzDtA0zd67uwFUVYXH4yFdtwNQKBTsfTCRSOArYbpBB4D+g8vFPVO9Xm9zWRuSjqcxtjtG3aja3Ut2DQD7D8PsUlcUpSMgmopCUuopI11m88B7iYxZh/1kY56NCXxDmM0ZG/vksQ3wsM0PKiO+J/SbWEvi41OAAQBOeebGyYeXPwAAAABJRU5ErkJggg==";
var rtGuiFailed = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%5DIDAT8%CB%A5%93%FBKSa%18%C7%FD%5B%B6%1F%A2%04%89n%84%84QP%98%F32w%D6%DA%DC%A6%CE%B3L%8F%5B%2Cbi%8E%9Da%9AA%8D%C5%5C%F8C%A8%A5v%D5%CA_2Ml%94ZFj%D7%A1%E5%B1%F2%D2NMjm%9E%B3k%CA%B7%B9%60%26.%23z%E1%FB%CB%CB%FB%F9%BC%3C%0F%CF%93%02%20%E5%7F%B2%E6bV%AF%17%CEP%15%E6%F7T%193%A5%25%B9I%AD%86%7BG%AA%99qRiv%95%C8%85%EB%0A%E6tz%E2%23E%B1%DF%1C6%84%07%9D%88%BC%19Edd%08%FC%DD%0E%CC%1AJ%F1%AA%90%60%9F%AB%C5DR%C12%3C%5DN%F1%0B%B7%3B%B04%F5%16%D1%BE%3B%88%B6%DB%11m%3E%87%1F7%9B%B08%DC%07%8F%C9%80Qe6%FFL%9EI%AC%12%CC%E8t%82%18%EC%E6%AE%B7c%89q!z%F1%0C%7Cv%0B%FC%B6j%84%2FX%10i%A0%11%B6%9E%40%F8%DE%0D%CC%1D%251%7Ch%9F%FB%B1l%8F%20!%88%C1%F4%7C%AD%19%8B%AE%B1%F8%8F!%07%0D%EFY%23%82u%BAU%E1N%92%08w%5D%C1%CB%BC%0C%0CH3%E8%84%E0%03u%84%09t%5DE%B4%B3%19%3Ek%25%BE%16I%93f%A1%92%04o%AB%81%C7R%85%87D%3A%93%100%E5%DA%60%E4~%17%A2%0E%0B%7C%A7%0D%F8%D3%F1(r%E0%A5%0A%E1on%843oG0!%98%24%8B%82%A1%CEV%84%EB%0D%08%9E*%5BW0_%AA%82%BF%A9%11%FD%E2-%2B%82%89%12%15%E3%B5%D6%20d%A7%C1%1DW%C7%1F%26%8D2%0F%BEZ%13fMF%F4%89%D2VJp%15%CBiF%26B%B0%B3%0D%3E%AD%0C%DER%C9%1A%98%95g%83-%90%20%D0~%09C%E2m%E8%CD%DA%B4%D2%C4%D7ER%C1%0B%0D%E1%9E%AB%D0%20p%AB5%DE%B0y%95%F8%17%A8%C8%05%2B%8B%C121%F8%B6%16%8C%17K%97aw%B7h%A3%60%D5%20%8D%15%E4%10%23%8A%03%FC%F4a%15%02%D7Z%F1%BD%9E%86%87T%E2%B3Z%01o%9D%19%FC%E5%16L%A8%F3%D1%93%95%CA%C7%60%22%E9(%3F%95%EF'%9E%1C%DC%CB%8EJv%E1K%B5%11%DE%86%F3%F1%7C%AA%3A%86G9%5B%97a%F6w8%E92%0DJw%0B%07%C4%E9f'%B1%93y%90%BF%9D%EB%17m%E6zs%D3%98%9E%ECTsw%E6%06%E1_%B7%F1_%F3%13%1D%D2%CE%B9Ir%1B%FE%00%00%00%00IEND%AEB%60%82";
var rtGuiSuccess = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%07tIME%07%D8%0A%1D%16%177%7F%EF%5DZ%00%00%01yIDAT8%CB%A5%93%CD%2BDQ%18%C6%9Fs%EF%99%D3qgJ%B84%F9%18%9A%C9wI(%0B%A3d%C3%DAJ%B2%B4%B2%B1%B1%90dmia%C1%8E%FF%40%F64Q%12%93PL%94h%CCD%9Ad%CAm%A63%E7%9Ckc%A1i%AE%8F%EE%BB%7C%17%BF~o%CF%FB%10%D7u%E1g%0C%F8%1C%DF%00Zi9%B5%19%85E98%E5%E0%94%81%1A%0C%EB3%87%7F%07%14%85%C0%F4%E0%02%A8Ia%12%03%FB%D7%3B%FF3%E0%8C%E9%BD%CB-%F2%DD%00%00%F1c%A0%FFd%10%5D%25%B0%18A8dCj%85%EC%FB%03Z%EB%DA!%B4%C4%DC%F6%008e%D8%98%3D%A9%9C%82%BDD%A0%B4%89%A1%C88%8AR%40j%85%92%96PZAH%89%88%DD%0D!%85w%8C%B95%17%A6%A1%9Cd%FA%C0%89%D9%BDD%B9%1AR%97%A0%E1%A2%A9%B6%C3H%E7R%0E%A3%CC%F1%3C%C1%5E%22UAjZC%911%0C%B7%8D%E29%9FFI%95%F0%92%CF%A0%AF9%8E%00%0DX%99%5C%EAG%83BA%ABh%E2n%3F%9BL%1F%A36%14%86a0%D4%04%1Bp%FAx%80%9B%EC9%84%96V9%80%94w%A1q%99t2%8A%C4D%D7dx%A0e%04%17OG%B8%7F%BD%D4%16%E3%A1%DD%F9%C7%C2%AF%80%2FH%0F%A7H%8C%C4%E2%F5%B7%CFg%9AS%AB%FAp%F1%ED%A3R%8C%C4%AB%8D%CD%CB%A4%DFbHrJ%EA%AEVt%DE%EB%0F%88%DF%3A%7F%02_%1F%95%FF%E8%EA%EB%2C%00%00%00%00IEND%AEB%60%82";

// start the script
scanLinks();
