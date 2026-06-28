import DefaultTheme from 'vitepress/theme';

import DocIcon from './components/DocIcon.vue';
import DocTab from './components/DocTab.vue';
import DocTabs from './components/DocTabs.vue';
import MermaidDiagram from './components/MermaidDiagram.vue';
import VersionBadge from './components/VersionBadge.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocIcon', DocIcon);
    app.component('DocTab', DocTab);
    app.component('DocTabs', DocTabs);
    app.component('MermaidDiagram', MermaidDiagram);
    app.component('VersionBadge', VersionBadge);
  }
};
