/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
// import { useLayerStore } from './layerStore.js';
// import type { Layer } from './types.js';

// /* VS Code handle inside the webview */
// declare const acquireVsCodeApi: () => { postMessage: (msg: unknown) => void };
// const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

// /* ---------- outbound helpers ---------- */
// export const exportConfig = (filename = 'diagram-layers.json') => {
//     const data = JSON.stringify(useLayerStore.getState().layers, null, 2);
//     vscode?.postMessage({ command: 'exportConfig', filename, data });
// };

// export const importConfig = (json: string) => {
//     try {
//         const layers: Layer[] = JSON.parse(json);
//         useLayerStore.setState({ layers });
//     } catch (e) {
//         console.error('[importConfig] invalid JSON', e);
//     }
// };

// /* ---------- persist visible-layer IDs ---------- */
// useLayerStore.subscribe(
//     s => s.layers.filter(l => l.visible).map(l => l.id),
//     visibleIds => vscode?.postMessage({ command: 'storeActiveLayers', visibleIds })
// );
