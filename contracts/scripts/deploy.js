const main = async () => {
  const SudokuVerifier = await hre.ethers.deployContract("SudokuVerifier");
  await SudokuVerifier.waitForDeployment();
  const sudokuVerifier = await SudokuVerifier.getAddress();
  console.log("SudokuVerifier deployed to:", sudokuVerifier);

  verifier = await hre.ethers.getContractAt("SudokuVerifier", sudokuVerifier);

  Sudoku = await hre.ethers.deployContract("Sudoku", [sudokuVerifier]);
  await Sudoku.waitForDeployment();
  sudoku = await hre.ethers.getContractAt("Sudoku", Sudoku.target);
  console.log("Sudoku deployed to:", sudoku.target);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
