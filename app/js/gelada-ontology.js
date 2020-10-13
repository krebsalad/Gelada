function createDummyOntology($sce) {
    let games = [];

    let ps4 = new HomeConsole();
    ps4.name = "Playstation 4";
    ps4.imgUrl = "https://images-na.ssl-images-amazon.com/images/I/61ryVJLDlFL._AC_SX569_.jpg";
    ps4.abstract = "Playstation 4 is a Sony game console released on 15 november 2013. It is the best sold console every made.";
    ps4.alternativeName = "Sony Playstation 4";
    ps4.generation = 8;

    let xboxOne = new HomeConsole();
    xboxOne.name = "Xbox One";
    xboxOne.imgUrl = "https://brain-images-ssl.cdn.dixons.com/1/7/10183671/u_10183671.jpg";
    xboxOne.abstract = "The Xbox One is a Microsoft game console released on the 22nd of november, 2013.";
    xboxOne.alternativeName = "Xbox 1";
    xboxOne.generation = 8;

    let gtav = new Game();
    gtav.platforms.push(xboxOne, ps4);
    gtav.name = "Grand Theft Auto V";
    gtav.alternativeName = "GTA V";
    gtav.developer = new Developer("Rockstar Games");
    gtav.publisher = new Publisher("Rockstar Games");
    gtav.manufacturer = new Manufacturer("Rockstar North");
    gtav.writers.push(new Writer("Dan Houser"), new Writer("Rupert Humpries"), new Writer("Michael Unsworth"))
    gtav.artists.push(new Artist("Anthony Macbain"));
    gtav.characters.push(new Character("Trevor Philips"), new Character("Michael De Santa"), new Character("Lamar Davis"));
    gtav.series = new Series("Grand Theft Auto");
    gtav.genre = new Genre("Action", "");
    gtav.exclusive = false;
    gtav.videoUrl = $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=QkkoHAzjnUs");
    gtav.imgUrl = "https://www.nedgame.nl/afbeeldingen/pc-gaming/cover/grand-theft-auto-5--gta-v--pc-gaming_7131173940.jpg?1539697159";
    gtav.singleplayer = true;
    gtav.multiplayer = true;
    gtav.abstract = "Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the first main entry in the Grand Theft Auto series since 2008's Grand Theft Auto IV. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa, street gangster Franklin Clinton, and drug dealer and arms smuggler Trevor Philips—and their efforts to commit heists while under pressure from a corrupt government agency and powerful crime figures. The open world design lets players freely roam San Andreas' open countryside and the fictional city of Los Santos, based on Los Angeles.";
    gtav.releaseDate = "17 september 2013";
    games.push(gtav);

    return games;
}


class Game {
    id = Math.floor(Math.random() * 1000000);
    name;
    alternativeName;
    developer;
    publisher;
    manufacturer;
    composer;
    writers = [];
    artists = [];
    directors = [];
    characters = [];
    platforms = [];
    series;
    genre;
    exclusive;
    videoUrl;
    imgUrl;
    singleplayer;
    multiplayer;
    abstract;
    releaseDate;
}

class Platform {
    name;
    alternativeName;
    generation;
    abstract;
    imgUrl;
}

class HomeConsole extends Platform {
}

class HandheldConsole extends Platform {
}

class Genre {
    name;
    alternativeName;


    constructor(name, alternativeName) {
        this.name = name;
        this.alternativeName = alternativeName;
    }
}

class Series {
    name;

    constructor(name) {
        this.name = name;
    }
}

class Character {
    name;

    constructor(name) {
        this.name = name;
    }
}

class Creator {
    name;

    constructor(name) {
        this.name = name;
    }
}

class Director extends Creator {

}

class Artist extends Creator {

}

class Writer extends Creator {

}

class Composer extends Creator {

}

class Organization {
    name;

    constructor(name) {
        this.name = name;
    }
}

class Developer extends Organization {

}

class Publisher extends Organization {

}

class Manufacturer extends Organization {

}


