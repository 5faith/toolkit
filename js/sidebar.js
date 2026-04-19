/* ============================================
   Sidebar Navigation Component
   ============================================ */

const TOOLS = [
  {
    id: 'json-xml-formatter',
    name: 'JSON / XML Formatter',
    path: 'json-xml-formatter/index.html'
  },
  {
    id: 'timestamp-tool',
    name: 'Timestamp Tool',
    path: 'timestamp-tool/index.html'
  },
  {
    id: 'websocket-debugger',
    name: 'WebSocket Debugger',
    path: 'websocket-debugger/index.html'
  },
  {
    id: 'flv-player',
    name: 'FLV Player',
    path: 'stream-player/index.html'
  }
];

function getBasePath() {
  const currentPath = window.location.pathname;
  const depth = (currentPath.match(/tools/g) || []).length;
  return '../'.repeat(depth) || './';
}

function renderSidebar(currentToolId) {
  const basePath = getBasePath();
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  sidebar.innerHTML = `
    <div class="sidebar__header">
      <span class="sidebar__title">Tools</span>
    </div>
    <ul class="sidebar__list">
      ${TOOLS.map(tool => `
        <li class="sidebar__item">
          <a href="${basePath}${tool.path}" 
             class="sidebar__link ${tool.id === currentToolId ? 'active' : ''}">
            ${tool.name}
          </a>
        </li>
      `).join('')}
    </ul>
  `;

  return sidebar;
}

function initSidebar(currentToolId) {
  const main = document.querySelector('main');
  if (!main) return;

  const sidebarLayout = document.createElement('div');
  sidebarLayout.className = 'sidebar-layout';

  const sidebar = renderSidebar(currentToolId);
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'sidebar__content';

  while (main.firstChild) {
    contentWrapper.appendChild(main.firstChild);
  }

  sidebarLayout.appendChild(sidebar);
  sidebarLayout.appendChild(contentWrapper);
  main.appendChild(sidebarLayout);

  main.style.paddingTop = '0';
  main.style.paddingBottom = '0';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOOLS, initSidebar };
}
