# Gelada

## Installation and Running Gelada
1. Clone this repository and go into the project work space
```
cd ~/
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
2. Download and Install [graphDB](https://www.ontotext.com/products/graphdb/)
3. Run Graph DB and create a new Repository called 'gelada' in lowercases, ensure OWL-Max (Optimized) ruleset is chosen, set the base url to 'http://www.gelada.org/ontology' and finally create the repository.
4. Select the repository and Import the following files starting with gla.ttl. These files can be found in the directory ~/Gelada/ontology.
    - gla.ttl
    - gla_video_game_genres.ttl
    - gla_video_game_names.ttl
    - gla_exclusive_video_games.ttl
    - gla_video_game_consoles.ttl
    - gla_video_games.ttl
5. Open the index.html file in Gelada/app/prod in a browser such as google chrome or firefox

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

### running html_to_csv_genres and the to csv_to_tll
1. have [nodejs](https://nodejs.org/en/download/) installed:  
2. run a terminal, clone this repository and go into the project work space
```
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
3. run the script html_to_csv_genres.js, this will scrape data from https://vsrecommendedgames.fandom.com/wiki/A_List_and_Guide_to_Game_Genres and save it as csv in data/VideoGameGenres.csv
```
node scripts/html_to_csv_genres.js
```
4. run the script csv_to_tll to convert the resulting file, press enter on all prompts
```
node scripts/csv_to_ttl.js in:=data/VideoGameGenres.csv out:=data/VideoGameGenres.ttl  char_newelement:=";;" subject:="Genre" set_headers:=true set_property:=true uri:=http://www.gelada.org/ontology/ prefix:=gla extra_triples=true
```
5. see the output of the script in the directory data/VideoGameGenres.ttl
```
cat data/VideoGameGenres.ttl
```

### running html_to_csv_consoles and the to csv_to_tll
1. have [nodejs](https://nodejs.org/en/download/) installed:  
2. run a terminal, clone this repository and go into the project work space
```
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
3. run the script html_to_csv_genres.js, this will scrape data from https://www.videogameconsolelibrary.com/main-list-name.htm and save it as csv in data/VideoGameGenres.csv 
```
node scripts/html_to_csv_consoles.js
```
4. run the script csv_to_tll to convert the resulting file, press enter on all prompts
```
node scripts/csv_to_ttl.js in:=data/VideoGameConsoles.csv out:=data/VideoGameConsoles.ttl  char_newelement:="," subject:="Platform" set_headers:=true set_property:=true uri:=http://www.gelada.org/ontology/ prefix:=gla extra_triples:=true subject_column:=2
```
5. see the output of the script in the directory data/VideoGameConsoles.ttl
```
cat data/VideoGameConsoles.ttl
```

### running html_to_csv_exclusives and the to csv_to_tll
1. have [nodejs](https://nodejs.org/en/download/) installed:  
2. run a terminal, clone this repository and go into the project work space
```
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
3. run the script html_to_csv_genres.js, this will scrape data from https://www.gematsu.com/exclusives and save it as csv in data/VideoGameExclusives.csv 
```
node scripts/html_to_csv_exclusives.js
```
4. run the script csv_to_tll to convert the resulting file, press enter on all prompts
```
node scripts/csv_to_ttl.js in:=data/VideoGameExclusives.csv out:=data/VideoGameExclusives.ttl  char_newelement:="," subject:="ExclusiveGame" set_headers:=true set_property:=true uri:=http://www.gelada.org/ontology/ prefix:=gla extra_triples:=true
```
5. see the output of the script in the directory data/VideoGameExclusives.ttl
```
cat data/VideoGameExclusives.ttl
```