# Gelada
A semantic web application for searching Platform exclusive Video Games

## Installation and Running Gelada
1. Clone this repository and go into the project work space
```
cd ~/
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
2. Download and Install [graphDB](https://www.ontotext.com/products/graphdb/)
3. Run Graph DB and create a new Repository called 'gelada' in lowercases, ensure OWL-Max (Optimized) ruleset is chosen, set the base url to 'http://www.gelada.org/ontology' and finally create the repository.
4. Select the repository and Import all the files within ~/Gelada/ontology starting with gla.ttl. These files can be found in the directory ~/Gelada/ontology. All files can be imported by selecting the select all box on the left top of uploaded files section and pressing import. 
5. After all the files are imported. Open the index.html file in Gelada/app/prod in a browser such as google chrome or firefox.

## Developing with gelada
1. Download [protoge](https://protege.stanford.edu/).
2. Start protoge and open gla.ttl.
3. Run the reasoner.
4. Add axioms...

## others

### running csv_to_ttl script

1. have [nodejs](https://nodejs.org/en/download/) installed:  
2. run a terminal, clone this repository and go into the project work space
```
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
3. download the following [csv file](https://corgis-edu.github.io/corgis/datasets/csv/video_games/video_games.csv) using curl or via browser and save it as data/VideoGames.csv in the directory Gelada/data
```
curl https://corgis-edu.github.io/corgis/datasets/csv/video_games/video_games.csv > data/VideoGames.csv
```
4. run the script using the following options (make sure to be in the Gelada project work space)
a. in case you downloaded the file manually, it seems to have a different row ending than when downloaded using curl, so the sign will have to be changed. In this case its ;. This can be configured in the script by adding the character sign after the prefix option.
```
node scripts/csv_to_ttl.js in:=data/VideoGames.csv out:=data/VideoGames.ttl  char_newelement:=";" subject:="Game" set_headers:=true set_property:=true uri:=http://www.gelada.org/ontology/ prefix:=gla extra_triples:=true
```
b. in case you downloaded the file with curl the sign should be a ,
```
node scripts/csv_to_ttl.js in:=data/VideoGames.csv out:=data/VideoGames.ttl  char_newelement:="," subject:="Game" set_headers:=true set_property:=true uri:=http://www.gelada.org/ontology/ prefix:=gla extra_triples:=true
```

5. see the output of the script in the directory data/VideoGames.ttl
```
cat data/VideoGames.ttl
```

6. (optional) the results of the script can be changed by redoing step 4 and changing header names and property types during the execution of the script. (Note that some characters are not formatted in the script. If this results in syntax problems, it is recommended to fix this manually by adding regex functions within the csv_to_ttl script, see the [make_str_rdf_compatible](https://github.com/krebsalad/Gelada/blob/main/scripts/csv_to_ttl.js#L211) for object types and [make_str_rdf_literal](https://github.com/krebsalad/Gelada/blob/main/scripts/csv_to_ttl.js#L253) for literal types )

### troubleshooting

1. I'm getting some connection error 
  Solution 1: is your GraphDB repository named gelada?
  Solution 2: try to replace the IP address in the GraphDB repository URL with localhost. For instance, replace http://192.168.0.102:7200/gelada with http://localhost:7200/gelada.

2. I'm getting an error concerning Access-Control-Allow-Origin
  Solution 1: Install the moesif CORS extension in your browser and turn it on.
  Solution 2: Add the following line in your GraphDB settings -Dgraphdb.workbench.cors.enable=True
