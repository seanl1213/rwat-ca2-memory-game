import { ShapeCard } from './shapecard.js';
import { db } from './firebase.js';
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

// Custom element that manages the memory card game
class MemoryGame extends HTMLElement {

    constructor() {
        super();

        // Track the state of the game
        this.firstCard = null;
        this.lockBoard = false;
        this.clicks = 0;
        this.matchedPairs = 0;
        this.gameCompleted = false;
    }

    connectedCallback() {

        // Read board dimensions from the size attribute
        const size = this.getAttribute('size');
        const dimensions = size?.toLowerCase().split('x').map(Number);

        if (
            !dimensions ||
            dimensions.length !== 2 ||
            dimensions.some(n => !Number.isInteger(n) || n < 1)
        ) {
            this.textContent = 'Invalid board dimensions.';
            return;
        }

        const [rows, columns] = dimensions;
        const totalCards = rows * columns;

        // Check that the board has a valid number of cards
        if (totalCards % 2 !== 0 || totalCards / 2 > 18) {
            this.textContent = 'Invalid board size.';
            return;
        }

        this.totalPairs = totalCards / 2;

        this.renderBoard(rows, columns);
    }

    renderBoard(rows, columns) {

        // Generate random cards with matching duplicates
        const cards = ShapeCard.getUniqueRandomCardsAsHTML(
            this.totalPairs,
            true
        );

        this.innerHTML = `
            <style>
                .game {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }

                .board {
                    display: grid;
                    grid-template-columns: repeat(${columns}, 100px);
                    gap: 12px;
                    justify-content: center;
                    margin: 20px auto;
                }

                shape-card {
                    cursor: pointer;
                }

                .status {
                    font-weight: bold;
                    margin-top: 15px;
                }
            </style>

            <div class="game">
                <h1>Memory Card Game</h1>
                <p>Find all the matching pairs!</p>

                <p>Clicks: <span id="click-count">0</span></p>

                <div class="board">
                    ${cards}
                </div>

                <p class="status" id="status">Game in progress</p>

                <button id="average-button">
                    Show average clicks
                </button>

                <p id="average-result"></p>
            </div>
        `;

        // Add click listeners to every card
        this.querySelectorAll('shape-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
        });

        // Add listener for average clicks button
        this.querySelector('#average-button').addEventListener('click', () => {
            this.showAverageClicks();
        });
    }

    handleCardClick(card) {

        // Ignore clicks when the board is locked or card is already revealed
        if (
            this.lockBoard ||
            this.gameCompleted ||
            card.isFaceUp() ||
            card.dataset.matched === 'true'
        ) {
            return;
        }

        // Reveal selected card
        card.flip();

        this.clicks++;

        // Update click counter
        this.querySelector('#click-count').textContent = this.clicks;

        // Store first selected card
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        // Compare the two selected cards
        const first = this.firstCard;
        const second = card;

        const isMatch =
            first.getAttribute('type') === second.getAttribute('type') &&
            first.getAttribute('colour') === second.getAttribute('colour');

        if (isMatch) {

            // Mark both cards as matched
            first.dataset.matched = 'true';
            second.dataset.matched = 'true';

            this.matchedPairs++;
            this.firstCard = null;

            // Check whether all pairs have been found
            if (this.matchedPairs === this.totalPairs) {
                this.gameCompleted = true;
                this.completeGame();
            }

        } else {

            // Lock the board while mismatched cards are visible
            this.lockBoard = true;

            setTimeout(() => {

                first.flip();
                second.flip();

                this.firstCard = null;
                this.lockBoard = false;

            }, 1000);
        }
    }

    // Save completed game result to Firestore
    async completeGame() {

        this.querySelector('#status').textContent =
            `Congratulations! Completed in ${this.clicks} clicks. Saving result...`;

        try {

            await addDoc(collection(db, 'gameResults'), {
                clicks: this.clicks,
                completedAt: serverTimestamp()
            });

            this.querySelector('#status').textContent =
                `Congratulations! Completed in ${this.clicks} clicks. Result saved!`;

        } catch (error) {

            console.error('Error saving game result:', error);

            this.querySelector('#status').textContent =
                'Game completed, but the result could not be saved.';
        }
    }

    // Retrieve results and calculate average clicks
    async showAverageClicks() {

        const resultElement = this.querySelector('#average-result');

        resultElement.textContent = 'Calculating average...';

        try {

            const querySnapshot = await getDocs(
                collection(db, 'gameResults')
            );

            if (querySnapshot.empty) {
                resultElement.textContent = 'No completed games recorded yet.';
                return;
            }

            // Calculate total clicks
            let totalClicks = 0;

            querySnapshot.forEach(document => {
                totalClicks += document.data().clicks;
            });

            // Calculate average
            const average = totalClicks / querySnapshot.size;

            resultElement.textContent =
                `Average clicks: ${average.toFixed(2)} (${querySnapshot.size} games)`;

        } catch (error) {

            console.error('Error retrieving game results:', error);

            resultElement.textContent =
                'Unable to retrieve game results.';
        }
    }
}

// Register custom HTML element
customElements.define('memory-game', MemoryGame);

