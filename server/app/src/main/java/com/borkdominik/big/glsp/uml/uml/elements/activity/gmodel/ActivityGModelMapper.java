/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.activity.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.Activity;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityGModelMapper extends BGEMFElementGModelMapper<Activity, GNode> {

   @Inject
   public ActivityGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GNode map(final Activity source) {
      return new GActivityBuilder<>(gcmodelContext, source, UMLTypes.ACTIVITY.prefix(representation))
         .buildGModel();
   }

   @Override
   public List<GModelElement> mapSiblings(final Activity source) {
      var siblings = new ArrayList<GModelElement>();

      // Edges are rendered within
      // siblings.addAll(mapHandler.handle(source.getEdges()));

      return siblings;
   }

}
