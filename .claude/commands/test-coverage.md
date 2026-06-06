# Test Coverage analysieren & verbessern

Ungetestete Code-Bereiche identifizieren und Coverage erhöhen.

## Workflow

### 1. Coverage Report erstellen

```bash
npm run test:coverage
```

### 2. Kritische Files mit <80% Coverage identifizieren

Priorisierung nach Wichtigkeit:

1. **Services (höchste Prio)** — Business Logic
   - `src/services/storage.ts` — AsyncStorage Wrapper, Zod-Validierung
2. **Utils** — Pure Functions, einfach zu testen
   - `src/utils/activityLayout.ts` — calculateActivityRows, convertActivitiesToPortraitSlots
   - `src/utils/monthHelper.ts` — Halbmonat-Berechnungen
3. **Hooks** — `src/hooks/useTheme.ts`
4. **Contexts** — `src/contexts/PlantContext.tsx`, `LanguageContext.tsx`
5. **Components** — nur kritische Logik
   - `src/components/ActivityBar.tsx`
   - `src/components/AddPlantModal.tsx`
6. **Screens** — End-to-End Smoke-Tests
   - `src/screens/PlantManagementScreen.tsx`
   - `src/screens/CalendarScreen.tsx`

### 3. Fehlende Tests identifizieren

Für jede Funktion ohne Test:

- Zeige Funktions-Signatur
- Schlage Test-Cases vor (happy path + edge cases)
- Erstelle Tests in `__tests__/<category>/[filename].test.ts`

### 4. Test-Mocks beachten

Folgende Mocks sind konfiguriert:

- `@react-native-async-storage/async-storage` — via jest-mock
- `react-native` Module — via jest-expo preset

Für AsyncStorage-Tests: `jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(...)` nutzen

**Wichtig:** npm install braucht `--legacy-peer-deps` wegen react/react-test-renderer Konflikt (Peer-Dep-Konflikt mit React 19)

### 5. Tests ausführen und Coverage prüfen

```bash
npm test
npm run test:coverage
```

Ziel: ≥85% gesamt, ≥90% für Services/Utils

### 6. Coverage Report zeigen

```
📊 Coverage Report

⚠️  Low Coverage (<80%):
- src/screens/PlantManagementScreen.tsx → XX% (CRITICAL)
  Fehlende Tests für: addPlant(), editPlant(), deleteConfirmation

✅ High Coverage (>80%):
- src/services/storage.ts → 95%
- src/utils/activityLayout.ts → 92%

Overall: XX% (Ziel: ≥85%)
```

### 7. Nächste Test-Kandidaten (aus Phase 3 Roadmap)

- `__tests__/screens/PlantManagementScreen.test.tsx`
- `__tests__/components/EditActivityModal.test.tsx`
- `__tests__/components/AddActivityModal.test.tsx`
- `__tests__/utils/colorUtils.test.ts`
- `__tests__/components/ErrorBoundary.test.tsx`
