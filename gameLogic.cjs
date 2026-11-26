// Convert the board size into rows and columns
function parseBoardDimensions(size) {
    if (!size) return null;

    const dimensions = size.toLowerCase().split('x').map(Number);

    // Check that exactly two positive whole numbers were provided
    if (
        dimensions.length !== 2 ||
        dimensions.some(number => !Number.isInteger(number) || number < 1)
    ) {
        return null;
    }

    return dimensions;
}

// Check whether the board has a valid number of cards
function isValidBoard(rows, columns) {
    const totalCards = rows * columns;

    // The board needs an even number of cards and no more than 18 pairs
    return totalCards % 2 === 0 && totalCards / 2 <= 18;
}

// Check whether two cards have matching shapes and colours
function cardsMatch(firstCard, secondCard) {
    return (
        firstCard.type === secondCard.type &&
        firstCard.colour === secondCard.colour
    );
}

// Export functions so they can be used in the game and unit tests
module.exports = {
    parseBoardDimensions,
    isValidBoard,
    cardsMatch
};
