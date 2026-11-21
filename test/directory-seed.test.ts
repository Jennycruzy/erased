import { describe, expect, it } from "vitest";
import { hasRoute, isPlumbing } from "../src/core/directory";

describe("isPlumbing", () => {
  for (const d of ["gtld-servers.net", "2mdn.net", "googletagservices.com", "amazon-adsystem.com", "w2rt6byl5nf1opmc-a.com", "msftncsi.com", "static.microsoft", "ttvnw.net", "cdn-apple.com"])
    it(`drops ${d}`, () => expect(isPlumbing(d)).toBe(true));
  for (const d of ["paypal.com", "ebay.com", "canva.com", "spotify.com", "adobe.com", "addidas.com", "tagged.com", "edgewell.com", "dropbox.com", "staticice.com.au"])
    it(`keeps ${d}`, () => expect(isPlumbing(d)).toBe(false));
});

describe("hasRoute", () => {
  it("none and unknown are not routes", () => { expect(hasRoute({ request_route: "none" })).toBe(false); expect(hasRoute({ request_route: "unknown" })).toBe(false); expect(hasRoute({ request_route: "email" })).toBe(true); });
});
