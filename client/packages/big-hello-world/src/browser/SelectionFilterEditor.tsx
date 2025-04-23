/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BigTooltip } from '@borkdominik-biguml/big-components';
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
                    <div key={element} id="element-buttons">
                        <span>{element}</span>
                        <BigTooltip>
                            <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => deleteSelectedElement(element)}>
                                <div className='codicon codicon-trash'></div>
                            </VSCodeButton>
                            <span slot='text'>Delete</span>
                        </BigTooltip>
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
