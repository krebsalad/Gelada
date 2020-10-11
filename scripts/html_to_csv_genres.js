/*
*       Made 10-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to scrape data from vsrecommendedgames.fandom.com/wiki/A_List_and_Guide_to_Game_Genres
*       
*/

function getXmlValue(in_str)
{
  var out_str = in_str.match(/>([^>]*)</)[0];
  out_str = out_str.replace(/>|</g, '');
  out_str = out_str.replace(/\r?\n/, '');
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

// get video game categories
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
var http = require('https');
var options = {
  host: 'vsrecommendedgames.fandom.com',
  path: '/wiki/A_List_and_Guide_to_Game_Genres',
  headers: headers
};
callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var main_container = getXmlTagBetweenMultipleLines('article', ' id="WikiaMainContent"', str);
    var tables = getXmlTagBetweenMultipleLines('table', ' width', main_container[0]);
    var table_body = getXmlTagBetweenMultipleLines('tbody', '', tables[0]);
    var table_resources = getXmlTagBetweenMultipleLines('tr', '', table_body[0]);

    var structured_data_headers = [];
    var structured_data = [];

    var header_tags = getXmlTagBetweenMultipleLines('th', '', table_resources[0]);
    for (t in header_tags)
    {
      structured_data_headers.push(getXmlValue(header_tags[t]));
    }
    structured_data_headers[2] = "Example";
    structured_data_headers.push("Example");
    structured_data_headers.push("Example");
    console.log("headers:" + structured_data_headers);
    table_resources.shift();

    for (r in table_resources)
    {
      var genrename_tag = getXmlTagBetweenMultipleLines('th', '', table_resources[r]);
      var description_tags = getXmlTagBetweenMultipleLines('td', '', table_resources[r]);
      var elem = [];
      elem.push(getXmlValue(genrename_tag[0]));
      elem.push(getXmlValue(description_tags[0]));
      examples = getXmlValue(description_tags[1]).split(";");
      for(e in examples)
      {
        elem.push(examples[e]);
      }
      structured_data.push(elem);
    }
    console.log("found " + structured_data.length + " instances" );

    // convert to csv
    var out_data = "";
    for (d in structured_data_headers)
    {
      if(d!=0) out_data+= ";;";
      out_data += String(structured_data_headers[d])
    }
    out_data += "\n";
    for (d in structured_data)
    {
      for (d2 in structured_data[d])
      {
        if(d2!=0) out_data+= ";;";
        out_data += String(structured_data[d][d2]);
      }
      out_data += "\n";
    }
    var fs = require('fs');
    fs.writeFileSync("data/VideoGameGenres.csv", out_data);
    console.log("wrote instances as csv format to " + "data/VideoGameGenres.csv" + " with comma as ;; and newline as \\n ");

  });
}
http.request(options, callback).end();