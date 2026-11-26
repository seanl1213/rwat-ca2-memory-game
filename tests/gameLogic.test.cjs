const {
    parseBoardDimensions,
    isValidBoard,
    cardsMatch
} = require('../gameLogic.cjs');

// Test 1: Valid board dimensions
test('should parse valid board dimensions', () => {
    expect(parseBoardDimensions('3x4')).toEqual([3, 4]);
});

// Test 2: Invalid board dimensions
test('should reject invalid board dimensions', () => {
    expect(parseBoardDimensions('abc')).toBeNull();
    expect(parseBoardDimensions('3x')).toBeNull();
});

// Test 3: Valid and invalid board sizes
test('should only accept even board sizes with up to 18 pairs', () => {
    expect(isValidBoard(3, 4)).toBe(true);
    expect(isValidBoard(3, 3)).toBe(false);
    expect(isValidBoard(6, 7)).toBe(false);
});

// Test 4: Matching and non-matching cards
test('should correctly identify matching cards', () => {
    const firstCard = { type: 'circle', colour: 'red' };
    const matchingCard = { type: 'circle', colour: 'red' };
    const differentCard = { type: 'square', colour: 'red' };

    expect(cardsMatch(firstCard, matchingCard)).toBe(true);
    expect(cardsMatch(firstCard, differentCard)).toBe(false);
});
