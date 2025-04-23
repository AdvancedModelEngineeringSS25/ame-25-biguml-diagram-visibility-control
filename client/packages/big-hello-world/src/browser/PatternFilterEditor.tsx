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

export function PatternFilterEditor({ filter, toggleSelectedType }: { filter: PatternFilter; toggleSelectedType: (id: string) => void }) {
    return (
        <div>
            <label>Pattern:</label>
            <VSCodeTextField value={filter.pattern} />
            <label>Types:</label>
            <div>
                {ALL_TYPES.map((type, index) => (
                    <div key={index}>
                        <BigCheckbox
                            label={type}
                            value={(filter.types ?? []).includes(type)}
                            onDidChangeValue={() => toggleSelectedType(type)}
                        ></BigCheckbox>
                    </div>
                ))}
            </div>
        </div>
    );
}
