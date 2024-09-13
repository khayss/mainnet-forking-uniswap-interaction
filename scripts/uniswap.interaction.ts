import { ethers } from "hardhat";
// import helpers from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function main() {
  const UNISWAP_V2_ROUTER_2_CONTRACT_ADDRESS =
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const UNISWAP_V3_ROUTER_2_CONTRACT_ADDRESS =
    "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const TOKEN_HOLDER_ADDRESS = "0xDab2C634be69ace559670ee8686E73FeD406644B";

  const impersonatedAccount = await ethers.getImpersonatedSigner(
    TOKEN_HOLDER_ADDRESS
  );

  const uniswapV3Contract = await ethers.getContractAt(
    "ISwapRouter",
    UNISWAP_V3_ROUTER_2_CONTRACT_ADDRESS
  );
  const uniswapV2Contract = await ethers.getContractAt(
    "IUniswapV2Router02",
    UNISWAP_V2_ROUTER_2_CONTRACT_ADDRESS
  );

  const usdtContract = await ethers.getContractAt(
    "IERC20",
    USDT_CONTRACT_ADDRESS
  );
  const usdcContract = await ethers.getContractAt(
    "IERC20",
    USDC_CONTRACT_ADDRESS
  );

  const usdcDecimals = await usdcContract.decimals();
  const usdtDecimals = await usdtContract.decimals();

  // SWAP USDC to USDT

  const usdcAmountIn = ethers.parseUnits("1000", usdcDecimals);
  const usdtAmountOutMin = ethers.parseUnits("900", usdtDecimals);

  const userUsdtBalBeforeSwap = await usdtContract.balanceOf(
    TOKEN_HOLDER_ADDRESS
  );
  const userUsdcBalBeforeSwap = await usdcContract.balanceOf(
    TOKEN_HOLDER_ADDRESS
  );

  console.log(
    `User USDT balance before swap: ${userUsdtBalBeforeSwap.toString()}`
  );
  console.log(
    `User USDC balance before swap: ${userUsdcBalBeforeSwap.toString()}`
  );

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  console.log("Approving USDC...");
  const approveUsdcTx = await usdcContract
    .connect(impersonatedAccount)
    .approve(UNISWAP_V2_ROUTER_2_CONTRACT_ADDRESS, usdcAmountIn);
  console.log("Approve USDC Transaction hash: ", approveUsdcTx.hash);
  const approveUsdcTxResult = await approveUsdcTx.wait();
  console.log(
    "Approve USDC Transaction Confirmed with status : ",
    approveUsdcTxResult.status === 1 ? "Success" : "Failed"
  );
  console.log("Approving USDC... Done");

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  console.log("starting swap...");
  const swapExactInputSingleTx = await uniswapV2Contract
    .connect(impersonatedAccount)
    .swapExactTokensForTokens(
      usdcAmountIn,
      usdtAmountOutMin,
      [USDC_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS],
      TOKEN_HOLDER_ADDRESS,
      Math.floor(Date.now() / 1000) + 60 * 20
    );

  //    await uniswapV3Contract
  //     .connect(impersonatedAccount)
  //     .exactInputSingle({
  //       tokenIn: USDC_CONTRACT_ADDRESS,
  //       tokenOut: USDT_CONTRACT_ADDRESS,
  //       amountIn: usdcAmountIn,
  //       amountOutMinimum: 0,
  //       fee: 3000,
  //       deadline: Math.floor(Date.now() / 1000) + 60 * 20,
  //       sqrtPriceLimitX96: 0,
  //       recipient: TOKEN_HOLDER_ADDRESS,
  //     });
  console.log("swap executed with hash: ", swapExactInputSingleTx.hash);
  const txResult = await swapExactInputSingleTx.wait();
  console.log(
    "Transaction confirmed with status: ",
    txResult?.status === 1 ? "Success" : "Failed"
  );
  console.log("Swap Transaction: Done");

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  const userUsdtBalAfterSwap = await usdtContract.balanceOf(
    TOKEN_HOLDER_ADDRESS
  );
  const userUsdcBalAfterSwap = await usdcContract.balanceOf(
    TOKEN_HOLDER_ADDRESS
  );

  console.log(
    `User USDT balance after swap: ${userUsdtBalAfterSwap.toString()}`
  );
  console.log(
    `User USDC balance after swap: ${userUsdcBalAfterSwap.toString()}`
  );

  // PROVIDE LIQUIDITY
  const usdtBalBeforeLP = await usdtContract.balanceOf(TOKEN_HOLDER_ADDRESS);
  const usdcBalBeforeLP = await usdcContract.balanceOf(TOKEN_HOLDER_ADDRESS);

  console.log("User USDT balance before LP: ", usdtBalBeforeLP.toString());
  console.log("User USDC balance before LP: ", usdcBalBeforeLP.toString());

  const usdtLPAmountIn = ethers.parseUnits("1000", usdtDecimals);
  const usdcLPAmountIn = ethers.parseUnits("1000", usdcDecimals);

  console.log("Approving USDT for LP...");
  const approveUsdtForLP = await usdtContract
    .connect(impersonatedAccount)
    .approve(UNISWAP_V2_ROUTER_2_CONTRACT_ADDRESS, usdtLPAmountIn);
  console.log("Approve USDT for LP Transaction hash: ", approveUsdtForLP.hash);
  const approveUsdtForLPResult = await approveUsdtForLP.wait();
  console.log(
    "Approve USDT for LP Transaction Confirmed with status : ",
    approveUsdtForLPResult.status === 1 ? "Success" : "Failed"
  );
  console.log("Approving USDT for LP... Done");

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  console.log("Approving USDC for LP...");
  const approveUsdcForLP = await usdcContract
    .connect(impersonatedAccount)
    .approve(UNISWAP_V2_ROUTER_2_CONTRACT_ADDRESS, usdcLPAmountIn);
  console.log("Approve USDC for LP Transaction hash: ", approveUsdcForLP.hash);
  const approveUsdcForLPResult = await approveUsdcForLP.wait();
  console.log(
    "Approve USDC for LP Transaction Confirmed with status : ",
    approveUsdcForLPResult.status === 1 ? "Success" : "Failed"
  );
  console.log("Approving USDC for LP... Done");

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  console.log("Adding liquidity...");
  const addLpTx = await uniswapV2Contract.addLiquidity(
    USDC_CONTRACT_ADDRESS,
    USDT_CONTRACT_ADDRESS,
    usdcLPAmountIn,
    usdtLPAmountIn,
    0,
    0,
    TOKEN_HOLDER_ADDRESS,
    Math.floor(Date.now() / 1000) + 60 * 20
  );
  console.log("Add liquidity executed with hash: ", addLpTx.hash);
  const addLpTxResult = await addLpTx.wait();
  console.log(
    "Add liquidity Transaction confirmed with status: ",
    addLpTxResult?.status === 1 ? "Success" : "Failed"
  );
  console.log("Adding liquidity... Done");

  console.log("\n");
  console.log("===========================================================");
  console.log("\n");

  const usdtBalAfterLP = await usdtContract.balanceOf(TOKEN_HOLDER_ADDRESS);
  const usdcBalAfterLP = await usdcContract.balanceOf(TOKEN_HOLDER_ADDRESS);

  console.log("User USDT balance after LP: ", usdtBalAfterLP.toString());
  console.log("User USDC balance after LP: ", usdcBalAfterLP.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
