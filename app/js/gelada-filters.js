class Filterable {

    filter(games) {
    }
}

class GenerationFilter extends Filterable {

    constructor() {
        super();

    }

    filter(games, scope) {
        const scopeVar = scope.chosenGen;
        games.removeIf(g => {
            if (scopeVar.length > 0) {
                games.removeIf(g => {
                    let hasGen = false;
                    g.platforms.forEach(p => hasGen |= p.generation === parseInt(scopeVar));
                    return !hasGen;
                });
            }
        });
    }
}

Array.prototype.removeIf = function (callback) {
    let i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};