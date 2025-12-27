Personal Expense

Pocket Ledger is a small Expo React Native application for tracking personal expenses. It demonstrates Navigation, Forms, List Rendering, and Local Data Persistence using a concise, pragmatic code structure.

Core features
- Dashboard: summary of income/expenses and a scrollable list of recent transactions.
- Add Entry: form to add a transaction (Amount, Category, Date, Note, Income/Expense type).
- Local persistence: transactions are persisted using AsyncStorage.
- Navigation: light routing using Expo Router/React Navigation.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the app (example port 8001):

```bash
npx expo start --port 8001
```

Project structure (high-level)

- app/
	- (tabs)/ — main tab screens (Dashboard, Add Entry, Settings)
	- components/ — reusable UI components (MonthlyChart, CategoryPicker, etc.)
	- providers/ — Context providers (TransactionsProvider, ThemeProvider, CurrencyProvider)
	- hooks/ — small shared hooks (useAppStyles)
	- (lib)/ — helpers (date parsing)
- assets/ — images and static assets
- components/ — small shared presentational components used across app and web
- constants/ — categories, theme tokens, typography

Why these choices

- Expo + TypeScript: fast iteration and cross-platform consistency with type safety.
- Context API (TransactionsProvider): lightweight and appropriate for app-wide state (transactions, persistence). Easy to reason about and small compared to Redux.
- AsyncStorage: simple, reliable local persistence for this scope. The provider normalizes date values on load.
- Expo Router / React Navigation: clean, file-based routing and smooth navigation between Dashboard and Add Entry.
- react-native-svg + custom `MonthlyChart`: small, dependency-light visualization for monthly totals.
- @react-native-picker/picker and `react-native-modal-datetime-picker`: consistent native-like inputs across platforms.

Files to review
- [app/(tabs)/index.tsx](app/(tabs)/index.tsx) — Dashboard screen and list rendering
- [app/(tabs)/add-entry.tsx](app/(tabs)/add-entry.tsx) — Add Entry form and validation
- [app/providers/TransactionsProvider.tsx](app/providers/TransactionsProvider.tsx) — AsyncStorage persistence + add/edit/delete APIs

Deliverables / Demo

- Source code: commit this repo and push to GitHub.
- Demo: record a short screen capture showing adding transactions, viewing the dashboard, and persistence after a restart.









