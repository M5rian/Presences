const presence = new Presence({
		clientId: "735229766701154357"
	}),
	strings = presence.getStrings({
		browse: "presence.activity.browsing",
		search: "presence.activity.searching"
	}),
	getElement = (query: string): string | undefined => {
		return document.querySelector(query)?.textContent;
	};

let elapsed = Math.floor(Date.now() / 1000),
	prevUrl = document.location.href;

const statics = {
	"/pages/global/pagegone.jsf/": {
		details: "404",
		state: "Not Found"
	},
	"/page/login/": {
		details: "Logging In..."
	},
	"/page/register/": {
		details: "Registering..."
	},
	"/page/about/": {
		details: "Viewing Page...",
		state: "About"
	},
	"/page/guide/": {
		details: "Viewing Page...",
		state: "User Guide"
	},
	"/page/privacy/": {
		details: "Viewing Page...",
		state: "Privacy Policy"
	},
	"/page/developer/": {
		details: "Viewing Page...",
		state: "Developer Resources"
	},
	"/Top/": {
		details: "Viewing Page...",
		state: "Top Hardware"
	},
	"/Software/": {
		details: "Viewing Page...",
		state: "PC Software"
	}
};

presence.on("UpdateData", async () => {
	const { host } = location,
		path = location.pathname.replace(/\/?$/, "/"),
		showSearch = await presence.getSetting<boolean>("search"),
		showTimestamps = await presence.getSetting<boolean>("timestamp");

	let presenceData: PresenceData = {
		largeImageKey: "userbenchmark",
		startTimestamp: elapsed
	};

	if (document.location.href !== prevUrl) {
		prevUrl = document.location.href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	for (const [k, v] of Object.entries(statics))
		if (path.match(k)) presenceData = { ...presenceData, ...v };

	if (path === "/") {
		presenceData.details = "Browsing...";
		presenceData.state = "Home";
	}

	if (path.includes("/Compare/")) {
		presenceData.details = `Comparing ${getElement(
			".fastinslowout.active"
		)}s...`;

		const parseComparison = (text: string, date: string): string => {
			return date ? text : "Unspecified";
		};
		presenceData.state = `${parseComparison(
			getElement("#select2-chosen-1"),
			getElement(".cmp-cpt-l")
		)} vs ${parseComparison(
			getElement("#select2-chosen-2"),
			getElement(".cmp-cpt-r")
		)}`;
	}

	if (path.includes("/EFps/")) {
		presenceData.details = "Comparing PC with EFps...";

		const activeBtn = document.querySelector(
			".btn-group-justified > .btn.btn-default.active"
		);

		presenceData.state = [
			"Counter Strike: Global Offensive",
			"Grand Theft Auto 5",
			"Overwatch",
			"PlayerUnknown's Battlegrounds",
			"Fortnite"
		][Array.from(activeBtn.parentNode.children).indexOf(activeBtn)];
	}

	if (path.includes("/User/")) {
		presenceData.details = "Viewing Profile...";
		presenceData.state = `${getElement(".lightblacktext > span")} (${getElement(
			"li.active > a"
		)
			.split(" ")
			.shift()})`;
	}

	if (path.includes("/UserRun/")) {
		presenceData.details = "Viewing Performance Report...";
		presenceData.state = `${path.split("/").slice(-2)[0]} - ${getElement(
			".pg-head-toption-post"
		)}`;
	}

	if (path.includes("/PCGame/")) {
		presenceData.details = "Viewing PC Game...";
		presenceData.state = getElement(".stealthlink");
	}

	if (showSearch && path.includes("/Search/")) {
		presenceData.details = "Searching...";

		presenceData.state = document.querySelector<HTMLInputElement>(
			".top-menu-search-input"
		).value;
	}

	if (path.includes("/Faq/")) {
		presenceData.details = "Viewing FAQ...";
		presenceData.state = getElement(".stealthlink");
	}

	if (host === "www.userbenchmark.com") {
		if (path.includes("/PCBuilder/")) {
			presenceData.details = "Building PC...";

			presenceData.state = `${
				document.querySelector(".container-fluid table > tbody:nth-child(2)")
					?.childElementCount
			} Components`;
		}

		if (path.includes("/System/")) {
			presenceData.details = "Viewing Motherboard...";
			presenceData.state = `${getElement(".pg-head-toption > a")} ${getElement(
				".stealthlink"
			)}`;
		}
	} else {
		const product = getElement(".pg-head-title .stealthlink");
		if (product) {
			presenceData.details = `Viewing ${getElement(
				".fastinslowout.active"
			)}...`;
			presenceData.state = `${getElement(".pg-head-toption > a")} ${product}`;
		}
	}

	if (presenceData.details) {
		if (presenceData.details.match("(Browsing|Viewing)")) {
			presenceData.smallImageKey = "reading";
			presenceData.smallImageText = (await strings).browse;
		}
		if (presenceData.details.match("(Searching)")) {
			presenceData.smallImageKey = "search";
			presenceData.smallImageText = (await strings).search;
		}
		if (!showTimestamps) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}

		if (path === "/" && !host.startsWith("www")) {
			const hardware = host.split(".").shift();
			presenceData.smallImageKey = hardware;
			presenceData.smallImageText = hardware.toUpperCase();
		}

		presence.setActivity(presenceData);
	} else presence.setActivity();
});
