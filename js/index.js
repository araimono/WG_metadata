const url = new URL(window.location.href);
const owner = url.searchParams.get("owner");
const username = url.searchParams.get("username");
const userid = url.searchParams.get("userid");
const salt = url.searchParams.get("salt");
const signature = url.searchParams.get("signature");

const provider = new ethers.providers.Web3Provider(window.ethereum);

const getParams = async () => {
	document.getElementById("address").textContent = owner;
	document.getElementById("username").textContent = username;
	document.getElementById("userid").textContent = userid;
	//console.log(owner, userid, salt, signature);
};

const connect = async () => {
	if (typeof window.ethereum === "undefined") {
		console.log("MetaMask is not installed!");
	} else {
		await getParams();
	}

    try{
        await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${(80001).toString(16)}` }]);
    }catch{

    }

    const { chainId } = await provider.getNetwork();
    if(chainId !== 80001){
		alert("ウォレットでPoligonネットワークを選択してください");
        return;
    }

    const accounts = await provider.send("eth_requestAccounts", []);
	if (accounts[0] !== owner.toLowerCase()) {
	document.getElementById("address").textContent = owner;
    alert(`ウォレットで選択されているアカウントが申請と異なります。\n申請されたアドレスは${owner}です。`);
		return;
	}

};

const addressArea = document.getElementById("address");
addressArea.addEventListener("click",async () => {
    const content = document.getElementById('address').innerHTML;
    navigator.clipboard.writeText(content)
});

const userIdArea = document.getElementById("userid");
userIdArea.addEventListener("click",async () => {
    const content = document.getElementById('userid').innerHTML;
    navigator.clipboard.writeText(content)
});

const userNameArea = document.getElementById("username");
userNameArea.addEventListener("click",async () => {
    const content = document.getElementById('username').innerHTML;
    navigator.clipboard.writeText(content)
});


const mintButton = document.getElementById("mintButton");
mintButton.addEventListener("click", async () => {
    if(mintButton.ariaDisabled === null){
        try{
            mintButton.ariaDisabled = "True"    
            await connect();
            await mint();    
        }catch{}
        finally{
            mintButton.ariaDisabled = null;
        }
    }
});

/*
const connectButton = document.getElementById("connectButton");
connectButton.addEventListener("click", async () => {
	await connect();
});
*/

const mint = async () => {
	const abi = [
		{
			inputs: [
				{
					internalType: "address",
					name: "_address",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "_tokenId",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "_salt",
					type: "uint256",
				},
				{
					internalType: "bytes",
					name: "_signature",
					type: "bytes",
				},
			],
			name: "mint",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
	];

	const signer = provider.getSigner();

	const contract = new ethers.Contract(
		"0xc0B3483bD8B2740b7BC070615FEb9988F793d621",
		abi,
		signer,
	);
    
	// http://127.0.0.1:5500/index.html?owner=0x535B72f4c4370F416348Eb5a9525a408AC8D8aCB&userid=488544515976724480&username=ukishima&salt=1659162860075&signature=0x51e1386773760c302e6c62566ac336f6ebac80cf9eebabc982fb0e547a8e37150b2b04ff78c2d105973863ddb5fe36327c9c4e6c9b459eafd097d85dae4e01b11b
	const tx = await contract.mint(owner, userid, salt, signature);
};

(async () =>{
    await getParams();
})();

//===============//
// smooth scroll //
//===============//
window.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll('a[href^="#"]').forEach(function (element) {
		// ナビゲーション内リンクの場合はイベントを追加しない
		if (element.closest("#nav-drawer")) {
			return;
		}

		// トリガーをクリックした時に実行
		element.addEventListener("click", function (e) {
			// スクロール先の要素を取得
			const href = element.getAttribute("href");
			const target = document.getElementById(href.replace("#", ""));

			if (target) {
				// 画面上部から要素までの距離
				const position = target.getBoundingClientRect().top;
				// 現在のスクロール距離
				const offsetTop = window.pageYOffset;
				// スクロール位置に持たせるバッファ
				const buffer = 50;
				const top = position + offsetTop - buffer;
				// デフォルトのイベントをキャンセル
				e.preventDefault();
				e.stopPropagation();

				// スクロールを実行する
				window.scrollTo({
					top,
					behavior: "smooth",
				});
			}
		});
	});
});
