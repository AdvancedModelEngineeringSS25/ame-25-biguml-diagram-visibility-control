package com.borkdominik.big.glsp.uml.core.features.visibility;

import java.util.List;

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.features.core.model.ModelSubmissionHandler;

import com.borkdominik.big.glsp.server.core.handler.action.BGActionHandler;
import com.google.inject.Inject;

public class SetVisibleElementsHandler extends BGActionHandler<SetVisibleElementsAction> {

    @Inject
    protected ModelSubmissionHandler modelSubmissionHandler;
    @Inject
    protected VisibleElementsService visibleElementsService;

    @Override
    protected List<Action> executeAction(SetVisibleElementsAction action) {
        this.visibleElementsService.setVisibleElements(action.getVisibleElementIds());
        return modelSubmissionHandler.submitModel();
    }

}
