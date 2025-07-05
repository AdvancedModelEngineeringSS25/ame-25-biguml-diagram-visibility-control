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
    addLayer
}: {
    layers: Layer[];
    moveUp: (id: string) => void;
    moveDown: (id: string) => void;
    toggleActive: (id: string) => void;
    goToDetails: (id: string) => void;
    uploadConfig: () => void;
    saveConfig: () => void;
    addLayer: () => void;
}) {
    return (
        <div id='main-view'>
            <div id='layer-list'>
                <h2>Layers</h2>
                {[...layers]
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(layer => (
                        <div key={layer.id} id='layer' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                            <VSCodeButton
                                slot='anchor'
                                appearance='icon'
                                onClick={() => toggleActive(layer.id)}
                                title='Toggle Active State'
                            >
                                {layer.active ? (
                                    <div className='codicon codicon-pass-filled'></div>
                                ) : (
                                    <div className='codicon codicon-pass'></div>
                                )}
                            </VSCodeButton>

                            <span style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                                {layer.name}

                                <span className='type-display' style={{ opacity: 0.5, marginInline: 4 }}>
                                    {layer.type === 'show' ? (
                                        <div className='codicon codicon-eye' title='Layer shows Elements'></div>
                                    ) : (
                                        <div className='codicon codicon-eye-closed' title='Layer hides Elements'></div>
                                    )}
                                </span>
                            </span>
                            <div
                                id='layer-buttons'
                                style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}
                            >
                                <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveUp(layer.id)} title='Move Up'>
                                    <div className='codicon codicon-chevron-up'></div>
                                </VSCodeButton>
                                <VSCodeButton slot='anchor' appearance='icon' onClick={() => moveDown(layer.id)} title='Move Down'>
                                    <div className='codicon codicon-chevron-down'></div>
                                </VSCodeButton>
                                <VSCodeButton slot='anchor' appearance='icon' onClick={() => goToDetails(layer.id)} title='Configure Layer'>
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
                    <VSCodeButton slot='anchor' appearance='icon' onClick={uploadConfig} title='Import Configuration'>
                        <div className='codicon codicon-cloud-upload'></div>
                    </VSCodeButton>
                    <VSCodeButton slot='anchor' appearance='icon' onClick={saveConfig} title='Export Configuration'>
                        <div className='codicon codicon-cloud-download'></div>
                    </VSCodeButton>
                </div>
                <div id='primary-footer-button' style={{ marginLeft: 'auto' }}>
                    <VSCodeButton slot='anchor' appearance='icon' onClick={addLayer} title='Create new Layer'>
                        <div className='codicon codicon-add'></div>
                    </VSCodeButton>
                </div>
            </footer>
        </div>
    );
}
