/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react/index.js';
import type { SelectionFilter } from '../model/model.js';

export function SelectionFilterEditor({ filter, deleteSelectedElement, startSelection }: {
    filter: SelectionFilter,
    deleteSelectedElement: (id: string) => void,
    startSelection: (id: string) => void
}) {
    return (
        <div>
            <label>Selected Elements:</label>
            <div>
                {filter.elements.map(element => (
                    <div key={element} id="element-buttons" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>{element}</span>
                        <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => deleteSelectedElement(element)}
                            style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}>
                            <div className='codicon codicon-trash'></div>
                        </VSCodeButton>
                    </div>
                ))}
            </div>
            <br />
            <VSCodeDivider />
            <VSCodeButton slot='anchor' appearance='icon' onClick={() => startSelection(filter.id)}>
                <div className='codicon codicon-check'></div>
            </VSCodeButton>
        </div>
    );
}
