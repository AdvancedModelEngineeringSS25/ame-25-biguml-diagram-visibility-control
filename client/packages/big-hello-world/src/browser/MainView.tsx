/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react/index.js';
import type { Layer } from '../model/model.js';

export function MainView({ layers, moveUp, moveDown, toggleActive, goToDetails, uploadConfig, saveConfig, recomputeAll, addLayer }: {
  layers: Layer[];
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  toggleActive: (id: string) => void;
  goToDetails: (id: string) => void;
  uploadConfig: () => void;
  saveConfig: () => void;
  recomputeAll: () => void;
  addLayer: () => void;
}) {
  return (
    <div id="main-view">
      <div id="layer-list">
        <h2>Your Layers</h2>
        {layers.map(layer => (
          <div key={layer.id} id="layer">
            <span>{layer.name}</span>
            <div id="layer-buttons">
              <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveUp(layer.id)}>
                <div className='codicon codicon-chevron-up'></div>
              </VSCodeButton>
              <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveDown(layer.id)}>
                <div className='codicon codicon-chevron-down'></div>
              </VSCodeButton>
              <VSCodeButton slot='anchor' appearance='icon' onClick={() => toggleActive(layer.id)}>
                {layer.visible
                  ? <div className='codicon codicon-eye'></div>
                  : <div className='codicon codicon-eye-closed'></div>
                }
              </VSCodeButton>
              <VSCodeButton slot='anchor' appearance='icon' onClick={() => goToDetails(layer.id)}>
                <div className='codicon codicon-chevron-right'></div>
              </VSCodeButton>
            </div>
          </div>
        ))}
      </div>
      <br />
      <VSCodeDivider />
      <footer>
        <div id="secondary-footer-buttons">
          <VSCodeButton slot='anchor' appearance='icon' onClick={uploadConfig}>
            <div className='codicon codicon-cloud-upload'></div>
          </VSCodeButton>
          <VSCodeButton slot='anchor' appearance='icon' onClick={saveConfig}>
            <div className='codicon codicon-cloud-download'></div>
          </VSCodeButton>
          <VSCodeButton slot='anchor' appearance='icon' onClick={recomputeAll}>
            <div className='codicon codicon-refresh'></div>
          </VSCodeButton>
        </div>
        <div id="primary-footer-button">
          <VSCodeButton slot='anchor' appearance='icon' onClick={addLayer}>
            <div className='codicon codicon-add'></div>
          </VSCodeButton>
        </div>
      </footer>
    </div>
  );
}