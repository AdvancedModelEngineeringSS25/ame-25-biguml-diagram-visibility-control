/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BigCheckbox } from '@borkdominik-biguml/big-components';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import type { PatternFilter } from '../model/model.js';
import { ALL_TYPES } from '../model/model.js';

export function PatternFilterEditor({
    layerId,
    filter,
    changePattern,
    toggleSelectedType
}: {
    layerId: string;
    filter: PatternFilter;
    changePattern: (layerId: string, filterId: string, pattern: string) => void;
    toggleSelectedType: (layerId: string, filterId: string, type: string) => void;
}) {
    return (
        <div>
            <label>Pattern:</label>
            <VSCodeTextField
                onChange={e => {
                    const newValue = (e.target as HTMLInputElement).value;
                    changePattern(layerId, filter.id, newValue);
                }}
                value={filter.pattern}
            />
            <small style={{ marginBlockStart: '0.5em' }}>If your input starts with &apos;/&apos; it is parsed as RegEx</small> <br />
            <label>Types:</label>
            <div>
                {ALL_TYPES.map((type, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                            <BigCheckbox
                                label=''
                                value={(filter.types ?? []).includes(type)}
                                onDidChangeValue={() => toggleSelectedType(layerId, filter.id, type)}
                            />
                            <span>{type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
