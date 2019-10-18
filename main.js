function hand(holeCards, communityCards) {
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
    const allCards = [...holeCards, ...communityCards]
        .map(c => c.includes(10) ? `T${c[2]}` : c)
        .sort((a, b) => VALUES[b[0]] - VALUES[a[0]])
    const allValues = allCards.map(c => c[0])

    //   LOGIC CHECK FOR STRAIGHT FLUSH
    let potential = []
    for (let j = 0; j < 3; j++) {
        for (let i = j; i < 7; i++) {
            let current = VALUES[allValues[i]]
            let next = VALUES[allValues[i + 1]]
            if ((current == next + 1 || current == next) && !potential.length) {
                potential.push(allCards[i], allCards[i + 1])
            } else if ((current == next + 1 || current == next)
                && (next + 1 == VALUES[potential[potential.length - 1][0]] || next == VALUES[potential[potential.length - 1][0]])) {
                potential.push(allCards[i + 1])
            }
            console.log("UPPER POTENTIAL", potential)
        }
        if (potential.length >= 5) break
        else potential = []
    }
    let noDuplicates = []
    for (let i = 0; i < 4; i++) {
        noDuplicates = potential.filter(c => c.includes(SUITS[i]))
        console.log("POTENTIAL")
        console.log(potential)
        console.log("NO DUPLICATES")
        console.log(noDuplicates)
        let noDupValues = noDuplicates.map(c => c[0])
        let finalPotential = []
        for (let i = 0; i < noDupValues.length - 1; i++) {
            let current = VALUES[noDupValues[i]]
            let next = VALUES[noDupValues[i + 1]]
            if ((current == next + 1 || current == next) && !finalPotential.length) {
                finalPotential.push(noDuplicates[i], noDuplicates[i + 1])
            } else if ((current == next + 1 || current == next)
                && (next + 1 == VALUES[finalPotential[finalPotential.length - 1][0]] || next == VALUES[finalPotential[finalPotential.length - 1][0]])) {
                finalPotential.push(noDuplicates[i + 1])
            }
            console.log("UPPER POTENTIAL", finalPotential)
        }

        if (finalPotential.length > 4) {
            console.log(" NO D GREATER THAN 4")
            console.log('ranks befiore', ranks)
            ranks = noDuplicates.slice(0, 5)
                .map(c => c[0])
                .map(c => c == 'T' ? 10 : c)
            type = 'straight-flush'

            return { type, ranks };
        } else {
            //       storing straigt potential for later
            if (potential.length > 4) {
                console.log("HITTING POTENTIAL BELOW STR8 FLUSH")
                console.log(potential)
                let p = [...new Set(potential.map(c => c[0]))]
                if (p.length > 4) {
                    type = 'straight'
                }
            }
        }
    }

    //   FOUR OF A KIND LOGIC CHECK (also 'multiples' variable saved for future reference)
    let multiples, others, fullHouseSave, fullHouseOthers, pairSave, pairOthers
    for (let i = 0; i < allCards.length; i++) {
        multiples = allCards.filter(c => allValues[i] == c[0])
        others = allCards
            .filter(c => allValues[i] != c[0])
            .sort((a, b) => VALUES[b[0]] - VALUES[a[0]])
        if (multiples.length == 4) {
            ranks = [multiples[0][0], others[0][0]].map(c => c == 'T' ? 10 : c)
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
        } else if (multiples.length == 2) {
            if (!pairSave) {
                pairSave = multiples
                pairOthers = allCards.filter(c => !pairSave.includes(c))
            } else {
                if (!pairSave.includes(multiples)) {
                    pairSave = [...pairSave, ...multiples]
                }
                pairOthers = allCards.filter(c => !pairSave.includes(c))
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
            ranks = [...new Set(ranks.map(c => c[0]).map(c => c == 'T' ? 10 : c))]
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
    //   STRAIGHT LOGIC CHECK
    if (type) {
        console.log("HITTING STRAIGHT -----------")
        console.log("type", type)
        console.log("ranks", ranks)
        ranks = [...new Set(potential
            .map(c => c[0])
            .map(c => c == 'T' ? 10 : c))].slice(0, 5)
        return { type, ranks };
    }

    //   THREE OF A KIND LOGIC CHECK
    if (fullHouseSave) {
        type = 'three-of-a-kind'
        ranks = [fullHouseSave[0][0], fullHouseOthers[0][0], fullHouseOthers[1][0]]
            .map(c => c == 'T' ? 10 : c)
        return { type, ranks };
    }



    console.log('PAIRS', pairSave)
    console.log('-----------------------')
    console.log('OTHERS', pairOthers)



    if (pairSave) {
        pairSave = [...new Set(pairSave)]
        if (pairSave.length > 4) {
            type = 'two pair'
            let third = pairSave[4][0] > pairOthers[0][0] ? pairSave[4][0] : pairOthers[0][0]
            ranks = [pairSave[0][0], pairSave[2][0], third]
                .map(c => c == 'T' ? 10 : c)
            return { type, ranks }
        } else if (pairSave.length == 4) {
            type = 'two pair'
            ranks = [pairSave[0][0], pairSave[2][0], pairOthers[0][0]]
                .map(c => c == 'T' ? 10 : c)
            return { type, ranks }
        } else if (pairSave.length == 2) {
            type = 'pair'
            pairOthers = pairOthers.slice(0, 3).map(c => c[0])
            ranks = [pairSave[0][0], ...pairOthers]
                .map(c => c == 'T' ? 10 : c)
            return { type, ranks }
        }
    } else {
        ranks = allValues.slice(0, 5).map(c => c == 'T' ? 10 : c)
        type = 'nothing'
        return { type, ranks }
    }


}