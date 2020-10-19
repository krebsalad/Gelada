/*
*       Made 11-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to scrape data from https://www.gematsu.com/exclusives
*       
*/

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

function callback_gematsu(response)
{
    var str = '';
    var platform_name = this.platform_name.replace(' exclusives', '');
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function ()  {
        var table_tag = getXmlTagBetweenMultipleLines('table', ' class="jl_table_list">', str);
        var exclusive_games = [];
        for (t in table_tag)
        {
            var game_tag = getXmlTagBetweenMultipleLines('li', ' class=', table_tag[t]);
            for( gt in game_tag)
            {
                var game_name = getXmlValue(getXmlTagBetweenMultipleLines('span', '', game_tag[gt])[0]);
                var exclusive_type = getBetween('"', '>', game_tag[gt]);
                var game_l = [];
                game_l.push(game_name);
                game_l.push(platform_name);
                game_l.push(exclusive_type);
                exclusive_games.push(game_l);
            }
            
        }

        var out_data = '';
        for(g in exclusive_games)
        {
            out_data += String(exclusive_games[g]) + "\n";
        }
        fs.appendFileSync('data/VideoGameExclusives.csv', out_data);
        console.log("appended " + exclusive_games.length + " intances to data/VideoGameExclusives.csv");
    });
}

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
var http = require('https');
var options = {
  host: 'www.gematsu.com',
  path: '/exclusives',
  headers: headers
};

callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var exclusive_tags = getXmlTagBetweenMultipleLines('li', '>', getXmlTagBetweenMultipleLines('ul', ' class="jl_exclusives"', str)[0]);
    var platforms = [];
    for (e in exclusive_tags)
    {
        var platform_name = getXmlValue(exclusive_tags[e]);
        var link = getBetween('href="','">', exclusive_tags[e]);
        platforms.push([platform_name , link]);
    }
    
    var exclusive_game_headers = ["Name", "Platform", "ExclusiveType"];
    var out_data = String(exclusive_game_headers) + "\n";
    fs.writeFileSync('data/VideoGameExclusives.csv', out_data);   // clean and the headers
    for(p in platforms)
    {
        var http2 = require('https');
        var options2 = {
        host: 'www.gematsu.com',
        path: platforms[p][1].replace('www.gematsu.com', ''),
        headers: headers
        };
        http2.request(options2, callback_gematsu.bind({'platform_name' : platforms[p][0]})).end();
    }
    
});
}
http.request(options, callback).end();