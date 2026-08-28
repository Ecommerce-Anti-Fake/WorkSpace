# Flow test results

**Run date:** 2026-08-04  
**Current run policy:** production read-only smoke only.

| Role / flow | Current evidence | Result |
| --- | --- | --- |
| Guest: public shell and catalog reads | Frontend GET smoke plus health, offers, categories, brands, shops, live-session GETs | Passed at HTTP level |
| Buyer: login, cart, checkout, payment, order history | Not run; would require credentials and/or mutation | Pending safe staging fixture |
| Seller: dashboard, product/offer management, shipping | Not run; mutation and ownership checks are out of production smoke scope | Pending safe staging fixture |
| Affiliate/distributor: links, commissions, distribution | Not run; authenticated fixture required | Pending safe staging fixture |
| Admin/moderator: management and moderation | Not run; production mutation explicitly prohibited | Pending safe staging fixture |
| Realtime: Socket.IO, SSE, chat, presence, live reactions | Not run; needs authenticated multi-client staging smoke | Pending staging |

The frontend routes `/seller` and `/admin` returning the SPA shell do not prove
authorization or data access. Detailed route and caller mapping is in
[`api-inventory.md`](./api-inventory.md); historical handoff evidence is kept
separate from this current run.

