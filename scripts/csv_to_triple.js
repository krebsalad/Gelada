/*
*       Made 08-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to convert any csv file to turtle syntax
*       
*/


// default config
var in_path = 'data/VideoGames.csv'
var out_path = 'outfile.ttl'
var new_line_sign = /\r?\n/;
var new_element_sign = ";";
var main_subject = 'Game';
var prefix = 'ex';

// process args
if (process.argv.length > 1)    // in path
    in_path = process.argv[2];
else
    console.log("no arguments given, please give a relative path to the input file (arg1), a relative path to the output file (arg2) and a prefix (arg3) of your ontology")
if (process.argv.length > 2)    // out path
    out_path = process.argv[3];
if (process.argv.length > 3)    // prefix
    prefix = process.argv[4];

var prefix = prefix + ':';

// read lines 
console.log("reading file " + in_path);
var fs = require('fs');
var contents = fs.readFileSync(in_path, 'utf8');
var lines = contents.split(new_line_sign);


// convert lines to structured data
console.log("structurizing data...");
var structured_data = []
var structured_data_headers;
for (l in lines)
{
    if(l == 0)
    {
        structured_data_headers = lines[l].split(new_element_sign);
        continue;
    }
    structured_data.push(lines[l].split(new_element_sign));
}


// possibly rename headers


// remove  spaces : ; new lines from given string
function make_str_rdf_compatible(in_str)
{
    var out_str = in_str.replace(/\s+/g, '_');
    out_str = out_str.replace(/\./g, '_');
    out_str = out_str.replace(/\:/g, '');
    out_str = out_str.replace(/\;/g, '');
    return out_str;
}

// TODO Actually determine if a number by first casting in_str to different type and choosing most probable then returning in thhe
function make_str_rdf_literal(in_str)
{
    return '"' + in_str + '"'
}

// convert to triple data
console.log("converting data...");
var triple_data = [];
for (sd_iter in structured_data)
{
    // get subject name
    var subject = make_str_rdf_compatible(structured_data[sd_iter][0]);
    if (subject == '')
    {
        continue;
    }

    // add base triples
    triple_data.push([prefix + subject, 'rdf:type', prefix + main_subject]);
    triple_data.push([prefix + subject,  prefix + structured_data_headers[0], make_str_rdf_literal(subject)]);

    // add the other triples
    for (ld_iter in structured_data[sd_iter])
    {
        if (ld_iter == 0)
        {
            continue;
        }

        var predicate = make_str_rdf_compatible(structured_data_headers[ld_iter]);
        var object = make_str_rdf_literal(structured_data[sd_iter][ld_iter]);

        if (predicate == '' || object == '')
        {
            continue;
        }

        triple_data.push([prefix + subject,  prefix + predicate, object]);
    }
}

// write to file
console.log("writing data to " + out_path);
out_data = '';
last_subject = '';
for (t in triple_data)
{
    if (last_subject != '')
    {
        if(last_subject == triple_data[t][0])
        {
            out_data = out_data + ';' + " ";
            out_data = out_data + triple_data[t][1] + " " + triple_data[t][2] + " ";
            continue;
        } else
        {
            out_data = out_data + '.' + " ";
        }
        
    }
    out_data = out_data + triple_data[t][0] + " " + triple_data[t][1] + " " + triple_data[t][2] + " ";
    last_subject = triple_data[t][0];
}
fs.writeFileSync(out_path, out_data);