/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton, VSCodeDivider, VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import type { Layer } from '../model/model.js';

export function LayerDetailsView({ layer, onBack, deleteFilter, deleteLayer, addFilter, onFilterSelect }: {
    layer: Layer;
    onBack: () => void;
    deleteFilter: (id: string) => void;
    deleteLayer: (id: string) => void;
    addFilter: () => void;
    onFilterSelect: (id: string) => void;
}) {
    return (
        <div id="layer-details-view">
            <VSCodeButton slot='anchor' appearance='icon' onClick={onBack}>
                <div className='codicon codicon-chevron-left'></div>
            </VSCodeButton>
            <h2>Edit Layer</h2>
            <VSCodeTextField value={layer.name} />

            <h3>Filters</h3>
            {layer.filters.map(filter => (
                <div key={filter.id} className="className='reference-item-body">
                    <span>{filter.type}</span>
                    <div id="filter-buttons" className='reference-item-actions'>
                        <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => deleteFilter(filter.id)}>
                            <div className='codicon codicon-trash'></div>
                        </VSCodeButton>
                        <VSCodeButton slot='anchor' appearance='icon' onClick={() => onFilterSelect(filter.id)}>
                            <div className='codicon codicon-chevron-right'></div>
                        </VSCodeButton>
                    </div>
                </div>
            ))}
            <br />
            <VSCodeDivider />
            <footer>
                <div id="secondary-footer-buttons">
                    <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => deleteLayer(layer.id)}>
                        <div className='codicon codicon-trash'></div>
                    </VSCodeButton>
                </div>
                <div id="primary-footer-button">
                    <VSCodeButton slot='anchor' appearance='icon' onClick={addFilter}>
                        <div className='codicon codicon-add'></div>
                    </VSCodeButton>
                </div>
            </footer>
        </div>
    );
}