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

export function LayerDetailsView({ layer, onBack, onFilterSelect }: {
    layer: Layer;
    onBack: () => void;
    onFilterSelect: (id: string) => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            <VSCodeButton onClick={onBack}>Back to Layers</VSCodeButton>
            <h2>{layer.name}</h2>
            <p>Visible: {layer.visible ? 'Yes' : 'No'}</p>
            <h3>Filters</h3>
            {layer.filters.map(filter => (
                <div key={filter.id} className="border p-3 rounded bg-white flex justify-between items-center">
                    <div>Type: {filter.type}</div>
                    <VSCodeButton onClick={() => onFilterSelect(filter.id)}>Edit</VSCodeButton>
                </div>
            ))}
        </div>
    );
}