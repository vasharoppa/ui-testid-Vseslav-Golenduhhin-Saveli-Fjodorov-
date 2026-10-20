# Interim report email draft (section 4.4)

**To:** german.karin@ivkhk.ee  
**Subject:** Lõpuprojekt – vahearuanne – <nimi 1>, <nimi 2>

Tere!

Oleme lõpetanud lõpuprojekti esimese ja teise paari etapid ning saadame vahearuande.

1. **Repo ja haru:** https://github.com/vasharoppa/ui-testid-Vseslav-Golenduhhin-Saveli-Fjodorov- (branch: `final`). Repo on avalik.
2. **Unit tests:** lisa siia päris ekraanipilt käsust `npx jest shop-logic`, kus on näha testide loend ning `Tests: N failed, M passed, 35 total`. Testid on loodud; jooksutulemust pole veel selles keskkonnas kinnitatud.
3. **Coverage:** lisa siia päris ekraanipilt käsust `npx jest shop-logic --coverage --collectCoverageFrom=shop-logic.js`.
4. **Neli loogikadefekti:**
   - D-L-01 — `sortProducts`, `shop-logic.js`: price-desc võrdleb hindu stringidena; UT-07 / UI-12; oodatud esimene hind 249.00, tegelik vale järjestuse korral 89.00 või muu väiksem hind.
   - D-L-02 — `cartTotals`, `shop-logic.js`: allahindlus arvutatakse ainult esimese rea põhjal; UT-13 / UI-16; oodatud discount 6.35 ja total 57.15, tegelik discount 3.90 ja total 59.60.
   - D-L-03 — `normalizeQuantity`, `shop-logic.js`: kogus 0 jääb nulliks; UT-17 / UI-14; oodatud kogus 1, tegelik 0.
   - D-L-04 — `validateCheckout`, `shop-logic.js`: `mari@example` aktsepteeritakse; UT-24 / UI-18; oodatud e-posti valideerimise viga, tegelik viga puudub.
5. **Manused:** `test-cases.md` ja `traceability.md`.
6. **API tests:** lisa päris ekraanipilt käsust `npx playwright test --project=api`, mis näitab TC-01…TC-05; TC-03 peaks praeguse serveri korral punaseks minema, sest vastus on 200 null, mitte 404.
7. **Tagasiside ja pooleli olev töö:** Kõige keerulisem oli siduda nõuded, testjuhtumid ja automaattestid nii, et oodatud tulemus oleks konkreetne väärtus. Pooleli on API-testid TC-06…TC-10 ja testide käivitamise / katvuse tõendite lisamine. Enne paari 3 vajame kinnitust, et testjuhtumite ja jälgitavusmaatriksi detailsus vastab ootustele.

Lugupidamisega  
<nimi 1> ja <nimi 2>

**Enne saatmist:** täida mõlema nime väljad, käivita testid päris keskkonnas, lisa kolm nõutud ekraanipilti ning ära esita eeldatud tulemusi käivitatud tulemustena.
