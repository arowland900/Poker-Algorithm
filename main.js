function hand(holeCards, communityCards) {
    //   return {type:"TODO", ranks: []};
    //   const VALUES contains all possible values for any card in the deck
    const SUITS = ['♥', '♠', '♦', '♣']
    const VALUES = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'J': 11,
        'T': 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2,
    }
    let type, ranks = []
    //   allCards contains the holeCards & the communityCards, sorted from highest to lowest, 
    //   with '10' saved as'T' to make each card 2 elements long (value & suit)
    const allCards = [...holeCards, ...communityCards]
        .map(c => c.includes(10) ? `T${c[2]}` : c)
        .sort((a, b) => VALUES[b[0]] - VALUES[a[0]])
    console.log(allCards)

    const allValues = allCards.map(c => c[0])
    const allSuits = allCards.map(c => c[1])

    //   LOGIC CHECK FOR STRAIGHT FLUSH
    let potential = []
    for (let i = 0; i < 6; i++) {
        let current = VALUES[allValues[i]]
        let next = VALUES[allValues[i + 1]]
        if ((current == next + 1 || current == next) && !potential.length) {
            potential.push(allCards[i], allCards[i + 1])
        } else if ((current == next + 1 || current == next)
            && (next + 1 == VALUES[potential[potential.length - 1][0]] || next == VALUES[potential[potential.length - 1][0]])) {
            potential.push(allCards[i + 1])
        }
    }
    let noDuplicates = []
    for (let i = 0; i < 4; i++) {
        noDuplicates = potential.filter(c => c.includes(SUITS[i]))
        if (noDuplicates.length > 4) {
            ranks = noDuplicates.slice(0, 5)
                .map(c => c[0])
                .map(c => c == 'T' ? 10 : c)
            type = 'straight-flush'
            return { type, ranks };
        }
    }

    //   FOUR OF A KIND LOGIC CHECK (also 'multiples' variable saved for future reference)
    let multiples, others, fullHouseSave, fullHouseOthers
    for (let i = 0; i < allCards.length; i++) {
        multiples = allCards.filter(c => allValues[i] == c[0])
        others = allCards
            .filter(c => allValues[i] != c[0])
            .sort((a, b) => VALUES[b[0]] - VALUES[a[0]])
        if (multiples.length == 4) {
            ranks = [multiples[0][0], others[0][0]]
            type = 'four-of-a-kind'
            return { type, ranks };
        } else if (multiples.length == 3) {
            if (!fullHouseSave) {
                fullHouseSave = multiples
                fullHouseOthers = others
            } else {
                fullHouseSave = multiples[0][0] > fullHouseSave[0][0] ? multiples : fullHouseSave
                fullHouseOthers = multiples[0][0] > fullHouseSave[0][0] ? others : fullHouseOthers
            }
        }
    }

    //   FULL HOUSE LOGIC CHECK
    if (fullHouseSave) {
        ranks = [...fullHouseSave]
        for (let i = 0; i < fullHouseOthers.length; i++) {
            let pair = fullHouseOthers.filter(c => c[0] == fullHouseOthers[i][0])
            if (pair.length >= 2) {
                if (ranks.length == 3) {
                    ranks.push(pair[0], pair[1])
                }
                if (VALUES[pair[0][0]] > VALUES[ranks[4][0]]) {
                    ranks = [...fullHouseSave, pair[0], pair[1]]
                }
            }
        }
        if (ranks.length == 5) {
            type = 'full house'
            ranks = [...new Set(ranks.map(c => c[0]))]
            return { type, ranks };
        }
    }

    //   FLUSH LOGIC CHECK
    for (let i = 0; i < 4; i++) {
        let suitMatch = allCards.filter(c => c.includes(SUITS[i]))
        if (suitMatch.length > 4) {
            ranks = suitMatch.slice(0, 5)
                .map(c => c[0])
                .map(c => c == 'T' ? 10 : c)
            type = 'flush'
            return { type, ranks };
        }
    }

}