/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton, VSCodeDivider, VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import type { Filter } from '../model/model.js';
import { PatternFilterEditor } from './PatternFilterEditor.js';
import { SelectionFilterEditor } from './SelectionFilterEditor.js';
import { TypeFilterEditor } from './TypeFilterEditor.js';

export function FilterDetailsView({
    layerId,
    filter,
    onBack,
    onChangeName,
    changePattern,
    toggleSelectedType,
    deleteSelectedElement,
    addSelection
}: {
    layerId: string;
    filter: Filter;
    onBack: () => void;
    onChangeName: (name: string) => void;
    changePattern: (layerId: string, filterId: string, pattern: string) => void;
    toggleSelectedType: (layeerId: string, filterId: string, type: string) => void;
    deleteSelectedElement: (id: string) => void;
    addSelection: (id: string) => void;
}) {
    return (
        <div className='flex flex-col gap-4'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px', marginLeft: '-4px' }}>
                <VSCodeButton
                    slot='anchor'
                    appearance='icon'
                    onClick={onBack}
                    style={{ display: 'flex', alignItems: 'center' }}
                    title='Go back to Layer'
                >
                    <div className='codicon codicon-chevron-left'></div>
                </VSCodeButton>
                <h2>Edit Filter</h2>
            </div>
            <VSCodeTextField
                onChange={e => {
                    const newValue = (e.target as HTMLInputElement).value;
                    onChangeName(newValue);
                }}
                value={filter.name}
            />
            <VSCodeDivider />
            {filter.type === 'type' && <TypeFilterEditor layerId={layerId} filter={filter} toggleSelectedType={toggleSelectedType} />}
            {filter.type === 'pattern' && <PatternFilterEditor layerId={layerId} filter={filter} changePattern={changePattern} />}
            {filter.type === 'selection' && (
                <SelectionFilterEditor filter={filter} deleteSelectedElement={deleteSelectedElement} addSelection={addSelection} />
            )}
        </div>
    );
}
