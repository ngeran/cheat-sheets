---
title: React
subtitle: UI Library
icon: Atom
color: tertiary
tags: [javascript, library, frontend]
---

## State Hooks
| Command | Description |
|---|---|
| `const [v, setV] = useState(init)` | Declare state; `init` is initial value or function |
| `useState(() => computeHeavy())` | Lazy initializer; function runs once on mount |
| `setV(next)` | Replace state with a new value |
| `setV(prev => prev + 1)` | Update from previous state (use inside callbacks) |
| `const [s, dispatch] = useReducer(reducer, init)` | State via a reducer; returns `[state, dispatch]` |
| `useReducer(reducer, initArg, initFn)` | Reducer with lazy third-arg initializer |
| `dispatch({ type: "inc" })` | Send an action object to the reducer |
| `function reducer(state, action)` | Reducer body; must return new state, no mutation |
| `useState` setter is stable | Setter identity never changes across renders |
| Multiple `setState` in one handler | Batched into a single re-render (React 18+) |

## Effect Hooks
| Command | Description |
|---|---|
| `useEffect(() => { ... })` | Runs after every commit (no deps) |
| `useEffect(() => { ... }, [])` | Runs once after mount (empty deps) |
| `useEffect(() => { ... }, [a, b])` | Runs on mount and when `a` or `b` changes |
| `useEffect(() => { return clean }, deps)` | Cleanup runs before next effect and on unmount |
| `return () => clearInterval(id)` | Typical cleanup for timers/subscriptions |
| Effects run after paint | Non-blocking; screen updates before effect |
| `useLayoutEffect(() => {}, deps)` | Runs synchronously after DOM mutation, before paint |
| `useLayoutEffect` for DOM measurements | Use when you must read/rewrite layout before flicker |
| Effects cannot be `async` | Return a Promise breaks cleanup; define inner `async fn` |
| Every reactive value used must be in deps | Omitting causes stale closures; enable `react-hooks/exhaustive-deps` |

## Memoization
| Command | Description |
|---|---|
| `useMemo(() => calc(a, b), [a, b])` | Cache a computed value until deps change |
| `useCallback(() => fn(a), [a])` | Cache a function reference until deps change |
| `useMemo(() => work, [])` | Compute once for the component's lifetime |
| Memo return is cached until deps change | Reused across renders when deps are unchanged |
| Pair `useCallback` with `React.memo` | Stable props prevent child re-render |
| Don't memo cheap values | Memo itself costs cycles; profile before adding |

## Refs
| Command | Description |
|---|---|
| `const r = useRef(null)` | Mutable container; persists across renders |
| `r.current` | Read or write the current value directly |
| `<input ref={r} />` | Attach ref to capture the DOM node |
| Mutating `r.current` does NOT re-render | Refs are escape hatches from the render flow |
| `const Comp = forwardRef((props, ref) => {})` | Let parent pass a ref through to the child |
| `useImperativeHandle(ref, () => ({ fn }), [])` | Expose a custom imperative API via the ref |
| Refs are not in effect deps | Mutable but stable; omit from dependency arrays |

## Context
| Command | Description |
|---|---|
| `const Ctx = createContext(default)` | Create a context with a fallback default |
| `<Ctx.Provider value={v}>...</Ctx.Provider>` | Supply value to all descendant consumers |
| `const v = useContext(Ctx)` | Read nearest provider's value; triggers re-render on change |
| Provider value from `useState` | Updating provider state re-renders all consumers |
| Context beats prop drilling | Pass deep values without intermediate props |
| Default used only without a provider | `default` applies when no `Provider` is found above |

