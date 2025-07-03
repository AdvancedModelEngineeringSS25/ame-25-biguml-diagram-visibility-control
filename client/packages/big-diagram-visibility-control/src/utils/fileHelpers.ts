/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
// Minimal browser helper to pick a .json file and return its text
export const pickJsonFile = (): Promise<string | null> =>
    new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return resolve(null);
            file.text()
                .then(resolve)
                .catch(() => resolve(null));
        };
        input.click();
    });
