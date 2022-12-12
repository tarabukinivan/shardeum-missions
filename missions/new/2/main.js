const provider = new ethers.providers.Web3Provider(window.ethereum)

let connected = false;
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const chainID = document.querySelector('.chainID');

contract_abi = [{"inputs":[],"name":"newGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"players","outputs":[{"internalType":"uint256","name":"marblesOnTable","type":"uint256"},{"internalType":"uint256","name":"playerWins","type":"uint256"},{"internalType":"uint256","name":"computerWins","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"marblesAmount","type":"uint256"}],"name":"turn","outputs":[],"stateMutability":"nonpayable","type":"function"}] ;
contract_address = '0xa8D28246fdee56630C7Cbf3b7686077a69244880'; // Nim contract on shardeum liberty 1.6
const nimContract = new ethers.Contract(contract_address, contract_abi, provider);

async function updatePlayerState() {
  if (connected) {
    console.log('updating');
    playerState = await nimContract.players(getCurrentAccount());
    console.log(playerState);
    document.getElementById("marblesOnTable").textContent = playerState['marblesOnTable'];
    document.getElementById("playerWins").textContent = playerState['playerWins'];
    document.getElementById("computerWins").textContent = playerState['computerWins'];
  }
}
setInterval(updatePlayerState, 3000);

ethereumButton.addEventListener('click', () => {
  if (typeof window.ethereum !== 'undefined') {
    getAccount();
}
  else {
    alert('MetaMask is not installed !'); 
} 

});

async function getAccount() {
  const accounts = await provider.send("eth_requestAccounts", []);
  const account = accounts[0];
  showAccount.innerHTML = account;
  connected = true; 
}



const newGameButton = document.querySelector('.newGameButton');

async function getCurrentAccount() {
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  return accounts[0];
}

async function newGame() {
  
  const account = await getCurrentAccount();
  const signer = provider.getSigner()
  const nimWithSigner = nimContract.connect(signer);
  tx = nimWithSigner.newGame();
}

newGameButton.addEventListener('click', () => {
  newGame();
});
    

const turnButton = document.querySelector('.turnButton');

async function turn(amount) {
  
  const account = await getCurrentAccount();
  const signer = provider.getSigner()
  const nimWithSigner = nimContract.connect(signer);
  tx = nimWithSigner.turn(amount);
}

turnButton.addEventListener('click', () => {
  if (document.getElementById("marblesAmount").value == '') {
    alert("Enter a number as argument for turn() !");
  }
  else {
    amount = parseInt(document.getElementById("marblesAmount").value);
    turn(amount);
  }
});