# devNepal

प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय, नेपाल सरकार ·
<https://pmdevcore.gov.np>

नेपाल सरकारको सार्वजनिक सहकार्य पोर्टल। यसले एउटा खुला स्रोत (open-source)
परियोजना, त्यसको GitHub रिपोजिटरीका खुला इस्युहरू, र प्रशासकले स्वीकृत गरेका
योगदानकर्ताहरूको निर्देशिका देखाउँछ। साइटको अङ्ग्रेजी (`/en`) र नेपाली (`/ne`)
संस्करण छन्।

[Read in English →](./README.md)

> **अवस्था:** विकासको चरणमा, पहिलो रिलिजअघि। [Apache-2.0](./LICENSE) अन्तर्गत
> इजाजतपत्र दिइएको।

- [Docker बाट चलाउनुहोस्](#docker-बाट-चलाउनुहोस्)
- [आफ्नै कम्प्युटरमा विकास](#आफ्नै-कम्प्युटरमा-विकास)
- [कन्फिगरेसन](#कन्फिगरेसन)
- [कमान्डहरू](#कमान्डहरू)
- [यो कसरी बनेको छ](#यो-कसरी-बनेको-छ)
- [योगदान](#योगदान)

## Docker बाट चलाउनुहोस्

Compose v2.24 वा त्योभन्दा नयाँ भएको Docker चाहिन्छ। होस्टमा अरू केही चलाउनु
पर्दैन।

1. **GitHub OAuth App बनाउनुहोस्।** एप सुरु हुँदा आफ्नो कन्फिगरेसन जाँच्छ र
   यसबिना सुरु हुँदैन। <https://github.com/settings/developers> → **New OAuth
   App** मा:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
2. **कन्फिगरेसन फाइल बनाउनुहोस्**, `docker-compose.yml` सँगै `.env`, र
   `AUTH_SECRET` (`openssl rand -base64 48`), `AUTH_GITHUB_ID` र
   `AUTH_GITHUB_SECRET` भर्नुहोस्:

   ```sh
   cp apps/api/.env.example .env
   ```

   Compose ले सबै सेटिङ यही एउटा फाइलबाट पढ्छ। फाइलको अन्तिम खण्डका `POSTGRES_*`
   सेटिङबाट यसले आफ्नै `DATABASE_URL` बनाउँछ, त्यसैले `DATABASE_URL` को लाइन
   प्रयोग हुँदैन।
3. **स्ट्याक सुरु गर्नुहोस्।** पहिले Postgres सुरु हुन्छ, माइग्रेसन चल्छ, अनि
   एप:

   ```sh
   docker compose up -d --build
   ```

4. **GitHub बाट परियोजना र त्यसका इस्युहरू ल्याउनुहोस्:**

   ```sh
   docker compose run --rm migrate node scripts/init-project.js
   ```

<http://localhost:3000/ne> खोल्नुहोस्। पोर्ट 3000 वा 5432 पहिल्यै प्रयोगमा छ भने
`API_PORT` र `DB_PORT` राख्नुहोस्, जस्तै `API_PORT=13000 DB_PORT=15432 docker
compose up -d`; `API_PORT` फरक भए OAuth App का URL मा पनि त्यही पोर्ट राख्नुहोस्।
पछि इस्युहरू ताजा गर्न `docker compose run --rm migrate node scripts/sync-github.js`
चलाउनुहोस्। `docker compose down -v` ले स्ट्याक र त्यसको डाटा हटाउँछ।

होस्टिङ प्लेटफर्महरूले पनि सेटिङ यसैगरी त्यही `.env` मा दिन्छन्। उत्पादन
(production) का लागि `prod-docker-compose.yaml` प्रयोग गर्नुहोस्; Dokploy मा
डिप्लोय गर्ने तरिका [docs/deployment.md](docs/deployment.md) मा छ।

## आफ्नै कम्प्युटरमा विकास

[Bun](https://bun.sh) 1.4 वा नयाँ र Docker (Postgres का लागि) चाहिन्छ।

1. **सुरुआती सेटअप।** `bun run setup` ले नयाँ `AUTH_SECRET` सहित
   `apps/api/.env.local` लेख्छ (भइरहेको फाइल कहिल्यै मेटाउँदैन), Postgres सुरु
   गर्छ, निर्भरता (dependencies) इन्स्टल गर्छ, माइग्रेसन लागू गर्छ, र GitHub बाट
   परियोजना र इस्युहरू ल्याउँछ। यसलाई फेरि चलाउँदा केही बिग्रँदैन।

   ```sh
   git clone git@github.com:SDOC-Team/devnepal.git
   cd devnepal
   bun run setup
   ```

2. **GitHub OAuth App का क्रेडेन्सियल** `apps/api/.env.local` मा थप्नुहोस्
   (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`; Docker निर्देशनको पहिलो चरण
   हेर्नुहोस्)। प्रशासन पृष्ठका लागि आफ्नो GitHub को अङ्कमा भएको ID
   (`https://api.github.com/users/<login>` → `id`) `ADMIN_GITHUB_IDS` मा थप्नुहोस्।
3. **चलाउनुहोस्:**

   ```sh
   bun run dev    # http://localhost:3000/ne
   ```

4. **जाँच्नुहोस्:**

   | जाँच | अपेक्षित नतिजा |
   |---|---|
   | `curl localhost:3000/health` | `{"status":"ok"}` |
   | <http://localhost:3000/ne>, <http://localhost:3000/en> | दुवै भाषामा गृहपृष्ठ |
   | <http://localhost:3000/ne/issues> | रिपोजिटरीका खुला इस्युहरू, लेबल फिल्टर र खोजसहित |
   | <http://localhost:3000/ne/members> | स्वीकृत सदस्य मात्र (कसैले साइन इन गरेर स्वीकृत नभएसम्म खाली) |
   | `bun run test` | सबै टेस्ट पास हुन्छन् |

सेटअपले कुनै सदस्य खाता बनाउँदैन। आफ्नो खाता बनाउन एकपटक GitHub बाट साइन इन
गर्नुहोस्; त्यसपछि `bun run dev:session <your-github-username>` ले त्यो
सदस्यको सेसन कुकी देखाउँछ, जसले गर्दा हरेकपटक GitHub बाट साइन इन नगरी साइन इन
भएपछिका पृष्ठहरू जाँच्न सकिन्छ। [docs/frontend.md](docs/frontend.md) हेर्नुहोस्।

**समस्या समाधान**

- `docker compose` चल्दैन: Docker चलिरहेको छैन (`colima start`, वा Docker
  Desktop सुरु गर्नुहोस्)।
- पोर्ट 5432 वा 3000 प्रयोगमा छ: `docker-compose.yml` सँगैको `.env` मा
  `DB_PORT` / `API_PORT` राख्नुहोस्, र `apps/api/.env.local` को `DATABASE_URL`
  मा पनि त्यही पोर्ट राख्नुहोस्।
- सुरुदेखि फेरि गर्न: `docker compose down -v && bun run setup`।

## कन्फिगरेसन

सबै सेटिङ एनभाइरनमेन्ट भेरिएबल (environment variable) हुन्। `bun run dev` ले
तिनलाई `apps/api/.env.local` बाट पढ्छ; Docker Compose ले `docker-compose.yml`
सँगैको `.env` बाट पढ्छ। [`apps/api/.env.example`](apps/api/.env.example) मा
हरेकको टिप्पणीसहित सूची छ, Compose ले मात्र प्रयोग गर्ने केही सेटिङसमेत;
उदाहरण फाइलबाहेक कुनै `.env*` फाइल कहिल्यै कमिट गरिँदैन।

| भेरिएबल | अनिवार्य | प्रयोजन |
|---|---|---|
| `DATABASE_URL` | हो | PostgreSQL जडान स्ट्रिङ |
| `AUTH_SECRET` | हो | सेसन इन्क्रिप्सन, कम्तीमा ३२ अक्षर |
| `AUTH_GITHUB_ID` | हो | GitHub OAuth App को client ID |
| `AUTH_GITHUB_SECRET` | हो | GitHub OAuth App को client secret |
| `ADMIN_GITHUB_IDS` | होइन | सदस्य मोडरेट गर्न पाउने GitHub ID हरू, अल्पविरामले छुट्याएर |
| `GITHUB_PROJECT_REPOSITORY` | होइन | `db:init` ले ल्याउने रिपोजिटरी; पूर्वनिर्धारित `SDOC-Team/devnepal` |
| `GITHUB_TOKEN` | होइन | `db:init` र `sync:github` का लागि GitHub API को सीमा बढाउँछ |
| `STORAGE_DIR` | होइन | अवतार राखिने ठाउँ; पूर्वनिर्धारित `./storage` (Docker मा भोल्युम) |
| `WEB_ORIGIN` | होइन | क्रेडेन्सियलसहित API बोलाउन पाउने थप origin; UI आफैँ उही origin मा छ |
| `GITHUB_WEBHOOK_SECRET` | होइन | `POST /webhooks/github` सक्रिय गर्छ; यसबिना उक्त endpoint निष्क्रिय रहन्छ |
| `TEST_DATABASE_URL` | होइन | टेस्टहरूका लागि डाटाबेस |

## कमान्डहरू

```sh
bun run setup          # local bootstrap (safe to rerun)
bun run dev            # development server at http://localhost:3000
bun run build          # production build (standalone output)
bun run start          # serve the production build
bun run test           # test suite (creates and migrates the test database)
bun run typecheck      # TypeScript
bun run lint           # Biome
bun run format         # Biome formatter
bun run api:check      # lint the OpenAPI contract and fail if the client is out of date
bun run db:generate    # create a migration from the schema
bun run db:migrate     # apply migrations to DATABASE_URL
bun run db:init        # load the project and its issues from GitHub
bun run sync:github    # refresh issues from GitHub
bun run dev:session    # print a session cookie for an existing member
```

## यो कसरी बनेको छ

एउटै Next.js 16 एप्लिकेसनले पृष्ठहरू (`/en`, `/ne`) र संस्करणसहितको JSON API
(`/v1/...`) दुवै दिन्छ, र Drizzle ORM मार्फत PostgreSQL 17 प्रयोग गर्छ। साइन इन
Auth.js मार्फत GitHub OAuth बाट हुन्छ। UI मा React 19, Base UI माथिका shadcn/ui
कम्पोनेन्टसहित Tailwind CSS 4, र SWR प्रयोग भएका छन्। टेस्टहरू Vitest मा
वास्तविक डाटाबेसविरुद्ध चल्छन्; Biome ले लिन्ट र फर्म्याट गर्छ।

```
apps/api/
  src/app/(site)/[locale]/   pages: home, project, issues, members, profile, welcome, admin, about
  src/app/v1/                API route handlers
  src/components/            UI components
  src/lib/                   translations (i18n.ts) and client helpers
  src/server/                services, repositories, authorization, storage
  src/db/                    schema and database client
  drizzle/                   generated SQL migrations
  src/scripts/               project init, GitHub sync, dev session
  tests/                     unit and integration tests
packages/api-contract/       OpenAPI description of the API
packages/api-client/         generated API types and browser client
packages/shared/             validation schemas and shared types
docs/                        frontend guide and deployment notes
```

**API सम्झौता (contract)**
[`packages/api-contract/openapi.yaml`](packages/api-contract/openapi.yaml) हो।
पहिले यसलाई बदल्नुहोस्, `bun run api:generate` ले क्लाइन्ट फेरि बनाउनुहोस्, अनि
handler लेख्नुहोस्; बनाइएको क्लाइन्ट पुरानो भए CI असफल हुन्छ।

**इस्युहरू** परियोजनाको सार्वजनिक GitHub रिपोजिटरीबाट आउँछन्। `db:init` र
`sync:github` ले तिनलाई मिलाउँछन्; सत्यको स्रोत GitHub नै रहन्छ।

**सदस्य प्रोफाइल** पहिलोपटक GitHub बाट साइन इन गर्दा `pending` अवस्थामा बन्छ।
`approved` प्रोफाइल मात्र सार्वजनिक हुन्छन्। pending, rejected वा hidden
प्रोफाइलका लागि सदस्य आफूबाहेक सबैलाई API ले `404` फर्काउँछ, र पृष्ठमा "प्रोफाइल
उपलब्ध छैन" देखिन्छ। सार्वजनिक जवाफमा आन्तरिक id, मोडरेसन अवस्था, प्राथमिकता वा
स्वीकृतिको विवरण कहिल्यै हुँदैन।

**गोपनीयता र सुरक्षा**, प्रत्येकको टेस्टसहित:

- साइन इनले `read:user` स्कोप मात्र माग्छ। इमेल ठेगाना कहिल्यै मागिँदैन, राखिँदैन,
  वा सेसनमा रहँदैन।
- सदस्यले आफ्नो प्रोफाइल मात्र, र त्यसका सम्पादन गर्न मिल्ने फिल्ड मात्र बदल्न
  सक्छन्। प्रशासक `ADMIN_GITHUB_IDS` मा भएका GitHub ID हुन्, जुन हरेक अनुरोधमा
  जाँचिन्छ।
- अवतार एकपटक डाउनलोड गरिन्छ, बढीमा २ MB का वास्तविक PNG, JPEG वा WebP तस्बिर
  हुन् भनी जाँचिन्छ, र पोर्टलबाटै दिइन्छ। पृष्ठहरूले GitHub बाट अवतार कहिल्यै
  लोड गर्दैनन्।
- इस्युको पाठ सुरक्षित (sanitised) Markdown का रूपमा देखाइन्छ; कच्चा HTML कहिल्यै
  राखिँदैन।
- सेसन कुकीसहित गरिएका परिवर्तन अर्को origin बाट आए अस्वीकार हुन्छन्, साइन इन र
  लेख्ने रुटहरूमा प्रति-क्लाइन्ट दर सीमा (rate limit) छ, र हरेक जवाफमा आधारभूत
  सुरक्षा हेडरहरू हुन्छन्।

## योगदान

[CONTRIBUTING.md](CONTRIBUTING.md) बाट सुरु गर्नुहोस्: इस्यु कसरी लिने (`ready`
लेबल भएका मात्र), fork मा कसरी काम गर्ने, र हरेक कमिटमा `git commit -s` ले कसरी
sign-off गर्ने। ब्रान्चका नाम, कमिटका प्रकार, लेबल, र पुल रिक्वेस्ट कहिले पूरा
मानिन्छ भन्ने कुरा [docs/CONVENTIONS.md](docs/CONVENTIONS.md) मा छन्।

पुल रिक्वेस्टका लागि CI (lint, typecheck, टेस्ट, build, API सम्झौता जाँच) पास
हुनुपर्छ र एउटा स्वीकृति (approving review) चाहिन्छ। push गर्नुअघि
`bun run lint && bun run typecheck && bun run test && bun run build` चलाउनुहोस्।

- [आचारसंहिता](CODE_OF_CONDUCT.md) · [सुशासन](GOVERNANCE.md) ·
  [मेन्टेनरहरू](MAINTAINERS.md)
- सुरक्षा समस्या: सार्वजनिक इस्युमा कहिल्यै नराख्नुहोस्। [SECURITY.md](SECURITY.md)
  हेर्नुहोस्।
- उत्पादनका आवश्यकता: [docs/PRD-v0.1.md](docs/PRD-v0.1.md)
- गोपनीयता: [PRIVACY.md](PRIVACY.md)
- डिप्लोयमेन्ट: [docs/deployment.md](docs/deployment.md)
