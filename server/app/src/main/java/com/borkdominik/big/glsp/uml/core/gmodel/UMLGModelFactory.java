/********************************************************************************
 * Copyright (c) 2024 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.core.gmodel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.uml2.uml.Model;

import com.borkdominik.big.glsp.server.core.gmodel.BGEMFGModelFactory;
import com.borkdominik.big.glsp.uml.core.features.visibility.VisibleElementsService;
import com.google.inject.Inject;

public class UMLGModelFactory extends BGEMFGModelFactory {

   @Inject
   protected VisibleElementsService visibleElementsService;

   @Override
   protected void fillRootElement(final EObject semanticModel, final Diagram notationModel, final GModelRoot newRoot) {
      idCountGenerator.clearAll();

      if (newRoot instanceof GGraph graph) {
         newRoot.setId(idGenerator.getOrCreateId(semanticModel));

         var children = childrenOf(semanticModel).stream()
               .map(element -> {
                  var current = mapHandler.handle(element);
                  var siblings = mapHandler.handleSiblings(element);

                  var gmodels = new ArrayList<GModelElement>();
                  gmodels.add(current);
                  gmodels.addAll(siblings);

                  return gmodels;
               }).toList();

         children.forEach(elements -> {
            // Filter out elements that are not visible
            var visibleElements = filterOutNonVisibleElements(elements);
            graph.getChildren().addAll(visibleElements);
         });
      }
   }

   protected List<GModelElement> filterOutNonVisibleElements(final List<GModelElement> elements) {
      List<GModelElement> visibleElements = new ArrayList<>();

      for (GModelElement element : elements) {
         if (element instanceof GEdge edge) {
            if (isElementVisible(edge.getSourceId()) && isElementVisible(edge.getTargetId())) {
               // If both source and target are visible, add the edge
               visibleElements.add(edge);
            }
         } else if (element instanceof GNode node) {
            if (!isElementVisible(node.getId())) {
               continue;
            }

            if (node.getChildren() != null && !node.getChildren().isEmpty()) {
               // Create a new list with the filtered children
               var filteredChildren = filterOutNonVisibleElements(
                     new ArrayList<>(node.getChildren()));

               node.getChildren().clear();
               node.getChildren().addAll(filteredChildren);
            }

            visibleElements.add(element);
         } else {
            // Anything else needs to be added directly
            var filteredChildren = filterOutNonVisibleElements(
                  new ArrayList<>(element.getChildren()));

            element.getChildren().clear();
            element.getChildren().addAll(filteredChildren);
            visibleElements.add(element);
         }

      }

      return visibleElements;
   }

   protected boolean isElementVisible(String elementId) {
      return visibleElementsService.isVisible(elementId);
   }

   @Override
   protected Collection<? extends EObject> childrenOf(final EObject semanticModel) {
      var model = (Model) semanticModel;
      return model.getPackagedElements();
   }

}
