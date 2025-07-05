/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import type { PatternFilter } from '../model/model.js';

export function PatternFilterEditor({
    layerId,
    filter,
    changePattern
}: {
    layerId: string;
    filter: PatternFilter;
    changePattern: (layerId: string, filterId: string, pattern: string) => void;
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
        </div>
    );
}
