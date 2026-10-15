import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Bake static studio decorations by material; animation hooks retain their own objects. */
export function batchStatic(root: THREE.Group) {
  root.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, { meshes: THREE.Mesh[]; geometry: THREE.BufferGeometry[] }>();
  const inverse = root.matrixWorld.clone().invert();
  root.traverse(o => {
    if (!(o instanceof THREE.Mesh) || o instanceof THREE.InstancedMesh || Array.isArray(o.material)) return;
    for (let p: THREE.Object3D | null = o; p; p = p.parent) {
      if (p.userData.tick || !p.visible) return;
      if (p === root) break;
    }
    const g = o.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
    let batch = batches.get(o.material);
    if (!batch) { batch = { meshes: [], geometry: [] }; batches.set(o.material, batch); }
    batch.meshes.push(o); batch.geometry.push(g);
  });
  for (const [material, b] of batches) {
    // Different primitive types may have different attributes; merge compatible sets.
    const groups = new Map<string, number[]>();
    b.geometry.forEach((g, i) => {
      const key = Object.keys(g.attributes).sort().join(',') + Boolean(g.index);
      groups.set(key, [...(groups.get(key) || []), i]);
    });
    for (const indices of groups.values()) {
      const geometry = mergeGeometries(indices.map(i => b.geometry[i]));
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true; mesh.receiveShadow = true;
      indices.forEach(i => b.meshes[i].removeFromParent());
      root.add(mesh);
    }
    b.geometry.forEach(g => g.dispose());
  }
  return root;
}
