$(document).ready(function() {

	var account;
	var web3Provider;

	var contract_token;
	var contract_faucet;
	var token_address = '0x4ecc65e392eb078926bbe36d5c46e6824b14950a';
	var faucet_address = '0x0000000000000000000000000000000000000000';

	var balanceETH = 0;
	var balanceToken = 0;
	/************************************ Functions ***************************************************/

	function initialize() {
		return function() {
			setAccount();
			setTokenBalance();
			checkFaucet();
		}
	}


	//sets account and ethereum balance of that account
	function setAccount() {
		//make sure using rinkeby
		web3.version.getNetwork(function(err, netId) {
			if (netId == 18263546) { // 18263546
				//set the account display
				$("#metamaskInfo").hide();
				account = web3.eth.accounts[0];
				$("#address").text(account);
				// set the ethereum balance display
				web3.eth.getBalance(account, function(err, res) {
					balanceETH = Number(web3.fromWei(res, 'ether'));
					$('#balanceETH').text(balanceETH + " ETH");
					$('#balanceETH').show();
				});
			} else {
				$('#metamaskInfo').html('You are <b>not connected</b> to the right network. Please switch to the Testnet.<br>If you haven\'t added it to your Metamask yet, please do so:<br>RPC-Url: http://ethltjjnz-dns-reg1.northeurope.cloudapp.azure.com:8540<br>NetworkID: 18263546');
			}
		});
	}

	//set token balance of account, if haven't requested display button
	function setTokenBalance() {
		//set token balance display
		contract_token.balanceOf(web3.eth.accounts[0], function(errCall, result) {
			if(!errCall) {
				if(Number(result) != balanceToken) {
					balanceToken = Number(result);
					$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " Tokens");
				}
			} else {
				console.log(errCall);
			}
		});
	}

	function checkFaucet() {
		contract_faucet.allowedToWithdraw(web3.eth.accounts[0], function(err, result) {
			if(!err) {
				if(result && balanceToken < 10) {
					$("#requestButton").removeAttr('disabled');
				} else {
					$("#warning").html("Sorry - you can only request tokens every 30 minutes. Please wait!")
				}	

			}
		});
	}

	function getTestTokens() {
		web3.eth.getTransactionCount(account, function(errNonce, nonce) {
			if(!errNonce) {
				contract_faucet.getTestTokens({value:0, gas: 200000, from: account, nonce: nonce}, function(errCall, result) {
					if(!errCall) {
						testTokensRequested = true;
						$('#getTokens').hide();
					} else {
						testTokensRequested = true;
						$('#getTokens').hide();
					}
				});
			}
		});
	}

	/************************************** UI *****************************/

	window.addEventListener('load', function() {

		// connect to web3
		if (typeof web3 !== 'undefined') {
			web3Provider = web3.currentProvider;
		} else {
			console.log('No web3? You should consider trying MetaMask!');
		}

		web3 = new Web3(web3Provider);

		// get contract data for faucet and token
		$.getJSON('json/erc20.json', function(data) {
			contract_token = web3.eth.contract(data).at(token_address);
		});
		// get contract data for factory and token
		$.getJSON('json/faucet.json', function(data) {
			contract_faucet = web3.eth.contract(data).at(faucet_address);
		});





		//do rest of things in timeout so that contract objects are loaded
		setTimeout(initialize(), 1000);

		let tokenButton = document.querySelector('#requestButton');
		tokenButton.addEventListener('click', function() {
			getTestTokens();
		});

	});
});