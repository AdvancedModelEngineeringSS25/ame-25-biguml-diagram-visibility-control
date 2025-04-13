/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';
import { DiagramVisibilityControlActionResponse, RequestDiagramVisibilityControlAction } from '../common/index.js';


export function DiagramVisibilityControl(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [count, setCount] = useState(0);

    // TODO remove hardcoded list
    const [items] = useState([ 
        { id: 1, name: 'Diagram 1' },
        { id: 2, name: 'Diagram 2' },
        { id: 3, name: 'Diagram 3' }
    ]);

    useEffect(() => {
        listenAction(action => {
            if (DiagramVisibilityControlActionResponse.is(action)) {
                setCount(action.count);
            }
        });
    }, [listenAction]);

/*
    // TODO remove all count related code
    const increase1 = useCallback(() => {
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const increase5 = useCallback(() => {
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 5 }));
    }, [dispatchAction]);
*/

    const goToDetails = (id: number) => {
        console.log('goToDetails', id);
    };

    const moveUp = useCallback((id: number) => {
        console.log('moveUp', id);
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);
    
    const moveDown = useCallback((id: number) => {
        console.log('moveDown', id);
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const toggleActive = useCallback((id: number) => {
        console.log('toggleActive', id);
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const uploadConfig = useCallback(() => {
        console.log('uploadConfig');
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const saveConfig = useCallback(() => {
        console.log('saveConfig');
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const recomputeAll = useCallback(() => {
        console.log('recomputeAll');
        dispatchAction(RequestDiagramVisibilityControlAction.create({ increase: 1 }));
    }, [dispatchAction]);

    return (
        <div>
            <span>Diagram Visibility Control! {count}</span>

            <div>
                {items.map(item => (
                    <div key={item.id}>
                        <span>{item.name}</span>
                        <div>
                            <button onClick={() => moveUp(item.id)}>{'↑'}</button>
                            <button onClick={() => moveDown(item.id)}>{'↓'}</button>
                            <button onClick={() => toggleActive(item.id)}>{'>'}</button>
                            <button onClick={() => goToDetails(item.id)}>{'>'}</button>
                        </div>
                    </div>
                ))}
            </div>

            <footer>
                <div>
                    <button onClick={() => uploadConfig()}>
                        <img src="/assets/upload.svg" alt="Upload" className="w-6 h-6" />
                    </button>
                    <button onClick={() => saveConfig()}>
                        <img src="./assets/upload.svg" alt="Upload"/>
                    </button>
                    <button onClick={() => recomputeAll()}>{'↺'}</button>
                </div>

                <div>
                    <button>
                        + Add
                    </button>
                </div>
            </footer>
        </div>
    );
}
