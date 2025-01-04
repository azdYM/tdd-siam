import { MultiPlayerInputTest } from "./game.test.js";
import { Player, TeamPlayer } from "./Player.js";
import { PlayerEntries, PlayerManager } from "./PlayerManager.js";

test('player should have a name', async () => {
    const name = "Azad"
    const player = await loadSinglePlayer({name})
    expect(player?.name).toBe(name)
});

test('player should have a valid team (Elephant or Rhinoceros)', async () => {
    const team = "Rhinoceros"
    const player = await loadSinglePlayer({team})
    expect(player?.team).toBe(team)
});

test('player should throw an error for invalid team', async () => {
    expect(() => new Player().configure("Mina", "Tiger" as TeamPlayer, 5))
        .toThrowError("Invalid team: Tiger. Must be \"Elephan\" or \"Rinhoceros\".");
});

test('player without a team should not have any animal pieces', async () => {
    const player = await loadSinglePlayer({})
    expect(player?.getPieces()).toEqual([])
});

test('animal pieces should have the correct type', async () => {
    const numberOfPieces = 5
    const player = await loadSinglePlayer(
        { name: 'Yoma', team: 'Elephant' }, 
        numberOfPieces
    );
    const pieces = player?.getPieces();

    expect(player?.getPieces().length).toBe(numberOfPieces)
    expect(pieces?.every(piece => piece.type === 'Elephant')).toBe(true);
});

async function loadSinglePlayer(entries: PlayerEntries, numberOfPiecesPerPlayer: number = 0) {
    const manager = await createPlayerManager([entries])
    return await manager.execute(numberOfPiecesPerPlayer) as Player
}

async function createPlayerManager(entries: PlayerEntries[]) {
    const input = new MultiPlayerInputTest(entries)
    return new PlayerManager(input)
}