// NeuroStat mark: four facets and a dot, traced from the brand file.
// Coordinates are in the source image space; bbox is x 411-1588, y 285-1230.
export const NEUROSTAT_MARK = {
  x: 411,
  y: 285,
  width: 1177,
  height: 945,
  polygons: [
    [[968, 285], [692, 747], [968, 746]],
    [[959, 789], [667, 789], [411, 1224]],
    [[1010, 285], [1010, 592], [1469, 1048]],
    [[1588, 1230], [1011, 658], [1010, 806], [426, 1227], [989, 979]],
  ],
  circle: { cx: 986.6, cy: 1118.3, r: 63.9 },
};

export function neurostatMarkPaths() {
  const polys = NEUROSTAT_MARK.polygons
    .map((p) => `<polygon points="${p.map((q) => q.join(',')).join(' ')}"/>`)
    .join('');
  const { cx, cy, r } = NEUROSTAT_MARK.circle;
  return `${polys}<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
}
