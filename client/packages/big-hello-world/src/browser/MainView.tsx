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

export function MainView({
    layers,
    moveUp,
    moveDown,
    toggleActive,
    goToDetails,
    uploadConfig,
    saveConfig,
    recomputeAll,
    addLayer
}: {
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
        <div id='main-view'>
            <div id='layer-list'>
                <h2>Layers</h2>
                {layers.map(layer => (
                    <div key={layer.id} id='layer' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                            {layer.name} {layer.zIndex}
                        </span>
                        <div
                            id='layer-buttons'
                            style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}
                        >
                            <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveUp(layer.id)}>
                                <div className='codicon codicon-chevron-up'></div>
                            </VSCodeButton>
                            <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveDown(layer.id)}>
                                <div className='codicon codicon-chevron-down'></div>
                            </VSCodeButton>
                            <VSCodeButton slot='anchor' appearance='icon' onClick={() => toggleActive(layer.id)}>
                                {layer.visible ? (
                                    <div className='codicon codicon-eye'></div>
                                ) : (
                                    <div className='codicon codicon-eye-closed'></div>
                                )}
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
            <footer style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                <div id='secondary-footer-buttons' style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
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
                <div id='primary-footer-button' style={{ marginLeft: 'auto' }}>
                    <VSCodeButton slot='anchor' appearance='icon' onClick={addLayer}>
                        <div className='codicon codicon-add'></div>
                    </VSCodeButton>
                </div>
            </footer>
        </div>
    );
}
