/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react/index.js';
import type { Filter } from '../model/model.js';
import { TypeFilterEditor } from './TypeFilterEditor.js';
import { PatternFilterEditor } from './PatternFilterEditor.js';
import { SelectionFilterEditor } from './SelectionFilterEditor.js';

export function FilterDetailsView({
    filter,
    onBack
}: {
    filter: Filter;
    onBack: () => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            <VSCodeButton onClick={onBack}>Back</VSCodeButton>
            <h2>Edit Filter: {filter.type}</h2>
            {filter.type === 'type' && <TypeFilterEditor filter={filter} />}
            {filter.type === 'pattern' && <PatternFilterEditor filter={filter} />}
            {filter.type === 'selection' && <SelectionFilterEditor filter={filter} />}
        </div>
    );
}
