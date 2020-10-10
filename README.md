# Gelada

## Installation

## Running Gelada


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
node scripts/csv_to_ttl.js in:=data/VideoGames.csv out:=data/VideoGames.ttl  char_newelement:=";" subject:="Game"
```
b. in case you downloaded the file with curl the sign should be a ,
```
node scripts/csv_to_ttl.js in:=data/VideoGames.csv out:=data/VideoGames.ttl  char_newelement:="," subject:="Game"
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
3. run the script html_to_csv_genres.js, this will scrape data from https://vsrecommendedgames.fandom.com/wiki/A_List_and_Guide_to_Game_Genres and save it as csv in data/VideoGamesGenres.csv
```
node scripts/html_to_csv_genres.js
```
4. run the script csv_to_tll to convert the resulting file.
```
node scripts/csv_to_ttl.js in:=data/VideoGameGenres.csv out:=data/VideoGameGenres.ttl  char_newelement:=";;" subject:="Genre"
```
5. see the output of the script in the directory data/VideoGameGenres.ttl
```
cat data/VideoGameConsoles.ttl
```

### running html_to_csv_consoles and the to csv_to_tll
1. have [nodejs](https://nodejs.org/en/download/) installed:  
2. run a terminal, clone this repository and go into the project work space
```
git clone https://github.com/krebsalad/Gelada
cd Gelada
```
3. run the script html_to_csv_genres.js, this will scrape data from https://www.videogameconsolelibrary.com/main-list-name.htm and save it as csv in data/VideoGamesGenres.csv 
```
node scripts/html_to_csv_consoles.js
```
4. run the script csv_to_tll to convert the resulting file.
```
node scripts/csv_to_ttl.js in:=data/VideoGameConsoles.csv out:=data/VideoGameConsoles.ttl  char_newelement:="," subject:="Console" subject_column:="2"
```
5. see the output of the script in the directory data/VideoGameConsoles.ttl
```
cat data/VideoGameConsoles.ttl
```