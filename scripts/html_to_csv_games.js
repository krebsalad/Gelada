/*
*       Made 18-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to scrape data from https://www.mobygames.com/browse/games
*       
*/

var start_at = 0; // start querying at this platform
var continue_for = 1;  // number of platforms to query for
var append_only = true; // set to false to clear out file and add headers!!!


let throttle = throttledQueue(50, 1000) // 15 times per second
const fs = require('fs');

function getXmlValue(in_str)
{
  var out_str = in_str.match(/>([^>]*)</)[0];
  out_str = out_str.replace(/>|</g, '');
  out_str = out_str.replace(/\r?\n/, '');
  return out_str;
}

function getBetween(side1, side2, in_str)
{
  var out_str = in_str.match(side1+'([^>]*)'+side2)[0];
  var reg = new RegExp(side1+'|'+side2, 'g')
  out_str = out_str.replace(reg, '');
  return out_str;
}

function getXmlTagBetweenMultipleLines(match_tag, match_start, in_str)
{
  var matching_txts = in_str.split('<' + match_tag + match_start);
  matching_txts.shift();
  var out_strs = []
  for (t in matching_txts)
  {
    var lines = matching_txts[t].split(/\r?\n/);
    var inwards = 1;
    var end_line = 0;
    var out_str = '';
    for (l in lines)
    {
      out_str += lines[l] + "\n";

      var matches = lines[l].match(new RegExp('<' + match_tag, 'g'));
      if(matches)
      if (matches.length)
      {
        inwards += matches.length;
      }
      var matches = []
      var matches = lines[l].match(new RegExp('/' + match_tag + '>', 'g'));
      if(matches)
      if(matches.length)
      {
        inwards -= matches.length;
        if(inwards == 0)
        {
          break;
        }
      }
      
    }

    out_strs.push(out_str);
  }
  
  return out_strs;
}

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
var http = require('https');
var options = {
  host: 'www.mobygames.com',
  path: '/browse/games',
  headers: headers
};


