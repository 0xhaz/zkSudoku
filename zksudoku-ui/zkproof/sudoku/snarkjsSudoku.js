import { exportCallDataGroth16 } from "./snarkjsZkproof.js";

export async function sudokuCalldata(unsolved, solved) {
  const input = {
    unsolved: unsolved,
    solved: solved,
  };

  let dataResult;

  try {
    dataResult = await exportCallDataGroth16(
      input,
      "/zkproof/sudoku.wasm",
      "/zkproof/sudoku_final.zkey"
    );
  } catch (error) {
    windows.alert("Wrong answer");
  }

  return dataResult;
}
