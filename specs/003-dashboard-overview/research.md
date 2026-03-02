# Chart Library Research: Recharts vs Chart.js

## Requirements
- Donut Chart (expense by category)
- Bar Chart (income/expense by day)
- React integration
- Responsive (mobile/desktop)
- Accessibility (keyboard, screen reader)
- Bundle size & ease of integration

## Recharts
- **React-first**: Built for React, declarative API, native SVG.
- **Donut Chart**: Use PieChart with `innerRadius` for donut effect. Supports custom colors, labels, legends.
- **Bar Chart**: BarChart supports stacked/grouped bars, custom colors, tooltips, legends.
- **Responsiveness**: Use ResponsiveContainer for fluid layouts.
- **Accessibility**: v3+ supports keyboard navigation, screen readers by default. No extra config needed.
- **Integration**: Simple install (`npm install recharts`), no wrappers needed.
- **Bundle size**: ~80KB min+gzipped (core), smaller than Chart.js+React wrapper.
- **Docs & Community**: Good docs, many React examples, widely used in React ecosystem.

## Chart.js
- **General JS**: Not React-specific; use with React via react-chartjs-2 wrapper.
- **Donut Chart**: Use Doughnut chart type, supports cutout percentage, custom colors, legends.
- **Bar Chart**: Bar chart type, supports stacked/grouped, custom colors, tooltips, legends.
- **Responsiveness**: Responsive by default, but requires container setup and config tweaks.
- **Accessibility**: Basic ARIA roles, but less React-native accessibility than Recharts. More manual work for keyboard/screen reader support.
- **Integration**: Requires both chart.js and react-chartjs-2. Slightly more setup.
- **Bundle size**: ~180KB min+gzipped (core) + react-chartjs-2 wrapper.
- **Docs & Community**: Excellent docs, huge community, but less React-focused.

## Summary Table
| Feature         | Recharts         | Chart.js (+react-chartjs-2) |
|----------------|------------------|-----------------------------|
| React-native   | Yes              | No (needs wrapper)          |
| Donut Chart    | Yes              | Yes                         |
| Bar Chart      | Yes              | Yes                         |
| Responsive     | Yes (easy)       | Yes (needs config)          |
| Accessibility  | Yes (v3+)        | Partial (manual)            |
| Bundle size    | ~80KB            | ~180KB+                     |
| Integration    | Simple           | More setup                  |

## Recommendation
**Recharts** is preferred for this dashboard:
- Native React API, easier integration
- Smaller bundle size
- Built-in accessibility
- Responsive out of the box
- Good documentation and examples for Donut/Bar charts

## References
- [Recharts Docs](https://recharts.org/en-US/examples)
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- Context7 research output (2026-03-02)
