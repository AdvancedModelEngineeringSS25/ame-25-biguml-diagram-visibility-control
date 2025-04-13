/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react/index.js';
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
        <div>
          <div className="space-y-2">
  {layers.map(layer => (
    <div
      key={layer.id}
      className="flex items-center justify-between border p-3 rounded bg-white"
    >
      <span>{layer.name}</span>

      {/* Use inline-flex to force horizontal layout */}
      <div className="inline-flex items-center gap-2">
        <VSCodeButton appearance="icon" onClick={() => moveUp(layer.id)}>↑</VSCodeButton>
        <VSCodeButton appearance="icon" onClick={() => moveDown(layer.id)}>↓</VSCodeButton>
        <VSCodeButton appearance="icon" onClick={() => toggleActive(layer.id)}>
          {layer.visible ? 'Hide' : 'Show'}
        </VSCodeButton>
        <VSCodeButton appearance="icon" onClick={() => goToDetails(layer.id)}>›</VSCodeButton>
      </div>
    </div>
  ))}
</div>

<div className="space-y-2">
  {layers.map(layer => (
    <div
      key={layer.id}
      className="flex items-center justify-between border p-3 rounded bg-white"
    >
      <span>{layer.name}</span>

      {/* Use inline-flex to force horizontal layout */}
      <div className="inline-flex items-center gap-2">
        <div className="bg-blue-200 p-2">↑</div>
        <div className="bg-blue-200 p-2">↓</div>
        <div className="bg-blue-200 p-2">{layer.visible ? 'Hide' : 'Show'}</div>
        <div className="bg-blue-200 p-2">›</div>
      </div>
    </div>
  ))}
</div>

            <br/>
            <footer>
                <div>
                    <VSCodeButton appearance="icon" onClick={uploadConfig}>
                        <img src="/assets/upload.svg" alt="Upload" className="w-6 h-6" />
                    </VSCodeButton>
                    <VSCodeButton appearance="icon" onClick={saveConfig}>
                        <img src="./assets/upload.svg" alt="Save"/>
                    </VSCodeButton>
                    <VSCodeButton appearance="icon" onClick={recomputeAll}>{'↺'}</VSCodeButton>
                </div>

                <div>
                    <VSCodeButton onClick={addLayer}>{'+'}</VSCodeButton>
                </div>
            </footer>
        </div>
    );
}