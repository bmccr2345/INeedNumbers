# Mobile Dashboard Architecture

## Phase 1: Investigation Summary

### Current State Analysis

#### DashboardPage.js Status
- **localStorage Access:** ✅ All properly wrapped with `safeLocalStorage`
- **window Access:** ⚠️ Uses `window.gtag` for analytics (lines 288, 304)
  - These are conditionally checked (`if (window.gtag)`) so they're safe
  - No render-blocking window access detected
- **Authentication:** ✅ Uses AuthContext with proper loading state
- **Structure:** Desktop-only sidebar navigation with 12+ tab panels

#### AuthContext.js Status
- **axios Configuration:** ✅ Already sets `withCredentials: true` (line 24)
- **Loading State:** ✅ Properly exposed in context (line 18)
- **SafeLocalStorage:** ✅ Already implemented (line 4)
- **Session Management:** ✅ Cookie-based authentication, no tokens in localStorage

#### Critical Findings
1. **No render-blocking issues** in DashboardPage.js - all localStorage/window access is in useEffect
2. **AuthContext is production-ready** - already follows best practices
3. **Blank screen issue** likely caused by:
   - Missing responsive styles for mobile viewport
   - Desktop-only sidebar layout not adapting to mobile
   - Content panels requiring desktop grid layout

---

## Architecture Design

### Component Structure

```
src/
├── layouts/
│   ├── DesktopLayout.js          [EXISTING - to be extracted]
│   └── MobileLayout.js            [NEW - Phase 3]
│
├── pages/
│   ├── DashboardPage.js           [MODIFY - add responsive logic]
│   └── MobileDashboard.js         [NEW - Phase 3]
│
├── components/
│   ├── dashboard/
│   │   ├── HomepagePanel.js       [EXISTING - reuse for mobile]
│   │   ├── CapTrackerPanel.js     [EXISTING - reuse for mobile]
│   │   ├── ActionTrackerPanel.js  [EXISTING - reuse for mobile]
│   │   └── AICoachBanner.js       [EXISTING - reuse for mobile]
│   │
│   └── mobile/
│       ├── MobileCard.js          [NEW - Phase 3]
│       ├── MobileTabBar.js        [NEW - Phase 3]
│       └── QuickActionButton.js   [NEW - Phase 3]
│
└── hooks/
    └── useMediaQuery.js           [NEW - Phase 2]
```

---

## Mobile Layout Requirements

### Tab Navigation (Bottom)
```
┌─────────────────────────────────┐
│                                 │
│        Content Area             │
│                                 │
├─────────────────────────────────┤
│ [Overview] [Calc] [Coach] [More]│ ← Bottom tab bar
└─────────────────────────────────┘
```

### MobileDashboard Card Stack
1. **This Month's Net** - From HomepagePanel financial metrics
2. **Commission Cap Progress** - From CapTrackerPanel
3. **Open Actions** - From ActionTrackerPanel
4. **AI Coach Snapshot** - From AICoachBanner

### Floating Action Button
- Fixed position: bottom-right (above tab bar)
- Opens: Add Action/Goal modal
- Color: Primary green

---

## Responsive Breakpoints

| Breakpoint | Layout       | Behavior                           |
| ---------- | ------------ | ---------------------------------- |
| < 768px    | Mobile       | Bottom tabs, stacked cards, FAB    |
| ≥ 768px    | Desktop      | Sidebar navigation, grid layout    |

---

## API Dependencies

### Dashboard Data Endpoints
- `GET /api/auth/me` - User profile (authentication)
- `GET /api/users/{userId}/goals` - Goal tracking data
- `GET /api/users/{userId}/actions` - Action tracker items
- `GET /api/cap-tracker/progress` - Commission cap metrics
- `GET /api/pnl/monthly-summary` - Financial overview

### Required in Mobile View
- ✅ User authentication state
- ✅ Commission cap progress
- ✅ Action tracker count
- ✅ Monthly net income
- ⚠️ AI Coach last message (if PRO)

---

## Component Dependencies Map

### HomepagePanel Dependencies
```javascript
// Uses:
- AuthContext (user, plan)
- axios for API calls
- FinancialOverviewModal
- ActivityModal
- ReflectionModal
```

### CapTrackerPanel Dependencies
```javascript
// Uses:
- AuthContext (user)
- axios for cap data
- react-circular-progressbar
```

### ActionTrackerPanel Dependencies
```javascript
// Uses:
- AuthContext (user)
- axios for actions CRUD
- Complex state management
```

### AICoachBanner Dependencies
```javascript
// Uses:
- AuthContext (user, plan)
- Plan gating (PRO only)
- Navigation to AI coach pages
```

---

## Phase 2 Implementation Tasks

### 2.1 Create useMediaQuery Hook
```javascript
// src/hooks/useMediaQuery.js
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}
```

### 2.2 Create Placeholder MobileLayout
```javascript
// src/layouts/MobileLayout.js
export default function MobileLayout() {
  return (
    <div className="mobile-layout h-screen flex flex-col">
      <header className="bg-primary p-4 text-white">
        Mobile Header (Placeholder)
      </header>
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
      <nav className="bg-white border-t p-2 flex justify-around">
        Mobile Tab Bar (Placeholder)
      </nav>
    </div>
  );
}
```

### 2.3 Update DashboardPage.js
- Add useMediaQuery hook
- Conditionally render mobile vs desktop layout
- Preserve all existing desktop logic

### 2.4 Create ErrorBoundary Wrapper
```javascript
// src/components/ErrorBoundary.js
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('[Dashboard Error]:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

---

## Testing Strategy

### Phase 2 Validation Checklist
- [ ] Desktop layout unchanged at ≥768px
- [ ] Mobile placeholder visible at <768px
- [ ] No console errors on Safari
- [ ] AuthContext loading state prevents blank screen
- [ ] Resize window 767-769px - smooth transition
- [ ] Test credentials work: demo@ineednumbers.com / Password123!

### Safari-Specific Tests
- [ ] No QuotaExceededError
- [ ] No SecurityError
- [ ] No blank white screen
- [ ] Scroll works correctly
- [ ] Touch gestures responsive

---

## Risks & Mitigation

| Risk                         | Mitigation Strategy                           |
| ---------------------------- | --------------------------------------------- |
| Break desktop layout         | Use media query isolation, test at each step |
| Safari localStorage blocking | Already using safeLocalStorage utility        |
| Performance degradation      | Lazy load mobile components, code splitting   |
| Authentication issues        | Extensive testing with demo credentials       |
| Touch target too small       | Follow 44x44px minimum for all tap areas      |

---

## Success Criteria (Phase 2)

✅ MobileLayout placeholder renders correctly at <768px
✅ Desktop layout unchanged at ≥768px  
✅ No blank screen on Safari iOS after login
✅ AuthContext loading state visible
✅ useMediaQuery hook working correctly
✅ No console errors or warnings

---

*Document created: Phase 1 Investigation*
*Next: Phase 2 Implementation*
