/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { PatternFilter } from '../model/model.js';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';

export function PatternFilterEditor({ filter }: { filter: PatternFilter }) {
    return (
        <div>
            <label>Pattern:</label>
            <VSCodeTextField value={filter.pattern} />
        </div>
    );
}