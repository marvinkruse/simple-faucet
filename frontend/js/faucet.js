$(document).ready(function() {

	var account;
	var web3Provider;

	var contract_token;
	var contract_faucet;
	var token_address = '0x4ecc65e392eb078926bbe36d5c46e6824b14950a';
	var faucet_address = '0xb7Fc2C56F82343D01B82e666Bb90a5a899aA0868';
	var networkID = 18263546;

	var balanceETH = 0;
	var balanceToken = 0;

	function initialize() {
		return function() {
			setAccount();
			setTokenBalance();
			checkFaucet();
		}
	}

	function setAccount() {
		web3.version.getNetwork(function(err, netId) {
			if (netId == networkID) { 
				$("#metamaskInfo").hide();
				account = web3.eth.accounts[0];
				$("#address").text(account);
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
				$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " Tokens");
				if(Number(result) != balanceToken) {
					balanceToken = Number(result);
					$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " Tokens");
				}
			}
		});
	}
	

	function checkFaucet() {
		var tokenAmount = 0;
		contract_faucet.tokenAmount(function(err, result) {
			if(!err) {
				tokenAmount = result;
				$("#requestButton").text("Request " + web3.fromWei(result, 'ether') + " Test Tokens");
			}
		});
		contract_faucet.allowedToWithdraw(web3.eth.accounts[0], function(err, result) {
			if(!err) {
				if(result && balanceToken < tokenAmount*1000) {
					$("#requestButton").removeAttr('disabled');
				} else {
					contract_faucet.waitTime(function(err, result) {
						if(!err) {
							$("#warning").html("Sorry - you can only request tokens every " + (result)/60 + " minutes. Please wait!")
						}
					});
				}	

			}
		});
	}

	function getTestTokens() {
		web3.eth.getTransactionCount(account, function(errNonce, nonce) {
			if(!errNonce) {
				contract_faucet.requestTokens({value:0, gas: 200000, gasPrice: 0, from: account, nonce: nonce}, function(errCall, result) {
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