## Component Patterns
| Command | Description |
|---|---|
| `function Comp(props) { return JSX }` | Function component; name starts with uppercase |
| `const Comp = ({ a, b }) => {}` | Destructure props in the signature |
| `props.children` | The nested JSX passed between tags |
| `function Layout({ children }) { return children }` | Composition: render children explicitly |
| `<Comp {...rest} />` | Spread remaining props onto an element |
| `<>...</>` | Fragment; groups nodes without a DOM wrapper |
| `<Fragment key={k}>...</Fragment>` | Fragment that needs a key (e.g. in a list) |
| `<input value={v} onChange={e => set(e.target.value)} />` | Controlled input: React owns the value |
| `<input defaultValue={v} />` | Uncontrolled input: DOM owns the value |
| Lift shared state to common ancestor | Two siblings read/update via a parent's `useState` |
| `list.map(item => <li key={item.id}>{item.name}</li>)` | Render a list with stable keys |
| Keys must be stable and unique | Avoid array index when items reorder/insert |
| Pass `setX` down as a prop | Child reports state changes up via callback |
| Props are read-only | Never mutate `props`; communicate via callbacks |

## Events
| Command | Description |
|---|---|
| `onClick={handleClick}` | Attach a click handler (reference, not call) |
| `onClick={() => remove(id)}` | Wrap in arrow fn to pass an argument |
| `onChange={e => setValue(e.target.value)}` | Track text input changes |
| `onSubmit={e => e.preventDefault()}` | Stop the form from reloading the page |
| `e.stopPropagation()` | Stop the event bubbling to parent handlers |
| Synthetic events | `SyntheticEvent` normalizes events across browsers |
| No event pooling since React 17 | Safe to read `e` asynchronously; `e.persist()` is a no-op |
| Events delegated to root | Attached at the root container, not per-element (React 17+) |
| `onKeyDown={e => e.key}` | Read key from keyboard events |
| `onFocus` / `onBlur` | Focus-related element events |

## Custom Hooks
| Command | Description |
|---|---|
| `function useToggle(initial) { ... return [v, toggle] }` | Encapsulate reusable stateful logic |
| Name must start with `use` | Linter rule enforces the prefix for hooks |
| Call hooks at the top level only | Never inside loops, conditions, or nested functions |
| Call hooks from React functions only | From a component or from another hook |
| Compose hooks freely | A custom hook may call `useState`, `useEffect`, others |
| Hooks share logic, not state | Each component using the hook gets its own state |

## Performance
| Command | Description |
|---|---|
| `const M = React.memo(Comp)` | Skip re-render when props are shallow-equal |
| `React.memo(Comp, (a, b) => custom)` | Provide a custom equality function |
| `const Lazy = lazy(() => import("./Comp"))` | Code-split a component; loads on first render |
| `<Suspense fallback={<Loader />}>` | Show fallback while lazy children load |
| Stable keys aid reconciliation | Same key reuses DOM across renders |
| `startTransition(() => setLarge(x))` | Mark an update as interruptible/non-urgent |
| `const deferred = useDeferredValue(v)` | Defer a value to keep UI responsive on heavy renders |
| `React.memo` is shallow only | Nested objects/arrays compared by reference, not content |

## Routing (react-router v6)
| Command | Description |
|---|---|
| `<BrowserRouter>` | Wraps the app; enables client-side routing |
| `<Routes>...</Routes>` | Container that picks the best matching `Route` |
| `<Route path="/x" element={<X />} />` | Render `<X />` when path matches |
| `<Route path="/x/:id" element={<X />} />` | URL parameter named `id` |
| `<Route index element={<Home />} />` | Render at the parent's exact path |
| `<Route path="*">` | Catch-all / 404 fallback |
| `<Route path="/u"><Route index />...</Route>` | Nested routes via children |
| `<Link to="/x">Go</Link>` | Client-side navigation link |
| `<NavLink to="/x">` | Link that knows when it is active |
| `const nav = useNavigate()` | Programmatic navigation function |
| `nav("/x")` / `nav(-1)` | Navigate to a path / go back one step |
| `const { id } = useParams()` | Read matched URL parameters |
| `const loc = useLocation()` | Current `{ pathname, search, hash }` |
| `<Navigate to="/x" replace />` | Declarative redirect (render inside a route) |
| `<Outlet />` | Renders the matched nested child route |
