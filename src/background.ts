import { morningCard } from "./core/morning";
import { setTiming, type Timing } from "./core/requests";
import { chromeKV, Store } from "./core/store";

// Clicking the toolbar icon opens the side panel.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => undefined);

// Once a day, work out what needs the user from the requests stored on this device and show it on the icon.
chrome.runtime.onInstalled.addListener(() => chrome.alarms.create("morning", { periodInMinutes: 24 * 60, delayInMinutes: 1 }));
chrome.alarms.onAlarm.addListener(async (a) => {
  if (a.name !== "morning") return;
  // The waits the panel last read from Remote Config.
  setTiming(((await chromeKV.get("timing")) as Partial<Timing> | undefined) ?? {});
  const reqs = await new Store(chromeKV).requests();
  const last = ((await chromeKV.get("lastSeenMorning")) as number | undefined) ?? 0;
  const card = morningCard(reqs, Date.now(), last);
  await chrome.action.setBadgeText({ text: card.badge ? String(card.badge) : "" });
  await chrome.action.setBadgeBackgroundColor({ color: "#c62828" });
});
