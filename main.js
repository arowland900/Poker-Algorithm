function hand(holeCards, communityCards) {
    //   return {type:"TODO", ranks: []};
    //   const VALUES contains all possible values for any card in the deck
      const SUITS = ['♠','♥','♦','♣']
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
      .sort((a,b) => VALUES[b[0]] - VALUES[a[0]])
      console.log(allCards)
      
      const allValues = allCards.map(c => c[0])
      const allSuits = allCards.map(c => c[1])
      
    //   LOGIC CHECK FOR STRAIGHT FLUSH
      let potential = []
      for(let i=0; i < 6; i++){
        let current = VALUES[allValues[i]]
        let next = VALUES[allValues[i+1]]
        if((current == next + 1 || current == next) && !potential.length){
          potential.push(allCards[i], allCards[i+1])
        } else if((current == next + 1 || current == next) 
          && (next + 1 == VALUES[potential[potential.length -1][0]] || next == VALUES[potential[potential.length -1][0]])){
          potential.push(allCards[i+1])
        }
      }  
      console.log(potential)
      
    }