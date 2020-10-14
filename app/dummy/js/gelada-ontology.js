function createDummyOntology($sce) {

    let ps4 = new HomeConsole();
    ps4.name = "Playstation 4";
    ps4.imgUrl = "https://images-na.ssl-images-amazon.com/images/I/61ryVJLDlFL._AC_SX569_.jpg";
    ps4.abstract = "Playstation 4 is a Sony game console released on 15 november 2013. It is the best sold console every made.";
    ps4.alternativeName = "Sony Playstation 4";
    ps4.generation = 8;

    let ps2 = new HomeConsole();
    ps2.name = "Playstation 2";
    ps2.imgUrl = "https://media.s-bol.com/31lwXAzR7rxA/1200x1135.jpg";
    ps2.abstract = "The PlayStation 2 (PS2) is a home video game console developed and marketed by Sony Computer Entertainment";
    ps2.alternativeName = "Sony Playstation 2";
    ps2.generation = 6;

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


    let gt3 = new Game();
    gt3.platforms.push(ps2);
    gt3.name = "Gran Turismo 2";
    gt3.alternativeName = "GT2";
    gt3.developer = new Developer("Polyphony Digital");
    gt3.publisher = new Publisher("Polyphony Digital");
    gt3.manufacturer = new Manufacturer("Polyphony Digital");
    gt3.artists.push(new Artist("Kazunori Yamauchi"));
    gt3.series = new Series("Gran Turismo");
    gt3.genre = new Genre("Sim Racing", "Simulated Racing");
    gt3.exclusive = true;
    gt3.videoUrl = $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=QkkoHAzjnUs");
    gt3.imgUrl = "https://images-na.ssl-images-amazon.com/images/I/61qihEdj%2B5L._SL1000_.jpg";
    gt3.singleplayer = true;
    gt3.multiplayer = true;
    gt3.abstract = "Gran Turismo 2 is a racing game for the PlayStation. Gran Turismo 2 was developed by Polyphony Digital and published by Sony Computer Entertainment in 1999. It is the sequel to Gran Turismo. It was well-received critically and financially, shipping 1.71 million copies in Japan, 20,000 in Southeast Asia, 3.96 million in North America, and 3.68 million in Europe for a total of 9.37 million copies as of April 30, 2008,[2][3] and eventually becoming a Sony Greatest Hits game. The title received an average of 93% in Metacritic's aggregate.";
    gt3.releaseDate = "11 december 1999";


    let games = [gtav, gt3];
    games.sort((a, b)=>{
        return a.name.localeCompare(b.name);
    })
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