function callback_game(response)
{
    var str = '';
    var game_name = this.game_name;
    var platform_name = this.platform_name;
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('error', function(er){
        return 0;
    });

    response.on('end', function ()  {
        var game_data = [game_name, platform_name, 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None'];
        var game_info_tag = getXmlTagBetweenMultipleLines('div', ' id="floatholder coreGameInfo"', str)[0];
        if(game_info_tag == undefined)
            return 0;
        var cover_info_tag = getXmlTagBetweenMultipleLines('div', ' id="coreGameCover', game_info_tag)[0];
        var cover_link = getXmlTagBetweenMultipleLines('img', ' alt=', cover_info_tag)[0];
        if(cover_link != undefined) game_data[3] = "https://www.mobygames.com" + getBetween('src="', '" h', cover_link);

        var release_info_tags = getXmlTagBetweenMultipleLines('div', ' style=', getXmlTagBetweenMultipleLines('div', ' id="coreGameRelease', game_info_tag)[0]);
        for (r in release_info_tags)
        {
            if(getXmlValue(release_info_tags[r]) == "Published by")
            {
                r++;
                game_data[4] = getXmlValue(getXmlTagBetweenMultipleLines('a', '', release_info_tags[r])[0]).replace(/,\&nbsp;/g, ' ').replace(/\&nbsp;/g, ' ');
                continue;
            }

            if(getXmlValue(release_info_tags[r]) == "Developed by")
            {
                r++;
                game_data[5] = getXmlValue(getXmlTagBetweenMultipleLines('a', '', release_info_tags[r])[0]).replace(/,\&nbsp;/g, ' ').replace(/\&nbsp;/g, ' ');
                continue;
            }

            if(getXmlValue(release_info_tags[r]) == "Released")
            {
                r++;
                var release_year = getXmlValue(getXmlTagBetweenMultipleLines('a', '', release_info_tags[r])[0]).split(/, /g)[1];
                if(release_year != undefined) game_data[6] = release_year;
                continue;
            }

            if(getXmlValue(release_info_tags[r]) == "Also For")
            {
                r++;
                var other_platforms = getXmlValue(getXmlTagBetweenMultipleLines('a', '', release_info_tags[r])[0]).split(/,/g);
                if(other_platforms != undefined) 
                {
                    if (other_platforms.length > 0) game_data[7] = other_platforms[0];
                    if (other_platforms.length > 1) game_data[8] = other_platforms[1];
                    if (other_platforms.length > 2) game_data[9] = other_platforms[2];
                }
                continue;
            }
        }
        var genre_info_tags = getXmlTagBetweenMultipleLines('div', ' style=', getXmlTagBetweenMultipleLines('div', ' id="coreGameGenre', game_info_tag)[0]);
        for (g in genre_info_tags)
        {
            if(getXmlValue(genre_info_tags[g]) == "Genre")
            {
                g++;
                var genres = getXmlValue(getXmlTagBetweenMultipleLines('a', '', genre_info_tags[g])[0]).split(/,/g);
                if(genres != undefined) 
                {
                    if (genres.length > 0) game_data[10] = genres[0].replace(/,\&nbsp;/g, ' ').replace(/\&nbsp;/g, ' ');
                    if (genres.length > 1) game_data[11] = genres[1].replace(/,\&nbsp;/g, ' ').replace(/\&nbsp;/g, ' ');
                    if (genres.length > 2) game_data[12] = genres[2].replace(/,\&nbsp;/g, ' ').replace(/\&nbsp;/g, ' ');
                }
                continue;
            }
        }

        var out_data = '';
        out_data += String(game_data) + "\n";
        fs.appendFileSync('data/VideoGameData.csv', out_data);
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 


function callback_platform(response)
{
    var str = '';
    var platform_name = this.platform_name;
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('error', function() {
        return 0;
    });

    response.on('end', function ()  {
        var game_tags = getXmlTagBetweenMultipleLines('a', ' ', getXmlTagBetweenMultipleLines('div', ' id="browsewindow"', str)[0]);
        var games = [];
        for (g in game_tags)
        {
            var game_name = getXmlValue(game_tags[g]);
            var link = getBetween('href="','">', game_tags[g]);
            games.push([game_name , link]);
        }
        for(g in games)
        {
            
            if(games[g] == undefined || games[g][1] == undefined)
            {
                continue;
            }
            var http2 = require('https');
            var options2 = {
            host: 'www.mobygames.com',
            path: games[g][1].replace('https://www.mobygames.com', ''),
            headers: headers
            };
            http2.request(options2, callback_game.bind({'game_name' : games[g][0], 'platform_name' : platform_name})).end();
        }
        console.log("writing " + games.length + " game instances for platform "+ platform_name +" to " + "data/VideoGameData.csv");
        
    });
}

callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var platform_tags = getXmlTagBetweenMultipleLines('a', ' ', getXmlTagBetweenMultipleLines('div', ' class="browseTable">', str)[0]);
    var platforms = [];
    for (p in platform_tags)
    {
        var platform_name = getXmlValue(platform_tags[p]);
        var link = getBetween('href="','">', platform_tags[p]);
        platforms.push([platform_name , link]);
    }
    
    if(!append_only)
    {
        fs.writeFileSync('data/VideoGameData.csv', '');   // clean the file before appending
        out_data = String(["hasName", "hasPlatform", "hasScreenshot", "publishedBy", "developedBy", 'hasReleaseDate', 'hasPlatform', 'hasPlatform', 'hasPlatform', 'hasGenre', 'hasGenre', 'hasGenre']) + "\n";
        fs.appendFileSync('data/VideoGameData.csv', out_data);
    }
        
    
    console.log(platforms.length);
    for(p in platforms)
    {
        if(p < start_at)
        {
            continue;
        }
        if(p >= start_at + continue_for)
        {
            break;
        }
            
        var http2 = require('https');
        var options2 = {
        host: 'www.mobygames.com',
        path: platforms[p][1].replace('https://www.mobygames.com', ''),
        headers: headers
        };
        http2.request(options2, callback_platform.bind({'platform_name' : platforms[p][0]})).end();
        console.log(p);
    }

});
}
http.request(options, callback).end();