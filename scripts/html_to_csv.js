/*
*       Made 09-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to scrape data from webpages
*       
*/

function findXmlTag(match_tag_str, in_str, arg='g')
{
    var reg = new RegExp('<s*'+ match_tag_str + '[^>]*>(([\\s\\S]*?)*?)<\\s*\\/\\s*'+ match_tag_str + '>', arg);
    return in_str.match(reg);
}

function getXmlValue(in_str)
{
    var out_str = in_str.match(/>([^>]*)</)[0];
    out_str = out_str.replace(/>|</g, '');
    return out_str;
}

const { table } = require('console');
// get video game categories
var http = require('http');
var options = {
  host: 'www.videogameconsolelibrary.com',
  path: '/main-list-name.htm'
};
callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    // get headers
    var table_head = findXmlTag('thead', str, 'g');
    var header_tags = findXmlTag('font', table_head[0]);
    var structured_data_headers = [];
    for (r in header_tags)
    {
        structured_data_headers.push(getXmlValue(header_tags[r]));
    }
    console.log("headers:" + structured_data_headers);

    // get data
    var table_bodies = findXmlTag('table', str, 'g');
    var largest_table_body = '';
    var structured_data = [];
    for (t in table_bodies)
    {
      if(table_bodies[t].length > largest_table_body.length)
      {
        largest_table_body = table_bodies[t];
      }
    }
    var table_resources = findXmlTag('tr', largest_table_body, 'g');
    table_resources.shift();
    for (r in table_resources)
    {
      var tags = findXmlTag('td', table_resources[r], 'g');
      var colomn_values = [];
      for(t in tags)
      {
        if (t == 2)
        {
          var retail_tag = findXmlTag('a', tags[t], 'i');
          colomn_values.push(getXmlValue(retail_tag[0]));
          continue;
        }
        colomn_values.push(getXmlValue(tags[t]));
        
      }
      if(colomn_values.length == structured_data_headers.length)
      {
        structured_data.push(colomn_values);
      }
    }
    
    console.log("found " + structured_data.length + " instances" );

    // convert to csv
    var out_data = String(structured_data_headers) + '\n';
    for (d in structured_data)
    {
      out_data += String(structured_data[d]) + '\n';
    }
    var fs = require('fs');
    fs.writeFileSync("data/VideoGameConsoles.csv", out_data);
    console.log("wrote instances as csv format to " + "data/VideoGameConsoles.csv");
    
  });
}
http.request(options, callback).end();