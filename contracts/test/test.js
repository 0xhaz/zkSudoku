const { expect } = require("chai");
const { exportCallDataGroth16 } = require("./utils/utils");
const hre = require("hardhat");

describe("Sudoku", () => {
  let SudokuVerifier, sudokuVerifier, Sudoku, sudoku, verifier;

  before(async () => {
    const [owner] = await hre.ethers.getSigners();

    SudokuVerifier = await hre.ethers.deployContract("SudokuVerifier");
    await SudokuVerifier.waitForDeployment();
    sudokuVerifier = await SudokuVerifier.getAddress();
    console.log("SudokuVerifier deployed to:", sudokuVerifier);

    verifier = await hre.ethers.getContractAt("SudokuVerifier", sudokuVerifier);

    Sudoku = await hre.ethers.deployContract("Sudoku", [sudokuVerifier]);
    await Sudoku.waitForDeployment();
    sudoku = await hre.ethers.getContractAt("Sudoku", Sudoku.target);
    console.log("Sudoku deployed to:", sudoku.target);
  });

  it("Should generate a board", async () => {
    let board = await sudoku.generateSudokuBoard(new Date().toString());
    expect(board.length).to.equal(9);
    expect(board[0].length).to.equal(9);
  });

  it("Should return true for valid proof on-chain", async () => {
    const unsolved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 0, 7],
    ];

    const solved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 8, 7],
    ];

    const input = {
      unsolved: unsolved,
      solved: solved,
    };

    let dataResult = await exportCallDataGroth16(
      input,
      "./zkproof/sudoku.wasm",
      "./zkproof/sudoku_final.zkey"
    );

    // Call the function
    let result = await verifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    expect(result).to.equal(true);
  });

  it("Should return false for invalid proof on-chain", async () => {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let Input = new Array(81).fill(0);

    let dataResult = { a, b, c, Input };

    // Call the function
    let result = await verifier.verifyProof(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    expect(result).to.equal(false);
  });

  it("Should verify Sudoku successfully", async () => {
    const unsolved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 0, 7],
    ];
    const solved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 8, 7],
    ];

    const input = {
      unsolved: unsolved,
      solved: solved,
    };

    let dataResult = await exportCallDataGroth16(
      input,
      "./zkproof/sudoku.wasm",
      "./zkproof/sudoku_final.zkey"
    );

    let result = await sudoku.verifySudoku(
      dataResult.a,
      dataResult.b,
      dataResult.c,
      dataResult.Input
    );
    expect(result).to.equal(true);
  });

  it("Should be reverted on Sudoku verification because the board is not in the board list", async () => {
    const unsolved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 8, 0],
    ];

    const solved = [
      [1, 2, 7, 5, 8, 4, 6, 9, 3],
      [8, 5, 6, 3, 7, 9, 1, 2, 4],
      [3, 4, 9, 6, 2, 1, 8, 7, 5],
      [4, 7, 1, 9, 5, 8, 2, 3, 6],
      [2, 6, 8, 7, 1, 3, 5, 4, 9],
      [9, 3, 5, 4, 6, 2, 7, 1, 8],
      [5, 8, 3, 2, 9, 7, 4, 6, 1],
      [7, 1, 4, 8, 3, 6, 9, 5, 2],
      [6, 9, 2, 1, 4, 5, 3, 8, 7],
    ];

    const input = {
      unsolved: unsolved,
      solved: solved,
    };

    let dataResult = await exportCallDataGroth16(
      input,
      "./zkproof/sudoku.wasm",
      "./zkproof/sudoku_final.zkey"
    );

    await expect(
      sudoku.verifySudoku(
        dataResult.a,
        dataResult.b,
        dataResult.c,
        dataResult.Input
      )
    ).to.be.reverted;
  });
});
