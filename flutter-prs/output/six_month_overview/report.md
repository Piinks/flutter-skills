# PR Analysis Report for Flutter Org

**Date Range:** 2025-09-02..2026-03-02

## Executive Summary (Humans Only)

- **Total Activity**: 4126 PRs submitted by humans with a **71.8%** merge rate.
- **Most Active Contributor Type (Merged PRs)**: **Googlers** (1900 merged).
- **Most Responsive Sub-team**: **Infra** with an average human review latency of 0.77 days.
- **Human Trend**: PR submissions in the latest 28-day period are **down 10.7%** compared to the previous period.
- **Org-wide Backlog**: Currently **433** total human-authored open PRs across the org with an **oldest PR from 2024-07-25**.

## Glossary of Terms

- **Abandoned**: A PR that was closed without merging *after* receiving at least one review or comment from a non-bot human.
- **Closed w/o Review**: A PR that was closed without merging and without *any* human interaction (no comments, no reviews).
- **High Friction**: PRs containing more than **10 comments**, indicating complex reviews or significant discussion.
- **Avg Latency (Days)**: The average time from PR creation to the very first comment or review from a non-bot human.
- **Stale / Very Stale**: Open PRs that have been inactive for more than **30 days** (Stale) or **90 days** (Very Stale).
- **flutter-hackers**: Members of the official Flutter organization "collaborators" team.

## Key Insights & Bottlenecks (Humans Only)

