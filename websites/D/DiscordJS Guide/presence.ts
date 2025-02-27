const presence = new Presence({
		clientId: "819865300173324288"
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "icon2",
		startTimestamp: browsingTimestamp
	};

	presenceData.details = "Viewing Docs";
	presenceData.state = `Page: ${document
		.getElementsByTagName("h1")[0]
		.textContent.replace("#", "")}`;

	if (!presenceData.details) presence.setActivity();
	else presence.setActivity(presenceData);
});
