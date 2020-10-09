/*
*       Made 08-10-2020 with vscode and nodejs v12.18.4
*       This script can be used to convert any csv file to turtle syntax
*       
*/


// default config
var in_path = 'infile.csv'
var out_path = 'outfile.ttl'
var new_line_sign = /\r?\n/; //";;"
var new_element_sign = ','; //";";
var main_subject = 'Thing';
var main_subject_column = 0;
var prefix = 'ex';
var uri = 'http://www.example.com/example/'
var set_headers = 'false';

// process args
var args = process.argv.slice(2);
if (args.length == 0){
    console.log(`no arguments given, please give atleast a relative path to the input file 
    (in:=) a relative path to the input file, by default `+in_path+`
    (out:=) a relative path to the output file, by default `+out_path+`
    (uri:=) give a uri of your ontology, by default `+uri+`
    (prefix:=) a prefix of your ontology, by default `+prefix+`
    (char_newelement:=) the character used to seperate elements, by default it is "`+new_element_sign+`"
    (char_newline:=) the character used to determine new lines, by default is new line
    (set_headers:=) would you like to change the name of the predicates/headers? by default false
    (subject) change the class of the instances, by default is Thing
    (subject_column) the column of which the id of each 'Thing' is found, by default the first column (0)
    `)
    return 0;
}
for(a in args)
{
    s_arg = args[a].split(':=');
    console.log(s_arg)
    switch(s_arg[0])
    {
        case "in":
            in_path = s_arg[1];
            break;
        case "out":
            out_path = s_arg[1];
            break;
        case "uri":
            uri = s_arg[1];
            break;
        case "prefix":
            prefix = s_arg[1];
            break;
        case "char_newelement":
            new_element_sign = s_arg[1];
            break;
        case "char_newline":
            new_line = s_arg[1];
            break;
        case "set_headers":
            set_headers = s_arg[1];
            break;
        case "subject":
            main_subject = s_arg[1];
            break;
        case "subject_column":
            main_subject_column = Number(s_arg[1]);
            break;
        default:
            console.log("argument " + s_arg[0] + " is invalid ");
            break;
    }
}


prefix = prefix + ':';

// read lines from input file
console.log("reading file " + in_path);
var fs = require('fs');
var contents = fs.readFileSync(in_path, 'utf8');
contents = contents.replace(/\"/g, '');
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
    line_data = lines[l].split(new_element_sign);
    if(line_data.length != structured_data_headers.length)
    {
        continue;
    }
    structured_data.push(line_data);
    
}

// utiliy for changing headers if needed
const rl_int =  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
var current_header_i = 0;
function set_headers_routine(input)
{
    // parse input
    if(input == "rename")
    {
        current_header_i = 0;
    }
    else
    {
        structured_data_headers[current_header_i] = input;
        current_header_i++;
    }

    // leave when all headers renamed
    if(current_header_i == structured_data_headers.length)
    {
        rl_int.close();
        return write_structured_data_as_ttl();
    }

    // set next header
    rl_int.question('Change header name ' + current_header_i + ':"' + structured_data_headers[current_header_i] + '" to: ', set_headers_routine);
}

// rename headers or just continue
if(set_headers == 'true')
{
    console.log(`option set_headers set to TRUE, please input a name for each header(or leave empty to keep the default name) and press <Enter>!!! 
                    \n\n Note(header with name 'rename' will restart the whole process)`);
    set_headers_routine("rename");
}
else
{
    rl_int.close();
    return write_structured_data_as_ttl();
}


// remove  spaces : ; new lines from given string
function make_str_rdf_compatible(in_str)
{
    if ( !in_str)
    {
        return "None";
    }
    var out_str = in_str.replace(/\s+/g, '_');
    out_str = out_str.replace(/\./g, '_');
    out_str = out_str.replace(/\:/g, '');
    out_str = out_str.replace(/\;/g, '');
    return out_str;
}

// TODO Actually determine if a number by first casting in_str to different type and choosing most probable then returning the literal
function make_str_rdf_literal(in_str)
{
    // return as float or integer
    var in_str_as_number = Number(in_str);
    if(String(in_str_as_number) != 'NaN')
    {
        if(in_str_as_number % 1 == 0)
        {
            return '"' + in_str_as_number + '"^^xsd:integer'
        }
        return '"' + in_str_as_number + '"^^xsd:float'
    }

    // return as boolean
    if(in_str.toLowerCase() == 'true' || in_str.toLowerCase() == 'false')
    {
        return '"' + in_str.toLowerCase() + '"^^xsd:boolean';
    }

    // return as default literal
    return '"' + in_str + '"'
}

// convert to triple data
function write_structured_data_as_ttl()
{
    console.log("converting data...");
    var triple_data = [];
    for (sd_iter in structured_data)
    {
        // get subject name
        var subject = make_str_rdf_compatible(structured_data[sd_iter][main_subject_column]);
        if (subject == '')
        {
            continue;
        }

        // add base triples
        triple_data.push([prefix + subject, 'rdf:type', prefix + main_subject]);
        triple_data.push([prefix + subject,  prefix + make_str_rdf_compatible(structured_data_headers[main_subject_column]), make_str_rdf_literal(subject)]);

        // add the other triples
        for (ld_iter in structured_data[sd_iter])
        {
            if (ld_iter == main_subject_column)
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
    out_data = out_data + "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix "+ prefix +" <" + uri +"> .\n";
    for (t in triple_data)
    {
        // dont add malformed triples
        if (triple_data[t][2] == "None")
        {
            continue;
        }

        // check if can continue in series of previous triple
        if (last_subject != '')
        {
            if(last_subject == triple_data[t][0])
            {
                out_data = out_data + ';' + "\n    ";
                out_data = out_data + triple_data[t][1] + " " + triple_data[t][2] + " ";
                continue;
            } else
            {
                out_data = out_data + '.' + "\n\n";
            }
            
        }

        // add new triple
        out_data = out_data + triple_data[t][0] + " " + triple_data[t][1] + " " + triple_data[t][2] + " ";
        last_subject = triple_data[t][0];
    }
    fs.writeFileSync(out_path, out_data);
    console.log("converted succesfully");
    return 0;
}

return 0;