- **Triage Gap**: **11.3%** of all human PRs closed without review were **Unowned** (no functional label). Missing labels remain a significant barrier. [View all open unowned PRs on GitHub](https://github.com/pulls?q=is%3Apr+is%3Aopen+org%3Aflutter+is%3Apublic+-label%3A%22a%3A+accessibility%22+-label%3Aengine+-label%3Aframework+-label%3Atool+-label%3Aplatform-android+-label%3Ateam-android+-label%3Aplatform-ios+-label%3Ateam-ios+-label%3Aplatform-web+-label%3Aplatform-macos+-label%3Aplatform-linux+-label%3Aplatform-windows+-label%3A%22f%3A+material+design%22+-label%3A%22f%3A+cupertino%22+-label%3A%22a%3A+text+input%22+-label%3A%22f%3A+selection%22+-label%3Ateam-text-input+-label%3Afyi-text-input+-repo%3Aflutter%2Fpackages+-repo%3Aflutter%2Fcocoon+-repo%3Aflutter%2Fdevtools+-repo%3Aflutter%2Fskills+-repo%3Aflutter%2Fintellij+-repo%3Aflutter%2Fflutter-intellij+-repo%3Aflutter%2Fwebsite+-repo%3Aflutter%2Fdash-evals+-repo%3Aflutter%2Fdemos+-repo%3Aflutter%2Fsamples+-repo%3Aflutter%2Fio_flip+-repo%3Aflutter%2Fgenui)
- **Latency Bottlenecks**: The following teams have the highest average human review latency:
  - **Web**: 7.8 days
  - **iOS**: 4.9 days
  - **Framework**: 4.9 days
- **Backlog Volume**: The **Framework** team currently holds the largest backlog of stale human-authored PRs (43 items >30 days old).


---

## 1. Organization Health Overview

### 1. Process Efficiency
- **Human Throughput**: Average time to close is **8.9 days** (Median: **1.8 days**).
- **Responsiveness**: Overall human review latency (time from PR creation to first human comment or review) is **3.03 days**.

### 2. Community Growth
- **New Contributors**: **124** people made their first contribution this period.
- **Community Success**: **49.2%** of community PRs land.

### 3. Maintainer Burden
- **Review Capacity**: Maintainers (Googlers + Hackers) account for **81.6%** of all merged human PRs.
- **Staleness**: There are **194** human-authored open PRs currently aging past 30 days.

### 4. Follow-through
- **Review Quality**: Of the human PRs that received a human review, **87.0%** were successfully merged.
- **Alignment by Author**: Googler-authored PRs have a **91.9%** follow-through rate, while non-Googler human PRs (Community + flutter-hackers) land at **79.6%**.

## 2. Org-wide Backlog Status

- **Total Human Open PRs**: 433
- **Median Age**: 29.1 days
- **Average Age**: 51.3 days

### 10 Oldest Open Human PRs

| Created | Repo | PR | Owning Team | Author | Team | Title |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2024-07-25 | flutter/flutter | [#152330](https://github.com/flutter/flutter/pull/152330) | Design Languages | justinmc | Googlers | Automatically handle back gesture in nested Navigators |
| 2024-10-16 | flutter/packages | [#7882](https://github.com/flutter/packages/pull/7882) | Ecosystem | aednlaxer | Community | [google_maps_flutter] Add Advanced Markers support |
| 2024-10-28 | flutter/packages | [#7950](https://github.com/flutter/packages/pull/7950) | Web | TecHaxter | Community | [camera_web] Re: Support for camera stream on web |
| 2024-12-26 | flutter/packages | [#8347](https://github.com/flutter/packages/pull/8347) | Ecosystem | abdelaziz-mahdy | Community | [video_player] Optimize caption retrieval with binary search in VideoPlayerController |
| 2025-03-17 | flutter/flutter | [#165323](https://github.com/flutter/flutter/pull/165323) | Engine, Windows | CodeDoctorDE | Community | Allow stylus support on windows |
| 2025-05-06 | flutter/packages | [#9212](https://github.com/flutter/packages/pull/9212) | Android, Ecosystem | ArvidNy | Community | [video_player] Implements background playback functionality |
| 2025-05-07 | flutter/devtools | [#9182](https://github.com/flutter/devtools/pull/9182) | DevExp | srawlins | Googlers | extensions: Read the IdeTheme and notify extension app |
| 2025-06-04 | flutter/flutter | [#170014](https://github.com/flutter/flutter/pull/170014) | Accessibility, Framework | chunhtai | Googlers | synchronously flush semantics when semantics is enabled |
| 2025-06-06 | flutter/flutter | [#170104](https://github.com/flutter/flutter/pull/170104) | Framework | rkishan516 | flutter-hackers | Feat: Add unused dependency cleanup |
| 2025-06-18 | flutter/flutter | [#170804](https://github.com/flutter/flutter/pull/170804) | Tool | mraleph | Googlers | Only reload each isolate group once in _reloadDeviceSources |

## 3. Team Performance Metrics

### Performance by Team Type

| Category | Merge Rate | Avg Close (Days) | Median Close (Days) | Avg Latency (Days) | New Contribs | High Friction Merge Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 49.2% | 16.0 | 6.5 | 4.47 | 124 | 68.2% |
| Googlers | 81.3% | 6.3 | 0.9 | 2.54 | 0 | 81.3% |
| flutter-hackers | 76.1% | 8.0 | 3.0 | 2.72 | 0 | 61.1% |

## 4. Human Activity Trends (28-Day Windows)

| Period | Submitted | Trend | Merged | Trend |
| :--- | :--- | :--- | :--- | :--- |
| 2025-09-14 to 2025-10-12 | 642 | - | 475 | - |
| 2025-10-12 to 2025-11-10 | 633 | -9 📉 | 495 | +20 📈 |
| 2025-11-10 to 2025-12-08 | 617 | -16 📉 | 493 | -2 📉 |
| 2025-12-08 to 2026-01-05 | 444 | -173 📉 | 311 | -182 📉 |
| 2026-01-05 to 2026-02-02 | 793 | +349 📈 | 564 | +253 📈 |
| 2026-02-02 to 2026-03-02 | 708 | -85 📉 | 427 | -137 📉 |


---

## APPENDICES: Detailed Breakdown

### A. Org-wide Volume & State (All Humans)

### Volume by Team Type

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 1108 (26.9%) | 545 (18.4%) | 218 (49.4%) | 133 (42.8%) | 212 (51.6%) | 104 |
| Googlers | 2337 (56.6%) | 1900 (64.1%) | 168 (38.1%) | 109 (35.0%) | 160 (38.9%) | 75 |
| flutter-hackers | 681 (16.5%) | 518 (17.5%) | 55 (12.5%) | 69 (22.2%) | 39 (9.5%) | 15 |

### B. Functional Sub-team Performance

*Note: N/A indicates that no PRs for that team met the specific criteria for the metric during this period (e.g., zero high-friction PRs or zero human responses).* 

### Performance by Functional Area

| Category | Merge Rate | Avg Close (Days) | Median Close (Days) | Avg Latency (Days) | New Contribs | High Friction Merge Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Accessibility | 43.8% | 10.0 | 1.2 | 2.16 | 13 | 50.0% |
| Android | 59.3% | 9.0 | 2.5 | 2.96 | 28 | 85.7% |
| Design Languages | 63.7% | 14.8 | 6.8 | 3.74 | 23 | 50.0% |
| DevExp | 74.6% | 3.8 | 0.2 | 1.36 | 3 | 100.0% |
| DevRel | 62.3% | 7.0 | 0.0 | 3.67 | 7 | N/A |
| Ecosystem | 67.8% | 8.9 | 2.4 | 2.60 | 20 | 100.0% |
| Engine | 72.1% | 8.0 | 2.9 | 2.98 | 13 | 69.6% |
| Framework | 56.2% | 15.2 | 5.9 | 4.87 | 27 | 57.1% |
| Infra | 94.4% | 1.5 | 0.1 | 0.77 | 0 | N/A |
| Linux | 39.3% | 2.7 | 0.1 | 1.05 | 10 | 100.0% |
| MacOS | 35.6% | 6.4 | 0.1 | 3.77 | 8 | 100.0% |
| Text Input | 46.3% | 13.8 | 2.1 | 4.86 | 16 | 40.0% |
| Tool | 62.2% | 9.5 | 1.8 | 3.28 | 27 | 88.9% |
| Unowned | 74.5% | 7.8 | 0.7 | 4.68 | 19 | 50.0% |
| Web | 53.4% | 15.8 | 2.8 | 7.79 | 17 | 83.3% |
| Windows | 49.1% | 4.8 | 0.6 | 1.34 | 4 | 50.0% |
| genUI | 77.7% | 5.3 | 0.3 | 2.59 | 0 | 100.0% |
| iOS | 50.8% | 14.0 | 3.3 | 4.89 | 27 | 90.0% |
| iX | 90.6% | 3.0 | 0.7 | 0.77 | 3 | 100.0% |

### Volume by Functional Area

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Accessibility | 121 (2.9%) | 53 (1.8%) | 20 (4.5%) | 33 (10.6%) | 15 (3.6%) | 6 |
| Android | 462 (11.2%) | 274 (9.2%) | 52 (11.8%) | 96 (30.9%) | 40 (9.7%) | 16 |
| Design Languages | 512 (12.4%) | 326 (11.0%) | 75 (17.0%) | 45 (14.5%) | 66 (16.1%) | 27 |
| DevExp | 394 (9.5%) | 294 (9.9%) | 37 (8.4%) | 14 (4.5%) | 49 (11.9%) | 34 |
| DevRel | 61 (1.5%) | 38 (1.3%) | 7 (1.6%) | 7 (2.3%) | 9 (2.2%) | 5 |
| Ecosystem | 351 (8.5%) | 238 (8.0%) | 33 (7.5%) | 38 (12.2%) | 42 (10.2%) | 19 |
| Engine | 606 (14.7%) | 437 (14.7%) | 57 (12.9%) | 46 (14.8%) | 66 (16.1%) | 29 |
| Framework | 537 (13.0%) | 302 (10.2%) | 90 (20.4%) | 53 (17.0%) | 92 (22.4%) | 43 |
| Infra | 72 (1.7%) | 68 (2.3%) | 2 (0.5%) | 1 (0.3%) | 1 (0.2%) | 0 |
| Linux | 61 (1.5%) | 24 (0.8%) | 12 (2.7%) | 21 (6.8%) | 4 (1.0%) | 2 |
| MacOS | 45 (1.1%) | 16 (0.5%) | 7 (1.6%) | 15 (4.8%) | 7 (1.7%) | 4 |
| Text Input | 164 (4.0%) | 76 (2.6%) | 28 (6.3%) | 33 (10.6%) | 27 (6.6%) | 14 |
| Tool | 426 (10.3%) | 265 (8.9%) | 51 (11.6%) | 78 (25.1%) | 32 (7.8%) | 15 |
| Unowned | 376 (9.1%) | 280 (9.4%) | 28 (6.3%) | 35 (11.3%) | 33 (8.0%) | 14 |
| Web | 238 (5.8%) | 127 (4.3%) | 36 (8.2%) | 50 (16.1%) | 25 (6.1%) | 14 |
| Windows | 53 (1.3%) | 26 (0.9%) | 8 (1.8%) | 13 (4.2%) | 6 (1.5%) | 5 |
| genUI | 292 (7.1%) | 227 (7.7%) | 35 (7.9%) | 22 (7.1%) | 8 (1.9%) | 0 |
| iOS | 244 (5.9%) | 124 (4.2%) | 40 (9.1%) | 45 (14.5%) | 35 (8.5%) | 14 |
| iX | 459 (11.1%) | 416 (14.0%) | 24 (5.4%) | 12 (3.9%) | 7 (1.7%) | 2 |

### C. Per-Repository Distribution

#### Repository: flutter/flutter

### Distribution for flutter/flutter

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 802 (16.0%) | 382 (13.9%) | 160 (43.8%) | 105 (6.5%) | 155 (54.8%) | 81 |
| Googlers | 1074 (21.4%) | 855 (31.1%) | 82 (22.5%) | 54 (3.3%) | 83 (29.3%) | 31 |
| flutter-hackers | 456 (9.1%) | 339 (12.3%) | 44 (12.1%) | 43 (2.7%) | 30 (10.6%) | 10 |


**First Reviewers for flutter/flutter**:
* victorsanni: 188, * reidbaker: 135, * Piinks: 90, * justinmc: 81, * bkonyi: 79, * gaaclarke: 79, * camsim99: 75, * jtmcdole: 68, * dkwingsmt: 63, * navaronbracke: 51, * loic-sharma: 50, * jason-simmons: 45, * chinmaygarde: 44, * vashworth: 44, * gmackall: 43, * chunhtai: 42, * QuncCccccc: 41, * mboetger: 34, * mdebbar: 32, * LongCatIsLooong: 29, * walley892: 29, * jmagman: 26, * stuartmorgan-g: 25, * harryterkelsen: 24, * AbdeMohlbi: 24, * flar: 24, * hellohuanlin: 20, * jyameo: 19, * b-luk: 18, * eyebrowsoffire: 17, * hannah-hyj: 14, * bleroux: 14, * robert-ancell: 14, * mattkae: 14, * Renzo-Olivares: 12, * zanderso: 12, * kevmoo: 10, * DanTup: 9, * dcharkes: 9, * ksokolovskyi: 9, * MitchellGoodwin: 8, * jesswrd: 7, * goderbauer: 7, * okorohelijah: 7, * flutter-zl: 6, * knopp: 6, * huycozy: 6, * planetmarshall: 6, * ValentinVignal: 5, * chingjun: 5, * jihanurrahman33: 5, * matanlurey: 5, * nshahan: 5, * mraleph: 5, * Mairramer: 5, * yjbanov: 4, * kazbeksultanov: 4, * aam: 4, * guidezpl: 4, * kjlubick: 4, * zemanux: 4, * nate-thegrate: 4, * ash2moon: 3, * stereotype441: 3, * iinozemtsev: 3, * ditman: 3, * MohammedTarigg: 3, * dev-boffin-io: 3, * dbebawy: 3, * Rusino: 3, * O-Hannonen: 3, * gktirkha: 3, * Enderjua: 3, * Breakthrough: 2, * Hassnaa9: 2, * GregoryConrad: 2, * dixita0607: 2, * Mr-Pepe: 2, * manu-sncf: 2, * akashefrath: 2, * asiftonim: 2, * tirth-patel-nc: 2, * LouiseHsu: 2, * srujzs: 2, * sigmundch: 2, * Masrafi: 2, * zijiehe-google-com: 2, * koji-1009: 2, * logiclrd: 2, * rkishan516: 2, * tarrinneal: 2, * flutter-painter: 2, * bungeman: 2, * parlough: 2, * shindonghwi: 2, * xiaowei-guan: 2, * almassolarenrgi: 2, * Gustl22: 2, * Erengun: 2, * rickhohler: 2, * gbolahan507: 2, * jrwang: 2, * helin24: 2, * vasilich6107: 1, * sethladd: 1, * AnuragTiwari1508: 1, * sstrickl: 1, * loic-peron-inetum-public: 1, * HosseinYousefi: 1, * copilot-pull-request-reviewer: 1, * biggs0125: 1, * jimmyff: 1, * cedvdb: 1, * darshankawar: 1, * KubanjaElijahEldred: 1, * LauYewHang: 1, * elliette: 1, * fishythefish: 1, * AuraAi-vet: 1, * Musaddiq625: 1, * gspencergoog: 1, * abdelaziz-mahdy: 1, * Mohamed-7018: 1, * shang1219178163: 1, * davidhicks980: 1, * karmicdice: 1, * garrettjavalia: 1, * gnprice: 1, * lukepighetti: 1, * bufffun: 1, * alexmarkov: 1, * bparrishMines: 1, * safwenbarhoumi: 1, * LukeMoody01: 1, * ahmedsameha1: 1, * 777genius: 1, * schultek: 1, * abikko: 1, * JeelChandegra: 1, * ecolab-neil: 1, * rocboronat: 1, * yshamass9: 1, * vhaudiquet: 1, * inself: 1, * sutes-work: 1, * 0xharkirat: 1, * supakitk56: 1, * simolus3: 1, * CodeDoctorDE: 1, * rijan-rayamajhi: 1, * littleGnAl: 1, * adil192: 1, * Saqib198: 1, * devtizi: 1, * lsaudon: 1, * ikramhasan: 1, * ManexpDev: 1, * jonathanacaofiscaldotrabalho-blip: 1, * RamonFarizel: 1, * Franklyn-R-Silva: 1, * aaazlkm: 1, * muhammadkamel: 1, * divyanshyagyik: 1, * mahmuttaskiran: 1, * WillCallahan: 1, * Telomelonia: 1, * liamappelbe: 1, * mosuem: 1, * devnoaman: 1, * Ibrar-devs: 1, * sigurdm: 1, * Albert221: 1, * moko256: 1, * bwilkerson: 1, * chris-prenissl: 1, * chaopeng: 1, * iamvikashtiwari: 1, * EArminjon: 1, * preet-canary: 1, * ilyosbek22: 1, * IliaKhuzhakhmetov: 1, * komakur: 1, * Gibbo97: 1, * gerfalcon: 1, * jwren: 1, * westito: 1, * crackedhandle: 1, * martinetd: 1, * serbandin: 1, * srawlins: 1, * Akshat-Shuklaaa: 1, * MaherSafadii: 1, * EricApostal: 1, * itsjustkevin: 1, * sero583: 1, * coder-ishan: 1, * abdallahshaban557: 1, * fuzzybinary: 1, * nikb7: 1, * johnpryan: 1, * Mastersam07: 1, * MrAboubakr: 1, * Eliezermga: 1, * alex-medinsh: 1, * JaffaKetchup: 1, * nmfisher: 1

#### Repository: flutter/packages

### Distribution for flutter/packages

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 130 (10.6%) | 53 (11.1%) | 26 (41.9%) | 9 (1.5%) | 42 (55.3%) | 18 |
| Googlers | 263 (21.5%) | 219 (45.8%) | 14 (22.6%) | 8 (1.3%) | 22 (28.9%) | 11 |
| flutter-hackers | 58 (4.7%) | 25 (5.2%) | 5 (8.1%) | 24 (3.9%) | 4 (5.3%) | 1 |


**First Reviewers for flutter/packages**:
* stuartmorgan-g: 129, * reidbaker: 25, * bparrishMines: 24, * mboetger: 20, * camsim99: 16, * chunhtai: 11, * jmagman: 11, * tarrinneal: 11, * Piinks: 9, * jesswrd: 8, * LouiseHsu: 7, * hellohuanlin: 5, * LongCatIsLooong: 4, * vashworth: 4, * mdebbar: 3, * AbdeMohlbi: 3, * okorohelijah: 3, * domesticmouse: 3, * gmackall: 3, * ValentinVignal: 3, * hannah-hyj: 3, * RobertOdrowaz: 3, * guidezpl: 3, * LukasMirbt: 2, * ash2moon: 2, * bkonyi: 2, * justinmc: 2, * pedromassango: 1, * ycv005: 1, * fishythefish: 1, * blackorbs-dev: 1, * stereotype441: 1, * coltrane: 1, * Mairramer: 1, * sophiebremer: 1, * nateshmbhat: 1, * cuong292: 1, * romeo4934: 1, * raju-muliyashiya: 1, * Andro999b: 1, * Haidar0096: 1, * agrapine: 1, * AlexDochioiu: 1, * hellohejinyu: 1, * jtmcdole: 1, * OlehSv: 1, * edpizzi: 1, * wangfeihang: 1, * Frank3K: 1, * varada2906: 1, * crackedhandle: 1, * nate-thegrate: 1, * victorsanni: 1, * akaboshinit: 1, * hopechange156-source: 1, * kallentu: 1, * QuncCccccc: 1

#### Repository: flutter/website

### Distribution for flutter/website

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 100 (20.3%) | 82 (18.3%) | 13 (54.2%) | 3 (23.1%) | 2 (28.6%) | 0 |
| Googlers | 229 (46.5%) | 209 (46.7%) | 8 (33.3%) | 7 (53.8%) | 5 (71.4%) | 2 |
| flutter-hackers | 130 (26.4%) | 125 (27.9%) | 3 (12.5%) | 2 (15.4%) | 0 (0.0%) | 0 |


**First Reviewers for flutter/website**:
* sfshaza2: 204, * parlough: 143, * ericwindmill: 14, * schultek: 11, * camsim99: 5, * loic-sharma: 5, * chunhtai: 5, * domesticmouse: 5, * antfitch: 5, * dixita0607: 4, * dcharkes: 4, * jesswrd: 4, * mit-mit: 2, * kevmoo: 2, * miinhho: 2, * AbdeMohlbi: 2, * jmagman: 2, * munificent: 2, * johnpryan: 2, * vashworth: 2, * Hassnaa9: 1, * zanderso: 1, * jtmcdole: 1, * chinmaygarde: 1, * srmncnk: 1, * tirth-patel-nc: 1, * b-luk: 1, * srawlins: 1, * gaaclarke: 1, * bkonyi: 1, * twerske: 1, * flar: 1, * Piinks: 1, * jakemac53: 1, * stuartmorgan-g: 1, * redbrogdon: 1, * helloworld201212: 1, * guidezpl: 1, * csells: 1, * dbebawy: 1, * zemanux: 1, * justinmc: 1, * nilsreichardt: 1, * adriancuadrado: 1, * dkwingsmt: 1, * piedcipher: 1, * itsjustkevin: 1, * Tiefflieger06: 1, * kallentu: 1

#### Repository: flutter/genui

### Distribution for flutter/genui

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 14 (4.4%) | 6 (2.5%) | 7 (19.4%) | 1 (2.9%) | 0 (0.0%) | 0 |
| Googlers | 272 (86.1%) | 216 (91.1%) | 28 (77.8%) | 21 (60.0%) | 7 (87.5%) | 0 |
| flutter-hackers | 6 (1.9%) | 5 (2.1%) | 0 (0.0%) | 0 (0.0%) | 1 (12.5%) | 0 |


**First Reviewers for flutter/genui**:
* gspencergoog: 84, * jacobsimionato: 72, * polina-c: 43, * sethladd: 7, * andrewkolos: 5, * Piinks: 3, * yjbanov: 3, * redbrogdon: 2, * csells: 2, * ditman: 2, * RandalSchwartz: 1, * mhmzdev: 1, * mbleigh: 1, * jiahaog: 1, * juan-vgv: 1, * hunterino: 1, * nan-yu: 1, * parlough: 1, * mosuem: 1, * natebosch: 1, * kevmoo: 1, * gerfalcon: 1

#### Repository: flutter/flutter-intellij

### Distribution for flutter/flutter-intellij

| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Community | 7 (3.8%) | 3 (2.3%) | 2 (6.9%) | 0 (0.0%) | 2 (15.4%) | 0 |
| Googlers | 167 (91.3%) | 125 (94.7%) | 26 (89.7%) | 6 (66.7%) | 10 (76.9%) | 7 |
| flutter-hackers | 4 (2.2%) | 3 (2.3%) | 1 (3.4%) | 0 (0.0%) | 0 (0.0%) | 0 |


**First Reviewers for flutter/flutter-intellij**:
* helin24: 61, * jwren: 46, * pq: 45, * Piinks: 1, * dkandalov: 1, * parlough: 1, * cj-radcliff: 1



*Abandoned: Closed without merging after receiving at least one human review.

